import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { partnerCreateSchema, paginationSchema } from '@/lib/validators'
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

  const type = searchParams.get('type')
  if (type) where.type = type

  const isActive = searchParams.get('isActive')
  if (isActive !== null) where.isActive = isActive === 'true'

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { code: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [partners, total] = await Promise.all([
    prisma.partner.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.partner.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: partners,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = partnerCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.partner.findUnique({
    where: { tenantId_code: { tenantId: session.user.tenantId, code: parsed.data.code } },
  })

  if (existing) {
    return NextResponse.json(
      { error: { code: 'DUPLICATE_CODE', message: 'Partner code already exists' } },
      { status: 409 }
    )
  }

  const partner = await prisma.partner.create({
    data: parsed.data,
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'Partner',
    entityId: partner.id,
    newValues: partner,
  })

  return NextResponse.json({ success: true, data: partner }, { status: 201 })
}