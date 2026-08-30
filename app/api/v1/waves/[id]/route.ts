import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const waveUpdateSchema = z.object({
  status: z.enum(['planned', 'released', 'in_progress', 'completed', 'cancelled']).optional(),
  releasedAt: z.string().datetime().optional().nullable(),
  startedAt: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  orderIds: z.array(z.string().cuid()).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const wave = await prisma.wave.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      warehouse: true,
      orders: {
        include: {
          customer: true,
          lines: { include: { item: { include: { baseUom: true } } } },
        },
      },
      tasks: {
        include: {
          assignedTo: { select: { id: true, name: true } },
          fromLocation: true,
          toLocation: true,
        },
      },
    },
  })

  if (!wave) {
    return NextResponse.json({ error: 'Wave not found' }, { status: 404 })
  }

  // Calculate progress
  const totalTasks = wave.tasks.length
  const completedTasks = wave.tasks.filter(t => t.status === 'completed').length
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return NextResponse.json({
    success: true,
    data: { ...wave, progress, totalTasks, completedTasks },
  })
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = waveUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.wave.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: { orders: true, tasks: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Wave not found' }, { status: 404 })
  }

  const wave = await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = { ...parsed.data }
    delete updateData.orderIds

    if (parsed.data.status === 'released' && existing.status === 'planned') {
      updateData.releasedAt = new Date()
    }
    if (parsed.data.status === 'in_progress' && existing.status === 'released') {
      updateData.startedAt = new Date()
    }
    if (parsed.data.status === 'completed' && existing.status === 'in_progress') {
      updateData.completedAt = new Date()
    }

    const wave = await tx.wave.update({
      where: { id },
      data: updateData,
      include: { orders: true, tasks: true },
    })

    if (parsed.data.orderIds) {
      // Sync orders
      await tx.wave.update({
        where: { id },
        data: {
          orders: {
            set: parsed.data.orderIds.map(id => ({ id })),
          },
        },
      })

      // Generate pick tasks for new orders
      for (const orderId of parsed.data.orderIds) {
        const order = await tx.outboundOrder.findUnique({
          where: { id: orderId },
          include: { lines: true },
        })

        if (order) {
          for (const line of order.lines) {
            const allocations = await tx.allocation.findMany({
              where: {
                outboundOrderId: orderId,
                outboundLineId: line.id,
                status: 'allocated',
                qty: { gt: 0 },
              },
              include: { inventory: { include: { location: true } } },
            })

            for (const alloc of allocations) {
              await tx.task.create({
                data: {
                  tenantId: session.user.tenantId,
                  warehouseId: wave.warehouseId,
                  waveId: wave.id,
                  type: 'pick',
                  priority: 50,
                  status: 'pending',
                  qty: alloc.qty,
                  itemId: alloc.itemId,
                  fromLocationId: alloc.locationId,
                  toLocationId: alloc.locationId, // Will be updated to staging
                  referenceType: 'Allocation',
                  referenceId: alloc.id,
                  outboundOrderId: orderId,
                  outboundLineId: line.id,
                },
              })
            }
          }
        }
      }
    }

    return wave
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'UPDATE',
    entityType: 'Wave',
    entityId: id,
    oldValues: existing,
    newValues: wave,
  })

  return NextResponse.json({ success: true, data: wave })
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  const existing = await prisma.wave.findFirst({
    where: { id, tenantId: session.user.tenantId },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Wave not found' }, { status: 404 })
  }

  let wave
  if (action === 'release') {
    wave = await prisma.wave.update({
      where: { id },
      data: { status: 'released', releasedAt: new Date() },
    })
  } else if (action === 'start') {
    wave = await prisma.wave.update({
      where: { id },
      data: { status: 'in_progress', startedAt: new Date() },
    })
  } else if (action === 'complete') {
    wave = await prisma.wave.update({
      where: { id },
      data: { status: 'completed', completedAt: new Date() },
    })
  } else if (action === 'cancel') {
    wave = await prisma.wave.update({
      where: { id },
      data: { status: 'cancelled' },
    })
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: action.toUpperCase(),
    entityType: 'Wave',
    entityId: id,
    newValues: wave,
  })

  return NextResponse.json({ success: true, data: wave })
}