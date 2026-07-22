import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { returnCreateSchema, paginationSchema } from '@/lib/validators'
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

  const status = searchParams.get('status')
  if (status) where.status = status

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { rmaNumber: { contains: search, mode: 'insensitive' } },
      { customer: { name: { contains: search, mode: 'insensitive' } } },
    ]
  }

  const [returns, total] = await Promise.all([
    prisma.return.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        customer: true,
        order: true,
        lines: { include: { item: true } },
      },
    }),
    prisma.return.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: returns,
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
  const parsed = returnCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const rmaNumber = `RMA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.return.count() + 1).padStart(5, '0')}`

  const returnOrder = await prisma.$transaction(async (tx) => {
    const returnOrder = await tx.return.create({
      data: {
        ...parsed.data,
        rmaNumber,
        lines: {
          create: parsed.data.lines.map((line) => ({
            ...line,
          })),
        },
      },
      include: { lines: { include: { item: true } } },
    })

    await tx.inventoryTransaction.create({
      data: {
        tenantId: session.user.tenantId,
        type: 'ReturnCreated',
        itemId: parsed.data.lines[0]?.itemId || '',
        qty: 0,
        beforeQty: 0,
        afterQty: 0,
        userId: session.user.id,
        idempotencyKey,
        metadata: { returnId: returnOrder.id },
      },
    })

    return returnOrder
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'Return',
    entityId: returnOrder.id,
    newValues: returnOrder,
  })

  return NextResponse.json({ success: true, data: returnOrder }, { status: 201 })
}