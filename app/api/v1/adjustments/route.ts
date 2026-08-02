import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const adjustmentCreateSchema = z.object({
  warehouseId: z.string().cuid(),
  type: z.enum(['gain', 'loss', 'transfer', 'damage', 'expiry', 'recount']),
  reasonCodeId: z.string().cuid().optional(),
  lines: z.array(z.object({
    itemId: z.string().cuid(),
    locationId: z.string().cuid(),
    qty: z.number().int().default(0),
    lot: z.string().optional().nullable(),
    serialNumber: z.string().optional().nullable(),
    lpnId: z.string().cuid().optional().nullable(),
    reason: z.string().optional(),
  })).min(1),
  notes: z.string().optional(),
  requiresApproval: z.boolean().default(false),
})

const adjustmentUpdateSchema = z.object({
  status: z.enum(['draft', 'pending_approval', 'approved', 'rejected', 'posted', 'cancelled']).optional(),
  approvedAt: z.string().datetime().optional().nullable(),
  approvedById: z.string().cuid().optional().nullable(),
  postedAt: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
})

export async function GET(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = { tenantId: session.user.tenantId }

  const warehouseId = searchParams.get('warehouseId')
  if (warehouseId) where.warehouseId = warehouseId

  const status = searchParams.get('status')
  if (status) where.status = status

  const type = searchParams.get('type')
  if (type) where.type = type

  const search = searchParams.get('search')
  if (search) {
    where.OR = [
      { adjustmentNumber: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [adjustments, total] = await Promise.all([
    prisma.adjustment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        createdBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
        lines: { include: { item: { include: { baseUom: true } }, location: true } },
      },
    }),
    prisma.adjustment.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: adjustments,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  if (action === 'create') {
    const parsed = adjustmentCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const adjustmentNumber = `ADJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.adjustment.count() + 1).padStart(5, '0')}`

    const adjustment = await prisma.$transaction(async (tx) => {
      const adjustment = await tx.adjustment.create({
        data: {
          ...parsed.data,
          adjustmentNumber,
          tenantId: session.user.tenantId,
          createdById: session.user.id,
          status: parsed.data.requiresApproval ? 'pending_approval' : 'draft',
        },
        include: { lines: { include: { item: true, location: true } } },
      })

      return adjustment
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'Adjustment',
      entityId: adjustment.id,
      newValues: adjustment,
    })

    return NextResponse.json({ success: true, data: adjustment }, { status: 201 })
  }

  if (action === 'post') {
    const { adjustmentId } = body
    if (!adjustmentId) {
      return NextResponse.json({ error: 'adjustmentId required' }, { status: 400 })
    }

    const adjustment = await prisma.adjustment.findFirst({
      where: { id: adjustmentId, tenantId: session.user.tenantId },
      include: { lines: true },
    })

    if (!adjustment) {
      return NextResponse.json({ error: 'Adjustment not found' }, { status: 404 })
    }

    if (adjustment.status !== 'approved' && adjustment.status !== 'draft') {
      return NextResponse.json({ error: 'Adjustment must be approved or draft to post' }, { status: 400 })
    }

    const posted = await prisma.$transaction(async (tx) => {
      for (const line of adjustment.lines) {
        const inventory = await tx.inventory.findFirst({
          where: {
            tenantId: session.user.tenantId,
            itemId: line.itemId,
            locationId: line.locationId,
            lot: line.lot || null,
            serialNumber: line.serialNumber || null,
            lpnId: line.lpnId || null,
            status: 'Available',
          },
        })

        let beforeQty = 0
        let afterQty = 0

        if (inventory) {
          beforeQty = inventory.qty
          afterQty = inventory.qty + line.qty

          if (afterQty < 0) {
            throw new Error(`Insufficient inventory for item ${line.itemId} at location ${line.locationId}`)
          }

          await tx.inventory.update({
            where: { id: inventory.id },
            data: { qty: afterQty },
          })
        } else if (line.qty > 0) {
          // Create new inventory record for positive adjustment
          afterQty = line.qty
          await tx.inventory.create({
            data: {
              tenantId: session.user.tenantId,
              itemId: line.itemId,
              locationId: line.locationId,
              lot: line.lot,
              serialNumber: line.serialNumber,
              lpnId: line.lpnId,
              qty: line.qty,
              status: 'Available',
            },
          })
        } else {
          throw new Error(`No inventory found for negative adjustment on item ${line.itemId}`)
        }

        await tx.inventoryTransaction.create({
          data: {
            tenantId: session.user.tenantId,
            type: 'Adjustment',
            referenceType: 'Adjustment',
            referenceId: adjustmentId,
            itemId: line.itemId,
            locationId: line.locationId,
            lot: line.lot,
            serialNumber: line.serialNumber,
            lpnId: line.lpnId,
            qty: line.qty,
            beforeQty,
            afterQty,
            userId: session.user.id,
          },
        })
      }

      return await tx.adjustment.update({
        where: { id: adjustmentId },
        data: { status: 'posted', postedAt: new Date(), postedById: session.user.id },
      })
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'POST',
      entityType: 'Adjustment',
      entityId: adjustmentId,
      newValues: posted,
    })

    return NextResponse.json({ success: true, data: posted })
  }

  if (action === 'approve') {
    const { adjustmentId } = body
    if (!adjustmentId) {
      return NextResponse.json({ error: 'adjustmentId required' }, { status: 400 })
    }

    const adjustment = await prisma.adjustment.findFirst({
      where: { id: adjustmentId, tenantId: session.user.tenantId },
    })

    if (!adjustment) {
      return NextResponse.json({ error: 'Adjustment not found' }, { status: 404 })
    }

    if (adjustment.status !== 'pending_approval') {
      return NextResponse.json({ error: 'Adjustment is not pending approval' }, { status: 400 })
    }

    const approved = await prisma.adjustment.update({
      where: { id: adjustmentId },
      data: { status: 'approved', approvedAt: new Date(), approvedById: session.user.id },
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'APPROVE',
      entityType: 'Adjustment',
      entityId: adjustmentId,
      newValues: approved,
    })

    return NextResponse.json({ success: true, data: approved })
  }

  if (action === 'reject') {
    const { adjustmentId, reason } = body
    if (!adjustmentId) {
      return NextResponse.json({ error: 'adjustmentId required' }, { status: 400 })
    }

    const rejected = await prisma.adjustment.update({
      where: { id: adjustmentId },
      data: { status: 'rejected', notes: reason },
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'REJECT',
      entityType: 'Adjustment',
      entityId: adjustmentId,
      newValues: rejected,
    })

    return NextResponse.json({ success: true, data: rejected })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}