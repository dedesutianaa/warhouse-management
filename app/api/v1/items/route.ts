import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { itemCreateSchema, paginationSchema } from '@/lib/validators'
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

  // Add filters from search params
  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { sku: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { barcodes: { some: { code: { contains: search } } } },
    ]
  }

  const categoryId = searchParams.get('categoryId')
  if (categoryId) where.categoryId = categoryId

  const brandId = searchParams.get('brandId')
  if (brandId) where.brandId = brandId

  const isActive = searchParams.get('isActive')
  if (isActive !== null) where.isActive = isActive === 'true'

  const abcClass = searchParams.get('abcClass')
  if (abcClass) where.abcClass = abcClass

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        category: true,
        brand: true,
        baseUom: true,
        barcodes: true,
        _count: {
          select: { inventory: true },
        },
      },
    }),
    prisma.item.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = itemCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  // Check for duplicate SKU
  const existing = await prisma.item.findUnique({
    where: { tenantId_sku: { tenantId: session.user.tenantId, sku: parsed.data.sku } },
  })

  if (existing) {
    return NextResponse.json(
      { error: { code: 'DUPLICATE_SKU', message: 'SKU already exists' } },
      { status: 409 }
    )
  }

  const item = await prisma.item.create({
    data: parsed.data,
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'Item',
    entityId: item.id,
    newValues: item,
  })

  return NextResponse.json({ success: true, data: item }, { status: 201 })
}