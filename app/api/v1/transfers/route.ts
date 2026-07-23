import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { transferCreateSchema, paginationSchema } from '@/lib/validators'
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

  const fromWarehouseId = searchParams.get('fromWarehouseId')
  if (fromWarehouseId) where.fromWarehouseId = fromWarehouseId

  const toWarehouseId = searchParams.get('toWarehouseId')
  if (toWarehouseId) where.toWarehouseId = toWarehouseId

  const status = searchParams.get('status')
  if (status) where.status = status

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { transferNumber: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [transfers, total] = await Promise.all([
    prisma.transfer.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        fromWarehouse: true,
        toWarehouse: true,
        lines: { include: { item: true, fromLocation: true, toLocation: true } },
      },
    }),
    prisma.transfer.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: transfers,
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
  const parsed = transferCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const transferNumber = `TRF-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.transfer.count() + 1).padStart(5, '0')}`

  const transfer = await prisma.$transaction(async (tx) => {
    const transfer = await tx.transfer.create({
      data: {
        ...parsed.data,
        transferNumber,
        lines: {
          create: parsed.data.lines.map((line) => ({
            ...line,
            status: 'pending',
          })),
        },
      },
      include: { lines: { include: { item: true, fromLocation: true, toLocation: true } } },
    })

    await tx.inventoryTransaction.create({
      data: {
        tenantId: session.user.tenantId,
        type: 'TransferCreated',
        itemId: parsed.data.lines[0]?.itemId || '',
        qty: 0,
        beforeQty: 0,
        afterQty: 0,
        userId: session.user.id,
        idempotencyKey,
        metadata: { transferId: transfer.id },
      },
    })

    return transfer
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'Transfer',
    entityId: transfer.id,
    newValues: transfer,
  })

  return NextResponse.json({ success: true, data: transfer }, { status: 201 })
}