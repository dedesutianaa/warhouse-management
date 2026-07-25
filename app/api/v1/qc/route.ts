import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { qcCreateSchema, paginationSchema } from '@/lib/validators'
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

  const type = searchParams.get('type')
  if (type) where.type = type

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { inspectionNumber: { contains: search, mode: 'insensitive' } },
      { referenceNumber: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [qcs, total] = await Promise.all([
    prisma.qcInspection.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        item: { include: { baseUom: true } },
        location: true,
        inspector: { select: { id: true, name: true } },
        approver: { select: { id: true, name: true } },
      },
    }),
    prisma.qcInspection.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: qcs,
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
  const parsed = qcCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const inspectionNumber = `QC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.qcInspection.count() + 1).padStart(5, '0')}`

  const qc = await prisma.$transaction(async (tx) => {
    const qc = await tx.qcInspection.create({
      data: {
        ...parsed.data,
        inspectionNumber,
        status: 'pending',
        inspectedById: session.user.id,
        inspectedAt: new Date(),
        checklists: {
          create: parsed.data.checklists?.map((c, idx) => ({
            ...c,
            sortOrder: idx,
          })) || [],
        },
      },
      include: { checklists: true },
    })

    await tx.inventoryTransaction.create({
      data: {
        tenantId: session.user.tenantId,
        type: 'QCCreated',
        itemId: parsed.data.itemId,
        qty: parsed.data.qty || 0,
        beforeQty: 0,
        afterQty: 0,
        userId: session.user.id,
        idempotencyKey,
        metadata: { qcId: qc.id },
      },
    })

    return qc
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'QCInspection',
    entityId: qc.id,
    newValues: qc,
  })

  return NextResponse.json({ success: true, data: qc }, { status: 201 })
}