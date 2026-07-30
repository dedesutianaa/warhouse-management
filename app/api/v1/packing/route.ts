import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const cartonCreateSchema = z.object({
  outboundOrderId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  cartonTypeId: z.string().cuid().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
})

const packItemSchema = z.object({
  cartonId: z.string().cuid(),
  itemId: z.string().cuid(),
  qty: z.number().positive(),
  lot: z.string().optional().nullable(),
  serialNumber: z.string().optional().nullable(),
  taskId: z.string().cuid().optional().nullable(),
})

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {
    tenantId: session.user.tenantId,
  }

  const outboundOrderId = searchParams.get('outboundOrderId')
  if (outboundOrderId) where.outboundOrderId = outboundOrderId

  const status = searchParams.get('status')
  if (status) where.status = status

  const [cartons, total] = await Promise.all([
    prisma.carton.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        outboundOrder: { include: { customer: true } },
        cartonType: true,
        items: { include: { item: { include: { baseUom: true } } } },
      },
    }),
    prisma.carton.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: cartons,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  if (action === 'create') {
    const parsed = cartonCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const cartonNumber = `CTN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.carton.count() + 1).padStart(6, '0')}`

    const carton = await prisma.carton.create({
      data: {
        ...parsed.data,
        cartonNumber,
        tenantId: session.user.tenantId,
        status: 'open',
        packedById: session.user.id,
      },
      include: { cartonType: true, outboundOrder: true },
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'Carton',
      entityId: carton.id,
      newValues: carton,
    })

    return NextResponse.json({ success: true, data: carton }, { status: 201 })
  }

  if (action === 'pack') {
    const parsed = packItemSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const carton = await prisma.carton.findFirst({
      where: { id: parsed.data.cartonId, tenantId: session.user.tenantId },
    })

    if (!carton) {
      return NextResponse.json({ error: 'Carton not found' }, { status: 404 })
    }

    if (carton.status !== 'open') {
      return NextResponse.json({ error: 'Carton is not open for packing' }, { status: 400 })
    }

    const item = await prisma.item.findUnique({ where: { id: parsed.data.itemId } })
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 })
    }

    const packedItem = await prisma.$transaction(async (tx) => {
      const packedItem = await tx.cartonItem.create({
        data: {
          ...parsed.data,
          tenantId: session.user.tenantId,
        },
      })

      // Update carton weight
      if (item.weight) {
        await tx.carton.update({
          where: { id: parsed.data.cartonId },
          data: { weight: { increment: item.weight * parsed.data.qty } },
        })
      }

      // If from task, update task
      if (parsed.data.taskId) {
        await tx.task.update({
          where: { id: parsed.data.taskId },
          data: { status: 'completed', completedAt: new Date() },
        })
      }

      return packedItem
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'PACK',
      entityType: 'CartonItem',
      entityId: packedItem.id,
      newValues: packedItem,
    })

    return NextResponse.json({ success: true, data: packedItem })
  }

  if (action === 'close') {
    const { cartonId } = body
    if (!cartonId) {
      return NextResponse.json({ error: 'cartonId required' }, { status: 400 })
    }

    const carton = await prisma.carton.findFirst({
      where: { id: cartonId, tenantId: session.user.tenantId },
      include: { items: true },
    })

    if (!carton) {
      return NextResponse.json({ error: 'Carton not found' }, { status: 404 })
    }

    if (carton.items.length === 0) {
      return NextResponse.json({ error: 'Cannot close empty carton' }, { status: 400 })
    }

    const updated = await prisma.carton.update({
      where: { id: cartonId },
      data: {
        status: 'closed',
        closedAt: new Date(),
        closedById: session.user.id,
      },
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'CLOSE',
      entityType: 'Carton',
      entityId: cartonId,
      newValues: updated,
    })

    return NextResponse.json({ success: true, data: updated })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}