import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { outboundOrderCreateSchema, paginationSchema, allocationSchema } from '@/lib/validators'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { generateIdempotencyKey } from '@/lib/security'

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const parsed = paginationSchema.safeParse(Object.fromEntries(searchParams))

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { page, limit, sortBy, sortOrder } = parsed.data
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {
    tenantId: session.user.tenantId,
  }

  const warehouseId = searchParams.get('warehouseId')
  if (warehouseId) where.warehouseId = warehouseId

  const customerId = searchParams.get('customerId')
  if (customerId) where.customerId = customerId

  const carrierId = searchParams.get('carrierId')
  if (carrierId) where.carrierId = carrierId

  const status = searchParams.get('status')
  if (status) where.status = status

  const channel = searchParams.get('channel')
  if (channel) where.channel = channel

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
      { referenceNumber: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [orders, total] = await Promise.all([
    prisma.outboundOrder.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        customer: true,
        carrier: true,
        lines: { include: { item: true } },
        _count: { select: { lines: true, allocations: true, shipments: true } },
      },
    }),
    prisma.outboundOrder.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: orders,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const idempotencyKey = request.headers.get('idempotency-key') || generateIdempotencyKey()
  const existingTx = await prisma.inventoryTransaction.findUnique({
    where: { idempotencyKey },
  })

  if (existingTx) {
    return NextResponse.json(
      { error: { code: 'IDEMPOTENCY_KEY_USED', message: 'Request already processed' } },
      { status: 409 }
    )
  }

  const body = await request.json()
  const parsed = outboundOrderCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const orderNumber = `SO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.outboundOrder.count() + 1).padStart(6, '0')}`

  const order = await prisma.$transaction(async (tx) => {
    const outboundOrder = await tx.outboundOrder.create({
      data: {
        ...parsed.data,
        orderNumber,
        lines: {
          create: parsed.data.lines.map((line, index) => ({
            ...line,
            sequence: index + 1,
          })),
        },
      },
      include: { lines: { include: { item: true } } },
    })

    await tx.inventoryTransaction.create({
      data: {
        tenantId: session.user.tenantId,
        type: 'OrderCreated',
        itemId: parsed.data.lines[0]?.itemId || '',
        qty: 0,
        beforeQty: 0,
        afterQty: 0,
        userId: session.user.id,
        idempotencyKey,
        metadata: { orderId: outboundOrder.id },
      },
    })

    return outboundOrder
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'OutboundOrder',
    entityId: order.id,
    newValues: order,
  })

  return NextResponse.json({ success: true, data: order }, { status: 201 })
}