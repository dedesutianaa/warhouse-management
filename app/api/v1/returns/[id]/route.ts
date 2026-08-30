import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const returnUpdateSchema = z.object({
  status: z.enum(['RMA_CREATED', 'RECEIVED', 'INSPECTION', 'DISPOSITION_PENDING', 'RESTOCKED', 'REFURBISH', 'QUARANTINE', 'SCRAPPED', 'RTV', 'COMPLETED']).optional(),
  receivedAt: z.string().datetime().optional().nullable(),
  receivedById: z.string().cuid().optional().nullable(),
  inspectedAt: z.string().datetime().optional().nullable(),
  inspectedById: z.string().cuid().optional().nullable(),
  grade: z.enum(['A', 'B', 'C', 'DAMAGED']).optional().nullable(),
  disposition: z.string().optional().nullable(),
  dispositionAt: z.string().datetime().optional().nullable(),
  dispositionById: z.string().cuid().optional().nullable(),
  refundAmount: z.number().optional().nullable(),
  refundStatus: z.string().optional().nullable(),
  notes: z.string().optional(),
  lines: z.array(z.object({
    id: z.string().cuid(),
    grade: z.enum(['A', 'B', 'C', 'DAMAGED']).optional().nullable(),
    disposition: z.string().optional().nullable(),
    locationId: z.string().cuid().optional().nullable(),
    photos: z.array(z.string().url()).default([]),
  })).optional(),
})

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const returnOrder = await prisma.return.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      warehouse: true,
      customer: true,
      order: { include: { lines: { include: { item: true } } } },
      lines: { include: { item: true, location: true } },
    },
  })

  if (!returnOrder) {
    return NextResponse.json({ error: 'Return not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: returnOrder })
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
  const parsed = returnUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.return.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: { lines: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Return not found' }, { status: 404 })
  }

  const returnOrder = await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = { ...parsed.data }
    delete updateData.lines

    // Handle status transitions
    if (parsed.data.status === 'RECEIVED' && !existing.receivedAt) {
      updateData.receivedAt = new Date()
      updateData.receivedById = session.user.id
    }
    if (parsed.data.status === 'INSPECTION' && !existing.inspectedAt) {
      updateData.inspectedAt = new Date()
      updateData.inspectedById = session.user.id
    }
    if (parsed.data.disposition && !existing.dispositionAt) {
      updateData.dispositionAt = new Date()
      updateData.dispositionById = session.user.id
    }

    const returnOrder = await tx.return.update({
      where: { id },
      data: updateData,
      include: { lines: { include: { item: true, location: true } } },
    })

    // Update lines if provided
    if (parsed.data.lines) {
      for (const line of parsed.data.lines) {
        await tx.returnLine.update({
          where: { id: line.id },
          data: {
            grade: line.grade,
            disposition: line.disposition,
            locationId: line.locationId,
            photos: line.photos,
          },
        })

        // If disposition is RESTOCKED, create inventory
        if (line.disposition === 'RESTOCKED' && line.locationId) {
          const returnLine = await tx.returnLine.findUnique({ where: { id: line.id } })
          if (returnLine) {
            const inventory = await tx.inventory.findFirst({
              where: {
                tenantId: session.user.tenantId,
                itemId: returnLine.itemId,
                locationId: line.locationId,
                lot: returnLine.lot || null,
                status: 'Available',
              },
            })

            if (inventory) {
              await tx.inventory.update({
                where: { id: inventory.id },
                data: { qty: { increment: returnLine.qty } },
              })
            } else {
              await tx.inventory.create({
                data: {
                  tenantId: session.user.tenantId,
                  itemId: returnLine.itemId,
                  locationId: line.locationId,
                  lot: returnLine.lot,
                  qty: returnLine.qty,
                  status: 'Available',
                },
              })
            }

            await tx.inventoryTransaction.create({
              data: {
                tenantId: session.user.tenantId,
                type: 'ReturnRestock',
                referenceType: 'Return',
                referenceId: returnOrder.id,
                itemId: returnLine.itemId,
                locationId: line.locationId,
                lot: returnLine.lot,
                qty: returnLine.qty,
                beforeQty: inventory?.qty || 0,
                afterQty: (inventory?.qty || 0) + returnLine.qty,
                userId: session.user.id,
              },
            })
          }
        }
      }
    }

    // Check if all lines have disposition
    const updatedLines = await tx.returnLine.findMany({ where: { returnId: id } })
    const allDispositioned = updatedLines.every(l => l.disposition)
    if (allDispositioned && returnOrder.status !== 'COMPLETED') {
      await tx.return.update({
        where: { id },
        data: { status: 'COMPLETED' },
      })
    }

    return returnOrder
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'UPDATE',
    entityType: 'Return',
    entityId: id,
    oldValues: existing,
    newValues: returnOrder,
  })

  return NextResponse.json({ success: true, data: returnOrder })
}