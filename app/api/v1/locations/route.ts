import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { locationCreateSchema, paginationSchema } from '@/lib/validators'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

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

  const zoneId = searchParams.get('zoneId')
  if (zoneId) where.zoneId = zoneId

  const type = searchParams.get('type')
  if (type) where.type = type

  const status = searchParams.get('status')
  if (status) where.status = status

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [locations, total] = await Promise.all([
    prisma.location.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { code: 'asc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        zone: true,
        parent: true,
        _count: {
          select: { inventories: true, children: true },
        },
      },
    }),
    prisma.location.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: locations,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = locationCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.location.findUnique({
    where: { warehouseId_code: { warehouseId: parsed.data.warehouseId, code: parsed.data.code } },
  })

  if (existing) {
    return NextResponse.json(
      { error: { code: 'DUPLICATE_CODE', message: 'Location code already exists in this warehouse' } },
      { status: 409 }
    )
  }

  const location = await prisma.location.create({
    data: parsed.data,
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'Location',
    entityId: location.id,
    newValues: location,
  })

  return NextResponse.json({ success: true, data: location }, { status: 201 })
}