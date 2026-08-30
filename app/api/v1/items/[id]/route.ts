import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { itemUpdateSchema } from '@/lib/validators'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const item = await prisma.item.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      barcodes: true,
      uoms: { include: { uom: true } },
      category: true,
      brand: true,
      putawayRule: true,
      pickingRule: true,
      replenRule: true,
      allocationRule: true,
      variants: true,
      boms: { include: { component: true } },
      components: { include: { parent: true } },
    },
  })

  if (!item) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  return NextResponse.json(item)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = itemUpdateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.item.findFirst({
    where: { id, tenantId: session.user.tenantId },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  const item = await prisma.item.update({
    where: { id },
    data: parsed.data,
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'UPDATE',
    entityType: 'Item',
    entityId: id,
    oldValues: existing,
    newValues: item,
  })

  return NextResponse.json(item)
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await prisma.item.findFirst({
    where: { id, tenantId: session.user.tenantId },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 })
  }

  await prisma.item.delete({ where: { id } })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'DELETE',
    entityType: 'Item',
    entityId: id,
    oldValues: existing,
  })

  return NextResponse.json({ ok: true })
}