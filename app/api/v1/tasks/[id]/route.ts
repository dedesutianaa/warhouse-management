import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const taskUpdateSchema = z.object({
  status: z.enum(['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD']).optional(),
  assignedToId: z.string().cuid().optional().nullable(),
  startedAt: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
  actualMinutes: z.number().int().positive().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
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

  const task = await prisma.task.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      warehouse: true,
      sourceLocation: true,
      targetLocation: true,
      item: true,
      lpn: true,
      assignedTo: { select: { id: true, name: true, email: true } },
      createdBy: { select: { id: true, name: true } },
      wave: true,
      order: { include: { customer: true, lines: { include: { item: true } } } },
      inboundOrder: { include: { supplier: true, lines: { include: { item: true } } } },
      pickTasks: { include: { location: true, inventory: true, tote: true } },
      packTasks: { include: { inventory: true, carton: true } },
    },
  })

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: task })
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
  const parsed = taskUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.task.findFirst({
    where: { id, tenantId: session.user.tenantId },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  const updateData: Record<string, unknown> = { ...parsed.data }

  if (parsed.data.status === 'IN_PROGRESS' && !existing.startedAt) {
    updateData.startedAt = new Date()
  }
  if (parsed.data.status === 'COMPLETED' && !existing.completedAt) {
    updateData.completedAt = new Date()
    if (existing.startedAt) {
      updateData.actualMinutes = Math.round(
        (new Date().getTime() - new Date(existing.startedAt).getTime()) / 60000
      )
    }
  }

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
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
    action: 'UPDATE',
    entityType: 'Task',
    entityId: id,
    oldValues: existing,
    newValues: task,
  })

  return NextResponse.json({ success: true, data: task })
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

  const existing = await prisma.task.findFirst({
    where: { id, tenantId: session.user.tenantId },
  })

  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 })
  }

  await prisma.task.delete({ where: { id } })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'DELETE',
    entityType: 'Task',
    entityId: id,
    oldValues: existing,
  })

  return NextResponse.json({ success: true, data: { ok: true } })
}