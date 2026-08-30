import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const transferUpdateSchema = z.object({
  status: z.enum(['DRAFT', 'IN_TRANSIT', 'RECEIVED', 'COMPLETED', 'CANCELLED']).optional(),
  shippedAt: z.string().datetime().optional().nullable(),
  receivedAt: z.string().datetime().optional().nullable(),
  eta: z.string().datetime().optional().nullable(),
  notes: z.string().optional(),
  lines: z.array(z.object({
    id: z.string().cuid(),
    receivedQty: z.number().nonnegative().optional(),
    toLocationId: z.string().cuid().optional().nullable(),
    status: z.enum(['pending', 'shipped', 'received', 'partial']).optional(),
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

  const transfer = await prisma.transfer.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      fromWarehouse: true,
      toWarehouse: true,
      lines: { include: { item: true, fromLocation: true, toLocation: true } },
    },
  })

  if (!transfer) {
    return NextResponse.json({ error: 'Transfer not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: transfer })
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
  const parsed = transferUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.transfer.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: { lines: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Transfer not found' }, { status: 404 })
  }

  const transfer = await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = { ...parsed.data }
    delete updateData.lines

    if (parsed.data.status === 'IN_TRANSIT' && !existing.shippedAt) {
      updateData.shippedAt = new Date()
    }
    if (parsed.data.status === 'RECEIVED' && !existing.receivedAt) {
      updateData.receivedAt = new Date()
    }

    const transfer = await tx.transfer.update({
      where: { id },
      data: updateData,
      include: { lines: { include: { item: true, fromLocation: true, toLocation: true } } },
    })

    if (parsed.data.lines) {
      for (const line of parsed.data.lines) {
        const existingLine = existing.lines.find(l => l.id === line.id)
        if (!existingLine) continue

        await tx.transferLine.update({
          where: { id: line.id },
          data: {
            receivedQty: line.receivedQty ?? existingLine.receivedQty,
            toLocationId: line.toLocationId ?? existingLine.toLocationId,
            status: line.status ?? existingLine.status,
          },
        })

        // If received, update inventory at destination
        if ((line.status === 'received' || line.receivedQty && line.receivedQty > 0) && line.toLocationId) {
          const receiveQty = line.receivedQty || existingLine.qty

          // Create inventory at destination
          const destInventory = await tx.inventory.findFirst({
            where: {
              tenantId: session.user.tenantId,
              itemId: existingLine.itemId,
              locationId: line.toLocationId,
              lot: existingLine.lot || null,
              status: 'Available',
            },
          })

          if (destInventory) {
            await tx.inventory.update({
              where: { id: destInventory.id },
              data: { qty: { increment: receiveQty } },
            })
          } else {
            await tx.inventory.create({
              data: {
                tenantId: session.user.tenantId,
                itemId: existingLine.itemId,
                locationId: line.toLocationId,
                lot: existingLine.lot,
                qty: receiveQty,
                status: 'Available',
              },
            })
          }

          await tx.inventoryTransaction.create({
            data: {
              tenantId: session.user.tenantId,
              type: 'TransferIn',
              referenceType: 'Transfer',
              referenceId: transfer.id,
              itemId: existingLine.itemId,
              locationId: line.toLocationId,
              lot: existingLine.lot,
              qty: receiveQty,
              beforeQty: destInventory?.qty || 0,
              afterQty: (destInventory?.qty || 0) + receiveQty,
              userId: session.user.id,
            },
          })
        }
      }

      // Check if all lines received
      const updatedLines = await tx.transferLine.findMany({ where: { transferId: id } })
      const allReceived = updatedLines.every(l => l.receivedQty >= l.qty)
      if (allReceived && transfer.status !== 'COMPLETED') {
        await tx.transfer.update({
          where: { id },
          data: { status: 'COMPLETED', receivedAt: new Date() },
        })
      }
    }

    return transfer
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'UPDATE',
    entityType: 'Transfer',
    entityId: id,
    oldValues: existing,
    newValues: transfer,
  })

  return NextResponse.json({ success: true, data: transfer })
}