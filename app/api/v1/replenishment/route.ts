import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const replenishmentRuleSchema = z.object({
  warehouseId: z.string().cuid(),
  itemId: z.string().cuid(),
  minQty: z.number().nonnegative(),
  maxQty: z.number().positive(),
  reorderPoint: z.number().nonnegative(),
  reorderQty: z.number().positive(),
  priority: z.number().int().default(50),
  zoneIds: z.array(z.string().cuid()).optional(),
})

const replenishmentTaskSchema = z.object({
  ruleId: z.string().cuid(),
  fromLocationId: z.string().cuid(),
  toLocationId: z.string().cuid(),
  qty: z.number().positive(),
  priority: z.number().int().default(50),
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

  const type = searchParams.get('type') || 'rules'

  if (type === 'rules') {
    const where: Record<string, unknown> = { tenantId: session.user.tenantId }
    const warehouseId = searchParams.get('warehouseId')
    if (warehouseId) where.warehouseId = warehouseId

    const [rules, total] = await Promise.all([
      prisma.replenishmentRule.findMany({
        where,
        orderBy: { priority: 'desc' },
        skip,
        take: limit,
        include: {
          item: { include: { baseUom: true } },
          warehouse: true,
          zones: true,
        },
      }),
      prisma.replenishmentRule.count({ where }),
    ])

    return NextResponse.json({ success: true, data: rules, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  }

  if (type === 'tasks') {
    const where: Record<string, unknown> = { tenantId: session.user.tenantId, type: 'replenish' }
    const waveId = searchParams.get('waveId')
    if (waveId) where.waveId = waveId
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
          toLocation: { include: { zone: true } },
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      prisma.task.count({ where }),
    ])

    return NextResponse.json({ success: true, data: tasks, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  }

  if (type === 'suggestions') {
    // Generate replenishment suggestions based on rules
    const warehouseId = searchParams.get('warehouseId')
    if (!warehouseId) {
      return NextResponse.json({ error: 'warehouseId required' }, { status: 400 })
    }

    const rules = await prisma.replenishmentRule.findMany({
      where: { tenantId: session.user.tenantId, warehouseId, active: true },
      include: { item: true },
    })

    const suggestions = []

    for (const rule of rules) {
      // Get current qty in pick locations (zone filter if specified)
      const zoneFilter = rule.zoneIds.length > 0 ? { zoneId: { in: rule.zoneIds } } : {}
      const pickLocations = await prisma.location.findMany({
        where: { warehouseId, type: 'pick', status: 'active', ...zoneFilter },
        select: { id: true },
      })

      const pickLocationIds = pickLocations.map(l => l.id)

      const currentQty = await prisma.inventory.aggregate({
        where: {
          tenantId: session.user.tenantId,
          itemId: rule.itemId,
          locationId: { in: pickLocationIds },
          status: 'Available',
        },
        _sum: { qty: true },
      })

      const totalQty = currentQty._sum.qty || 0

      if (totalQty <= rule.reorderPoint) {
        // Find source locations (reserve/bulk) with available stock
        const sourceLocations = await prisma.location.findMany({
          where: { warehouseId, type: { in: ['reserve', 'bulk'] }, status: 'active' },
          select: { id: true },
        })

        const sourceQty = await prisma.inventory.groupBy({
          by: ['locationId'],
          where: {
            tenantId: session.user.tenantId,
            itemId: rule.itemId,
            locationId: { in: sourceLocations.map(l => l.id) },
            status: 'Available',
          },
          _sum: { qty: true },
        })

        // Get pick locations that need replenishment
        const pickLocationQtys = await prisma.inventory.groupBy({
          by: ['locationId'],
          where: {
            tenantId: session.user.tenantId,
            itemId: rule.itemId,
            locationId: { in: pickLocationIds },
            status: 'Available',
          },
          _sum: { qty: true },
        })

        const neededQty = rule.maxQty - totalQty
        let remainingNeeded = neededQty

        for (const source of sourceQty) {
          if (remainingNeeded <= 0) break
          const moveQty = Math.min(source._sum.qty, remainingNeeded)

          // Find pick location with lowest qty
          const targetLoc = pickLocationQtys.sort((a, b) => (a._sum.qty || 0) - (b._sum.qty || 0))[0]

          if (targetLoc) {
            suggestions.push({
              ruleId: rule.id,
              itemId: rule.itemId,
              item: rule.item,
              fromLocationId: source.locationId,
              toLocationId: targetLoc.locationId,
              qty: moveQty,
              priority: rule.priority,
              reason: `Below reorder point (${totalQty} <= ${rule.reorderPoint})`,
            })
            remainingNeeded -= moveQty
          }
        }
      }
    }

    return NextResponse.json({ success: true, data: suggestions })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  if (action === 'createRule') {
    const parsed = replenishmentRuleSchema.safeParse({ ...body, tenantId: session.user.tenantId })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const rule = await prisma.replenishmentRule.create({
      data: {
        ...parsed.data,
        tenantId: session.user.tenantId,
        zones: parsed.data.zoneIds ? { connect: parsed.data.zoneIds.map(id => ({ id })) } : undefined,
      },
      include: { item: true, zones: true },
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'ReplenishmentRule',
      entityId: rule.id,
      newValues: rule,
    })

    return NextResponse.json({ success: true, data: rule }, { status: 201 })
  }

  if (action === 'generateTasks') {
    const { warehouseId } = body
    if (!warehouseId) {
      return NextResponse.json({ error: 'warehouseId required' }, { status: 400 })
    }

    // Get suggestions
    const suggestionsRes = await fetch(new URL(`/api/v1/replenishment?type=suggestions&warehouseId=${warehouseId}`, request.url), {
      headers: { 'Authorization': request.headers.get('Authorization') || '' },
    })
    const { data: suggestions } = await suggestionsRes.json()

    if (suggestions.length === 0) {
      return NextResponse.json({ success: true, data: [], message: 'No replenishment needed' })
    }

    const tasks = await prisma.$transaction(async (tx) => {
      const createdTasks = []

      for (const s of suggestions) {
        // Check if task already exists
        const existing = await tx.task.findFirst({
          where: {
            tenantId: session.user.tenantId,
            type: 'replenish',
            itemId: s.itemId,
            fromLocationId: s.fromLocationId,
            toLocationId: s.toLocationId,
            status: { in: ['pending', 'assigned', 'in_progress'] },
          },
        })

        if (!existing) {
          const task = await tx.task.create({
            data: {
              tenantId: session.user.tenantId,
              warehouseId,
              type: 'replenish',
              priority: s.priority,
              status: 'pending',
              qty: s.qty,
              itemId: s.itemId,
              fromLocationId: s.fromLocationId,
              toLocationId: s.toLocationId,
            },
          })
          createdTasks.push(task)
        }
      }

      return createdTasks
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'GENERATE_TASKS',
      entityType: 'ReplenishmentTask',
      entityId: 'bulk',
      newValues: { count: tasks.length },
    })

    return NextResponse.json({ success: true, data: tasks })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}