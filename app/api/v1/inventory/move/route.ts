import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { inventoryMoveSchema } from '@/lib/validators'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { generateIdempotencyKey } from '@/lib/security'

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
  const parsed = inventoryMoveSchema.safeParse({ ...body, tenantId: session.user.tenantId, performedById: session.user.id })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // Find source inventory
      const sourceInventory = await tx.inventory.findFirst({
        where: {
          tenantId: parsed.data.tenantId,
          itemId: parsed.data.itemId,
          locationId: parsed.data.fromLocationId,
          lot: parsed.data.lot || null,
          serialNumber: parsed.data.serialNumber || null,
          status: 'Available',
        },
      })

      if (!sourceInventory) throw new Error('Source inventory not found')
      if (sourceInventory.qty - sourceInventory.reservedQty < parsed.data.qty) {
        throw new Error('Insufficient available stock at source location')
      }

      // Find or create target inventory
      let targetInventory = await tx.inventory.findFirst({
        where: {
          tenantId: parsed.data.tenantId,
          itemId: parsed.data.itemId,
          locationId: parsed.data.toLocationId,
          lot: parsed.data.lot || null,
          serialNumber: parsed.data.serialNumber || null,
          status: 'Available',
        },
      })

      if (targetInventory) {
        await tx.inventory.update({
          where: { id: targetInventory.id },
          data: { qty: { increment: parsed.data.qty } },
        })
      } else {
        targetInventory = await tx.inventory.create({
          data: {
            tenantId: parsed.data.tenantId,
            itemId: parsed.data.itemId,
            locationId: parsed.data.toLocationId,
            lot: parsed.data.lot,
            serialNumber: parsed.data.serialNumber,
            qty: parsed.data.qty,
            status: 'Available',
          },
        })
      }

      // Update source inventory
      await tx.inventory.update({
        where: { id: sourceInventory.id },
        data: {
          qty: { decrement: parsed.data.qty },
          status: sourceInventory.qty - parsed.data.qty === 0 ? 'Available' : 'Available',
        },
      })

      // Create stock move record
      await tx.stockMove.create({
        data: {
          tenantId: parsed.data.tenantId,
          fromInventoryId: sourceInventory.id,
          toInventoryId: targetInventory.id,
          toLocationId: parsed.data.toLocationId,
          qty: parsed.data.qty,
          uomId: parsed.data.uomId,
          reasonCodeId: parsed.data.reasonCodeId,
          performedById: parsed.data.performedById,
          taskId: parsed.data.taskId,
          notes: parsed.data.notes,
        },
      })

      // Create inventory transactions
      await tx.inventoryTransaction.create({
        data: {
          tenantId: parsed.data.tenantId,
          type: 'Move',
          referenceType: 'StockMove',
          itemId: parsed.data.itemId,
          fromLocationId: parsed.data.fromLocationId,
          toLocationId: parsed.data.toLocationId,
          lpnId: sourceInventory.lpnId,
          lot: parsed.data.lot,
          serialNumber: parsed.data.serialNumber,
          qty: parsed.data.qty,
          beforeQty: sourceInventory.qty,
          afterQty: sourceInventory.qty - parsed.data.qty,
          beforeStatus: sourceInventory.status,
          afterStatus: sourceInventory.qty - parsed.data.qty === 0 ? 'Available' : 'Available',
          userId: parsed.data.performedById,
          reasonCodeId: parsed.data.reasonCodeId,
          idempotencyKey,
        },
      })

      return { ok: true, fromInventoryId: sourceInventory.id, toInventoryId: targetInventory.id }
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'MOVE',
      entityType: 'Inventory',
      entityId: parsed.data.itemId,
      newValues: result,
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'MOVE_FAILED', message: (error as Error).message } },
      { status: 409 }
    )
  }
}