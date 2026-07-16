import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { receiptCreateSchema } from '@/lib/validators'
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
  const parsed = receiptCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const receipt = await prisma.$transaction(async (tx) => {
    // Create receipt
    const grnNumber = `GRN-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await tx.receipt.count() + 1).padStart(6, '0')}`

    const receipt = await tx.receipt.create({
      data: {
        ...parsed.data,
        grnNumber,
        lines: {
          create: parsed.data.lines.map((line) => ({
            ...line,
            status: line.receivedQty >= line.expectedQty ? 'received' : 'partial',
            discrepancyQty: line.receivedQty - line.expectedQty,
          })),
        },
      },
      include: { lines: true },
    })

    // Update inbound order lines and create inventory
    for (const line of parsed.data.lines) {
      if (line.inboundLineId) {
        await tx.inboundLine.update({
          where: { id: line.inboundLineId },
          data: { receivedQty: { increment: line.receivedQty } },
        })
      }

      if (line.receivedQty > 0) {
        // Create or update inventory
        const locationId = line.lot
          ? await findOrCreateLotLocation(tx, session.user.tenantId, line.itemId, line.lot, line.expiryDate)
          : await findOrCreateLocation(tx, session.user.tenantId, line.itemId)

        // Create LPN if needed
        let lpnId: string | undefined
        if (line.receivedQty > 0) {
          const lpnCode = `LPN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
          const lpn = await tx.lPN.create({
            data: {
              tenantId: session.user.tenantId,
              code: lpnCode,
              licensePlate: lpnCode,
              type: 'carton',
              locationId,
            },
          })
          lpnId = lpn.id
        }

        const existingInventory = await tx.inventory.findFirst({
          where: {
            tenantId: session.user.tenantId,
            itemId: line.itemId,
            locationId,
            lot: line.lot || null,
            status: 'Available',
          },
        })

        if (existingInventory) {
          await tx.inventory.update({
            where: { id: existingInventory.id },
            data: {
              qty: { increment: line.receivedQty },
              lpnId: lpnId || existingInventory.lpnId,
            },
          })

          await tx.inventoryTransaction.create({
            data: {
              tenantId: session.user.tenantId,
              type: 'Receipt',
              referenceType: 'Receipt',
              referenceId: receipt.id,
              itemId: line.itemId,
              locationId,
              lpnId,
              lot: line.lot,
              serialNumber: line.serialNumbers?.[0],
              qty: line.receivedQty,
              beforeQty: existingInventory.qty,
              afterQty: existingInventory.qty + line.receivedQty,
              userId: session.user.id,
              idempotencyKey,
            },
          })
        } else {
          await tx.inventory.create({
            data: {
              tenantId: session.user.tenantId,
              itemId: line.itemId,
              locationId,
              lpnId,
              lot: line.lot,
              serialNumber: line.serialNumbers?.[0],
              qty: line.receivedQty,
              status: 'Available',
              receivedAt: new Date(),
              expiryDate: line.expiryDate ? new Date(line.expiryDate) : null,
            },
          })

          await tx.inventoryTransaction.create({
            data: {
              tenantId: session.user.tenantId,
              type: 'Receipt',
              referenceType: 'Receipt',
              referenceId: receipt.id,
              itemId: line.itemId,
              locationId,
              lpnId,
              lot: line.lot,
              serialNumber: line.serialNumbers?.[0],
              qty: line.receivedQty,
              beforeQty: 0,
              afterQty: line.receivedQty,
              userId: session.user.id,
              idempotencyKey,
            },
          })
        }

        // Update receipt line with LPN
        if (lpnId) {
          await tx.receiptLine.updateMany({
            where: { receiptId: receipt.id, itemId: line.itemId },
            data: { lpnId },
          })
        }
      }
    }

    // Update inbound order status
    const inboundOrder = await tx.inboundOrder.findUnique({
      where: { id: receipt.inboundOrderId },
      include: { lines: true },
    })

    if (inboundOrder) {
      const allReceived = inboundOrder.lines.every(
        (l) => l.receivedQty >= l.expectedQty
      )
      const anyReceived = inboundOrder.lines.some((l) => l.receivedQty > 0)

      await tx.inboundOrder.update({
        where: { id: inboundOrder.id },
        data: {
          status: allReceived ? 'COMPLETED' : anyReceived ? 'RECEIVING' : 'EXPECTED',
        },
      })
    }

    return receipt
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'Receipt',
    entityId: receipt.id,
    newValues: receipt,
  })

  return NextResponse.json({ success: true, data: receipt }, { status: 201 })
}

async function findOrCreateLotLocation(
  tx: typeof prisma,
  tenantId: string,
  itemId: string,
  lot: string,
  expiryDate?: string
): Promise<string> {
  // Try to find existing location with same lot
  const existing = await tx.inventory.findFirst({
    where: { tenantId, itemId, lot, status: 'Available' },
    include: { location: true },
  })

  if (existing) return existing.locationId

  // Find a suitable putaway location
  const item = await tx.item.findUnique({
    where: { id: itemId },
    include: { putawayRule: true },
  })

  if (item?.putawayRule?.targetZoneId) {
    const location = await tx.location.findFirst({
      where: {
        tenantId,
        zoneId: item.putawayRule.targetZoneId,
        type: 'storage',
        status: 'active',
      },
      orderBy: { putawaySequence: 'asc' },
    })
    if (location) return location.id
  }

  // Fallback to any available storage location
  const location = await tx.location.findFirst({
    where: { tenantId, type: 'storage', status: 'active' },
    orderBy: { putawaySequence: 'asc' },
  })

  if (location) return location.id

  throw new Error('No available storage location found')
}

async function findOrCreateLocation(
  tx: typeof prisma,
  tenantId: string,
  itemId: string
): Promise<string> {
  const item = await tx.item.findUnique({
    where: { id: itemId },
    include: { putawayRule: true },
  })

  if (item?.putawayRule?.targetZoneId) {
    const location = await tx.location.findFirst({
      where: {
        tenantId,
        zoneId: item.putawayRule.targetZoneId,
        type: 'storage',
        status: 'active',
      },
      orderBy: { putawaySequence: 'asc' },
    })
    if (location) return location.id
  }

  const location = await tx.location.findFirst({
    where: { tenantId, type: 'storage', status: 'active' },
    orderBy: { putawaySequence: 'asc' },
  })

  if (location) return location.id

  throw new Error('No available storage location found')
}