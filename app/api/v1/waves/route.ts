import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { waveCreateSchema, paginationSchema } from '@/lib/validators'
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

  const status = searchParams.get('status')
  if (status) where.status = status

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { waveNumber: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [waves, total] = await Promise.all([
    prisma.wave.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        orders: { include: { customer: true } },
        _count: { select: { tasks: true, orders: true } },
      },
    }),
    prisma.wave.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: waves,
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
  const parsed = waveCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const waveNumber = `WAV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.wave.count() + 1).padStart(5, '0')}`

  const wave = await prisma.$transaction(async (tx) => {
    const wave = await tx.wave.create({
      data: {
        ...parsed.data,
        waveNumber,
        status: 'planned',
        orders: parsed.data.orderIds
          ? { connect: parsed.data.orderIds.map(id => ({ id })) }
          : undefined,
      },
      include: { orders: { include: { customer: true } } },
    })

    await tx.inventoryTransaction.create({
      data: {
        tenantId: session.user.tenantId,
        type: 'WaveCreated',
        itemId: '',
        qty: 0,
        beforeQty: 0,
        afterQty: 0,
        userId: session.user.id,
        idempotencyKey,
        metadata: { waveId: wave.id },
      },
    })

    return wave
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'Wave',
    entityId: wave.id,
    newValues: wave,
  })

  return NextResponse.json({ success: true, data: wave }, { status: 201 })
}