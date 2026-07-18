import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { paginationSchema } from '@/lib/validators'
import { auth } from '@/lib/auth'

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

  const itemId = searchParams.get('itemId')
  if (itemId) where.itemId = itemId

  const locationId = searchParams.get('locationId')
  if (locationId) where.locationId = locationId

  const lpnId = searchParams.get('lpnId')
  if (lpnId) where.lpnId = lpnId

  const lot = searchParams.get('lot')
  if (lot) where.lot = lot

  const serialNumber = searchParams.get('serialNumber')
  if (serialNumber) where.serialNumber = serialNumber

  const status = searchParams.get('status')
  if (status) where.status = status

  const ownerId = searchParams.get('ownerId')
  if (ownerId) where.ownerId = ownerId

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { item: { sku: { contains: search, mode: 'insensitive' } } },
      { item: { name: { contains: search, mode: 'insensitive' } } },
      { location: { code: { contains: search, mode: 'insensitive' } } },
      { lpn: { code: { contains: search, mode: 'insensitive' } } },
    ]
  }

  const [inventory, total] = await Promise.all([
    prisma.inventory.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        item: { include: { baseUom: true, category: true } },
        location: { include: { zone: true, warehouse: true } },
        lpn: true,
        owner: true,
      },
    }),
    prisma.inventory.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: inventory,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}