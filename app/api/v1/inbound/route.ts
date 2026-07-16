import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { inboundOrderCreateSchema, paginationSchema } from '@/lib/validators'
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

  const supplierId = searchParams.get('supplierId')
  if (supplierId) where.supplierId = supplierId

  const status = searchParams.get('status')
  if (status) where.status = status

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { referenceNumber: { contains: search, mode: 'insensitive' } },
      { supplier: { name: { contains: search, mode: 'insensitive' } } },
    ]
  }

  const [orders, total] = await Promise.all([
    prisma.inboundOrder.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        supplier: true,
        dock: true,
        assignedTo: { select: { id: true, name: true } },
        _count: { select: { lines: true, receipts: true } },
      },
    }),
    prisma.inboundOrder.count({ where }),
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

  // Check idempotency key
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
  const parsed = inboundOrderCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const order = await prisma.$transaction(async (tx) => {
    const inboundOrder = await tx.inboundOrder.create({
      data: {
        ...parsed.data,
        lines: {
          create: parsed.data.lines.map((line, index) => ({
            ...line,
            sequence: index + 1,
          })),
        },
      },
      include: { lines: true },
    })

    await tx.inventoryTransaction.create({
      data: {
        tenantId: session.user.tenantId,
        type: 'InboundOrderCreated',
        itemId: parsed.data.lines[0]?.itemId || '',
        qty: 0,
        beforeQty: 0,
        afterQty: 0,
        userId: session.user.id,
        idempotencyKey,
        metadata: { inboundOrderId: inboundOrder.id },
      },
    })

    return inboundOrder
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'InboundOrder',
    entityId: order.id,
    newValues: order,
  })

  return NextResponse.json({ success: true, data: order }, { status: 201 })
}