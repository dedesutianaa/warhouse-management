import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const cycleCountItemUpdateSchema = z.object({
  countedQty: z.number().nonnegative(),
  notes: z.string().optional(),
})

const cycleCountUpdateSchema = z.object({
  status: z.enum(['draft', 'in_progress', 'completed', 'cancelled']).optional(),
  assignedToId: z.string().cuid().optional().nullable(),
  startedAt: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  items: z.array(z.object({
    id: z.string().cuid(),
    countedQty: z.number().nonnegative(),
    notes: z.string().optional(),
  })).optional(),
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

  const cycleCount = await prisma.cycleCount.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      warehouse: true,
      assignedTo: { select: { id: true, name: true } },
      items: {
        include: { item: { include: { baseUom: true } }, location: true, lpn: true, countedBy: { select: { name: true } } },
        orderBy: { location: { code: 'asc' } },
      },
      locations: { include: { location: true } },
    },
  })

  if (!cycleCount) {
    return NextResponse.json({ error: 'Cycle count not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: cycleCount })
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
  const parsed = cycleCountUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.cycleCount.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: { items: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Cycle count not found' }, { status: 404 })
  }

  const cycleCount = await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = { ...parsed.data }
    delete updateData.items

    if (parsed.data.status === 'in_progress' && !existing.startedAt) {
      updateData.startedAt = new Date()
    }
    if (parsed.data.status === 'completed' && !existing.completedAt) {
      updateData.completedAt = new Date()
    }

    const cycleCount = await tx.cycleCount.update({
      where: { id },
      data: updateData,
      include: { items: { include: { item: { include: { baseUom: true } }, location: true } } },
    })

    if (parsed.data.items) {
      let varianceCount = 0
      for (const item of parsed.data.items) {
        const existingItem = existing.items.find(i => i.id === item.id)
        if (!existingItem) continue

        const varianceQty = item.countedQty - existingItem.systemQty
        const itemValue = await tx.item.findUnique({ where: { id: existingItem.itemId } })
        const varianceValue = varianceQty * (itemValue?.baseUom ? 1 : 0) // Simplified

        const needsRecount = Math.abs(varianceQty) > 0 && Math.abs(varianceQty) / existingItem.systemQty > 0.05 // 5% tolerance

        await tx.cycleCountItem.update({
          where: { id: item.id },
          data: {
            countedQty: item.countedQty,
            varianceQty,
            varianceValue,
            status: needsRecount ? 'variance' : 'counted',
            countedAt: new Date(),
            countedById: session.user.id,
            recountRequired: needsRecount,
            notes: item.notes,
          },
        })

        if (varianceQty !== 0) varianceCount++

        // Create inventory transaction for variance
        if (varianceQty !== 0) {
          await tx.inventoryTransaction.create({
            data: {
              tenantId: session.user.tenantId,
              type: 'CycleCount',
              referenceType: 'CycleCount',
              referenceId: cycleCount.id,
              itemId: existingItem.itemId,
              locationId: existingItem.locationId,
              lpnId: existingItem.lpnId,
              lot: existingItem.lot,
              serialNumber: existingItem.serialNumber,
              qty: varianceQty,
              beforeQty: existingItem.systemQty,
              afterQty: item.countedQty,
              userId: session.user.id,
            },
          })
        }
      }

      const countedItems = cycleCount.items.filter(i => i.status === 'counted' || i.status === 'variance').length
      await tx.cycleCount.update({
        where: { id },
        data: {
          countedLocations: countedItems,
          varianceCount,
        },
      })
    }

    return cycleCount
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'UPDATE',
    entityType: 'CycleCount',
    entityId: id,
    oldValues: existing,
    newValues: cycleCount,
  })

  return NextResponse.json({ success: true, data: cycleCount })
}