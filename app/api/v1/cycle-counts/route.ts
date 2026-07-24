import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cycleCountCreateSchema, paginationSchema } from '@/lib/validators'
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
      { countNumber: { contains: search, mode: 'insensitive' } },
      { scope: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [counts, total] = await Promise.all([
    prisma.cycleCount.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        assignedTo: { select: { id: true, name: true } },
        _count: { select: { items: true, locations: true } },
      },
    }),
    prisma.cycleCount.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: counts,
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
  const parsed = cycleCountCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const countNumber = `CC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.cycleCount.count() + 1).padStart(5, '0')}`

  // Determine locations and items to count
  let locationIds = parsed.data.locationIds || []
  let itemIds = parsed.data.itemIds || []

  if (locationIds.length === 0 && itemIds.length === 0) {
    // Auto-select based on scope
    if (parsed.data.scope.includes('Zona')) {
      const zoneCode = parsed.data.scope.split('·')[1]?.trim() || parsed.data.scope
      const zone = await prisma.zone.findFirst({
        where: { warehouseId: parsed.data.warehouseId, name: { contains: zoneCode } },
      })
      if (zone) {
        const locs = await prisma.location.findMany({
          where: { zoneId: zone.id, type: 'storage', status: 'active' },
          select: { id: true },
        })
        locationIds = locs.map(l => l.id)
      }
    }
  }

  // Get items to count
  const inventoryItems = await prisma.inventory.findMany({
    where: {
      tenantId: session.user.tenantId,
      ...(locationIds.length > 0 ? { locationId: { in: locationIds } } : {}),
      ...(itemIds.length > 0 ? { itemId: { in: itemIds } } : {}),
      status: { in: ['Available', 'Allocated'] },
    },
    distinct: ['itemId', 'locationId', 'lot'],
    select: { itemId: true, locationId: true, lot: true, lpnId: true, serialNumber: true, qty: true },
  })

  const cycleCount = await prisma.$transaction(async (tx) => {
    const cycleCount = await tx.cycleCount.create({
      data: {
        ...parsed.data,
        countNumber,
        totalLocations: locationIds.length || inventoryItems.length,
        locations: {
          create: locationIds.map(locId => ({ locationId: locId })),
        },
        items: {
          create: inventoryItems.map(inv => ({
            itemId: inv.itemId,
            locationId: inv.locationId,
            lpnId: inv.lpnId,
            lot: inv.lot,
            serialNumber: inv.serialNumber,
            systemQty: inv.qty,
          })),
        },
      },
      include: { items: true, locations: true },
    })

    await tx.inventoryTransaction.create({
      data: {
        tenantId: session.user.tenantId,
        type: 'CycleCountCreated',
        itemId: inventoryItems[0]?.itemId || '',
        qty: 0,
        beforeQty: 0,
        afterQty: 0,
        userId: session.user.id,
        idempotencyKey,
        metadata: { cycleCountId: cycleCount.id },
      },
    })

    return cycleCount
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'CycleCount',
    entityId: cycleCount.id,
    newValues: cycleCount,
  })

  return NextResponse.json({ success: true, data: cycleCount }, { status: 201 })
}