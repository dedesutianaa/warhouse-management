import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const qcUpdateSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'passed', 'failed', 'on_hold', 'approved', 'rejected']).optional(),
  result: z.enum(['pass', 'fail', 'conditional']).optional().nullable(),
  approvedAt: z.string().datetime().optional().nullable(),
  approvedById: z.string().cuid().optional().nullable(),
  approved: z.boolean().optional(),
  notes: z.string().optional(),
  checklists: z.array(z.object({
    id: z.string().cuid(),
    result: z.enum(['pass', 'fail', 'na']).optional(),
    notes: z.string().optional(),
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

  const qc = await prisma.qcInspection.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: {
      warehouse: true,
      item: { include: { baseUom: true } },
      location: true,
      inspector: { select: { id: true, name: true } },
      approver: { select: { id: true, name: true } },
      checklists: { orderBy: { sortOrder: 'asc' } },
    },
  })

  if (!qc) {
    return NextResponse.json({ error: 'QC inspection not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data: qc })
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
  const parsed = qcUpdateSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const existing = await prisma.qcInspection.findFirst({
    where: { id, tenantId: session.user.tenantId },
    include: { checklists: true },
  })

  if (!existing) {
    return NextResponse.json({ error: 'QC inspection not found' }, { status: 404 })
  }

  const qc = await prisma.$transaction(async (tx) => {
    const updateData: Record<string, unknown> = { ...parsed.data }
    delete updateData.checklists

    if (parsed.data.status === 'in_progress' && existing.status === 'pending') {
      updateData.inspectedAt = new Date()
      updateData.inspectedById = session.user.id
    }
    if (parsed.data.approved !== undefined) {
      updateData.approvedAt = new Date()
      updateData.approvedById = session.user.id
    }

    const qc = await tx.qcInspection.update({
      where: { id },
      data: updateData,
      include: { checklists: { orderBy: { sortOrder: 'asc' } } },
    })

    if (parsed.data.checklists) {
      for (const checklist of parsed.data.checklists) {
        await tx.qcChecklist.update({
          where: { id: checklist.id },
          data: {
            result: checklist.result,
            notes: checklist.notes,
            photos: checklist.photos,
          },
        })
      }
    }

    // Auto-determine overall result if all checklists done
    const allChecklists = await tx.qcChecklist.findMany({ where: { inspectionId: id } })
    const allDone = allChecklists.every(c => c.result !== null && c.result !== undefined)
    if (allDone && !qc.result) {
      const hasFail = allChecklists.some(c => c.result === 'fail')
      await tx.qcInspection.update({
        where: { id },
        data: {
          result: hasFail ? 'fail' : 'pass',
          status: hasFail ? 'failed' : 'passed',
        },
      })
    }

    return qc
  })

  await createAuditLog({
    tenantId: session.user.tenantId,
    userId: session.user.id,
    action: 'UPDATE',
    entityType: 'QCInspection',
    entityId: id,
    oldValues: existing,
    newValues: qc,
  })

  return NextResponse.json({ success: true, data: qc })
}