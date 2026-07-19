import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { taskCreateSchema, paginationSchema } from '@/lib/validators'
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

  const warehouseId = searchParams.get('warehouseId')
  if (warehouseId) where.warehouseId = warehouseId

  const type = searchParams.get('type')
  if (type) where.type = type

  const status = searchParams.get('status')
  if (status) where.status = status

  const priority = searchParams.get('priority')
  if (priority) where.priority = priority

  const assignedToId = searchParams.get('assignedToId')
  if (assignedToId) where.assignedToId = assignedToId
  else if (session.user.role === 'Operator') {
    where.assignedToId = session.user.id
  }

  const waveId = searchParams.get('waveId')
  if (waveId) where.waveId = waveId

  const orderId = searchParams.get('orderId')
  if (orderId) where.orderId = orderId

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      orderBy: sortBy ? { [sortBy]: sortOrder } : { priority: 'desc', createdAt: 'asc' },
      skip,
      take: limit,
      include: {
        warehouse: true,
        sourceLocation: true,
        targetLocation: true,
        item: true,
        lpn: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        createdBy: { select: { id: true, name: true } },
        wave: true,
        order: true,
        inboundOrder: true,
        pickTasks: true,
        packTasks: true,
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

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = taskCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId, createdById: session.user.id })

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const taskNumber = `TSK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.task.count() + 1).padStart(5, '0')}`

  const task = await prisma.task.create({
    data: {
      ...parsed.data,
      taskNumber,
    },
    include: {
      sourceLocation: true,
      targetLocation: true,
      item: true,
      assignedTo: { select: { id: true, name: true } },
    },
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'CREATE',
    entityType: 'Task',
    entityId: task.id,
    newValues: task,
  })

  return NextResponse.json({ success: true, data: task }, { status: 201 })
}