import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { allocationSchema } from '@/lib/validators'
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
  const parsed = allocationSchema.safeParse({ ...body, tenantId: session.user.tenantId })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.outboundOrder.findFirst({
        where: { id: parsed.data.orderId, tenantId: session.user.tenantId },
        include: { lines: true },
      })

      if (!order) throw new Error('Order not found')

      const line = order.lines.find((l) => l.itemId === parsed.data.itemId)
      if (!line) throw new Error('Order line not found')

      const remainingToAllocate = line.orderedQty - line.allocatedQty
      if (parsed.data.qty > remainingToAllocate) {
        throw new Error(`Cannot allocate more than ordered. Remaining: ${remainingToAllocate}`)
      }

      // Get allocation rule for item
      const item = await tx.item.findUnique({
        where: { id: parsed.data.itemId },
        include: { allocationRule: true },
      })

      const strategy = item?.allocationRule?.strategy || 'FEFO'

      let orderBy: Record<string, 'asc' | 'desc'>[] = []
      switch (strategy) {
        case 'FIFO':
          orderBy = [{ receivedAt: 'asc' }]
          break
        case 'FEFO':
          orderBy = [{ expiryDate: 'asc' }]
          break
        case 'LIFO':
          orderBy = [{ receivedAt: 'desc' }]
          break
        case 'LOT_SPECIFIC':
          orderBy = [{ lot: 'asc' }]
          break
        default:
          orderBy = [{ expiryDate: 'asc' }]
      }

      const candidates = await tx.inventory.findMany({
        where: {
          tenantId: parsed.data.tenantId,
          itemId: parsed.data.itemId,
          status: 'Available',
          ...(parsed.data.lot ? { lot: parsed.data.lot } : {}),
        },
        orderBy,
      })

      let remaining = parsed.data.qty
      const allocations: { inventoryId: string; qty: number }[] = []

      for (const inv of candidates) {
        if (remaining <= 0) break
        const availableQty = inv.qty - inv.reservedQty
        if (availableQty <= 0) continue

        const take = Math.min(availableQty, remaining)
        if (take <= 0) continue

        await tx.inventory.update({
          where: { id: inv.id },
          data: {
            reservedQty: { increment: take },
            status: inv.qty - inv.reservedQty - take === 0 ? 'Allocated' : 'Available',
          },
        })

        await tx.allocation.create({
          data: {
            tenantId: parsed.data.tenantId,
            orderId: parsed.data.orderId,
            lineId: line.id,
            itemId: parsed.data.itemId,
            inventoryId: inv.id,
            allocatedQty: take,
            status: 'allocated',
          },
        })

        await tx.inventoryTransaction.create({
          data: {
            tenantId: parsed.data.tenantId,
            type: 'Allocation',
            referenceType: 'Allocation',
            referenceId: parsed.data.orderId,
            itemId: parsed.data.itemId,
            locationId: inv.locationId,
            lpnId: inv.lpnId,
            lot: inv.lot,
            serialNumber: inv.serialNumber,
            qty: take,
            beforeQty: inv.qty,
            afterQty: inv.qty,
            beforeStatus: inv.status,
            afterStatus: inv.qty - inv.reservedQty - take === 0 ? 'Allocated' : 'Available',
            userId: session.user.id,
            idempotencyKey,
          },
        })

        allocations.push({ inventoryId: inv.id, qty: take })
        remaining -= take
      }

      if (remaining > 0) {
        throw new Error(`Insufficient available stock. Short by ${remaining}`)
      }

      // Update order line
      await tx.outboundLine.update({
        where: { id: line.id },
        data: { allocatedQty: { increment: parsed.data.qty } },
      })

      // Check if order is fully allocated
      const updatedLine = await tx.outboundLine.findUnique({ where: { id: line.id } })
      if (updatedLine && updatedLine.allocatedQty >= updatedLine.orderedQty) {
        await tx.outboundOrder.update({
          where: { id: parsed.data.orderId },
          data: { status: 'ALLOCATED' },
        })
      }

      return { orderId: parsed.data.orderId, allocated: parsed.data.qty, allocations }
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'ALLOCATE',
      entityType: 'OutboundOrder',
      entityId: parsed.data.orderId,
      newValues: result,
    })

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    return NextResponse.json(
      { error: { code: 'ALLOCATION_FAILED', message: (error as Error).message } },
      { status: 409 }
    )
  }
}