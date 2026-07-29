import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const pickTaskUpdateSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'short', 'cancelled']).optional(),
  pickedQty: z.number().nonnegative().optional(),
  actualLocationId: z.string().cuid().optional().nullable(),
  actualLot: z.string().optional().nullable(),
  actualSerial: z.string().optional().nullable(),
  notes: z.string().optional(),
})

const pickConfirmSchema = z.object({
  taskId: z.string().cuid(),
  pickedQty: z.number().positive(),
  actualLocationId: z.string().cuid().optional().nullable(),
  actualLot: z.string().optional().nullable(),
  actualSerial: z.string().optional().nullable(),
  photos: z.array(z.string().url()).default([]),
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

  const where: Record<string, unknown> = {
    tenantId: session.user.tenantId,
    type: 'pick',
  }

  const waveId = searchParams.get('waveId')
  if (waveId) where.waveId = waveId

  const outboundOrderId = searchParams.get('outboundOrderId')
  if (outboundOrderId) where.outboundOrderId = outboundOrderId

  const assignedToId = searchParams.get('assignedToId')
  if (assignedToId) where.assignedToId = assignedToId
  else if (searchParams.get('mine') === 'true') where.assignedToId = session.user.id

  const status = searchParams.get('status')
  if (status) where.status = status

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      skip,
      take: limit,
      include: {
        item: { include: { baseUom: true } },
        fromLocation: { include: { zone: true } },
        toLocation: true,
        assignedTo: { select: { id: true, name: true } },
        outboundOrder: { include: { customer: true } },
        outboundLine: true,
      },
    }),
    prisma.task.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: tasks,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function PUT(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { taskId, ...updates } = body

  const parsed = pickTaskUpdateSchema.safeParse(updates)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const task = await prisma.task.findFirst({
    where: { id: taskId, tenantId: session.user.tenantId, type: 'pick' },
  })

  if (!task) {
    return NextResponse.json({ error: 'Pick task not found' }, { status: 404 })
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = { ...parsed.data }

    if (parsed.data.status === 'in_progress' && task.status === 'pending') {
      updateData.startedAt = new Date()
      updateData.assignedToId = session.user.id
    }
    if (parsed.data.status === 'completed') {
      updateData.completedAt = new Date()
    }

    const updatedTask = await tx.task.update({
      where: { id: taskId },
      data: updateData,
      include: { item: { include: { baseUom: true } }, fromLocation: true },
    })

    if (parsed.data.pickedQty !== undefined && parsed.data.pickedQty > 0) {
      // Create inventory transaction
      await tx.inventoryTransaction.create({
        data: {
          tenantId: session.user.tenantId,
          type: 'Pick',
          referenceType: 'Task',
          referenceId: taskId,
          itemId: task.itemId,
          locationId: parsed.data.actualLocationId || task.fromLocationId,
          lot: parsed.data.actualLot || undefined,
          serialNumber: parsed.data.actualSerial || undefined,
          qty: -parsed.data.pickedQty,
          beforeQty: 0, // Would need to fetch actual
          afterQty: 0,
          userId: session.user.id,
        },
      })

      // Update allocation
      if (task.referenceType === 'Allocation' && task.referenceId) {
        const allocation = await tx.allocation.findUnique({ where: { id: task.referenceId } })
        if (allocation) {
          await tx.allocation.update({
            where: { id: task.referenceId },
            data: {
              pickedQty: { increment: parsed.data.pickedQty },
              status: allocation.pickedQty + parsed.data.pickedQty >= allocation.qty ? 'picked' : 'picking',
            },
          })
        }
      }

      // If short pick
      if (parsed.data.status === 'short' || (parsed.data.pickedQty < task.qty)) {
        await tx.task.update({
          where: { id: taskId },
          data: { status: 'short', shortQty: task.qty - (parsed.data.pickedQty || 0) },
        })
      }
    }

    return updatedTask
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'UPDATE',
    entityType: 'Task',
    entityId: taskId,
    newValues: updated,
  })

  return NextResponse.json({ success: true, data: updated })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  if (action === 'confirm') {
    const parsed = pickConfirmSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const task = await prisma.task.findFirst({
      where: { id: parsed.data.taskId, tenantId: session.user.tenantId, type: 'pick' },
    })

    if (!task) {
      return NextResponse.json({ error: 'Pick task not found' }, { status: 404 })
    }

    const updated = await prisma.$transaction(async (tx) => {
      const updatedTask = await tx.task.update({
        where: { id: parsed.data.taskId },
        data: {
          status: 'completed',
          pickedQty: parsed.data.pickedQty,
          actualLocationId: parsed.data.actualLocationId,
          actualLot: parsed.data.actualLot,
          actualSerial: parsed.data.actualSerial,
          completedAt: new Date(),
        },
      })

      // Move inventory to staging location
      const stagingLocation = await tx.location.findFirst({
        where: { warehouseId: task.warehouseId, type: 'staging', status: 'active' },
      })

      if (stagingLocation) {
        // Decrement from source
        const sourceInventory = await tx.inventory.findFirst({
          where: {
            tenantId: session.user.tenantId,
            itemId: task.itemId,
            locationId: task.fromLocationId,
            lot: task.actualLot || task.lot || undefined,
            status: 'Available',
          },
        })

        if (sourceInventory) {
          await tx.inventory.update({
            where: { id: sourceInventory.id },
            data: { qty: { decrement: parsed.data.pickedQty } },
          })

          await tx.inventoryTransaction.create({
            data: {
              tenantId: session.user.tenantId,
              type: 'Pick',
              referenceType: 'Task',
              referenceId: task.id,
              itemId: task.itemId,
              locationId: task.fromLocationId,
              lot: task.actualLot || task.lot,
              serialNumber: task.actualSerial || task.serialNumber,
              qty: -parsed.data.pickedQty,
              beforeQty: sourceInventory.qty,
              afterQty: sourceInventory.qty - parsed.data.pickedQty,
              userId: session.user.id,
            },
          })
        }

        // Increment at staging
        const stagingInventory = await tx.inventory.findFirst({
          where: {
            tenantId: session.user.tenantId,
            itemId: task.itemId,
            locationId: stagingLocation.id,
            lot: task.actualLot || task.lot || undefined,
            status: 'Available',
          },
        })

        if (stagingInventory) {
          await tx.inventory.update({
            where: { id: stagingInventory.id },
            data: { qty: { increment: parsed.data.pickedQty } },
          })
        } else {
          await tx.inventory.create({
            data: {
              tenantId: session.user.tenantId,
              itemId: task.itemId,
              locationId: stagingLocation.id,
              lot: task.actualLot || task.lot,
              qty: parsed.data.pickedQty,
              status: 'Available',
            },
          })
        }
      }

      // Update allocation
      if (task.referenceType === 'Allocation' && task.referenceId) {
        await tx.allocation.update({
          where: { id: task.referenceId },
          data: { pickedQty: { increment: parsed.data.pickedQty }, status: 'picked' },
        })
      }

      return updatedTask
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'PICK_CONFIRM',
      entityType: 'Task',
      entityId: parsed.data.taskId,
      newValues: updated,
    })

    return NextResponse.json({ success: true, data: updated })
  }

  if (action === 'assign') {
    const { taskIds, userId } = body
    if (!taskIds || !userId) {
      return NextResponse.json({ error: 'taskIds and userId required' }, { status: 400 })
    }

    await prisma.task.updateMany({
      where: { id: { in: taskIds }, tenantId: session.user.tenantId },
      data: { assignedToId: userId, status: 'assigned' },
    })

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}