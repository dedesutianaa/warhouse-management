import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'

export interface AuditLogInput {
  tenantId: string
  userId?: string
  action: string
  entityType: string
  entityId: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
  sessionId?: string
  correlationId?: string
  metadata?: Record<string, unknown>
}

export async function createAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        tenantId: input.tenantId,
        userId: input.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        oldValues: input.oldValues ?? null,
        newValues: input.newValues ?? null,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        sessionId: input.sessionId,
        correlationId: input.correlationId,
        metadata: input.metadata ?? {},
      },
    })
  } catch (error) {
    console.error('Failed to create audit log:', error)
  }
}

export async function getAuditLogs(filters: {
  tenantId: string
  userId?: string
  entityType?: string
  entityId?: string
  action?: string
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}) {
  const where: Record<string, unknown> = {
    tenantId: filters.tenantId,
  }

  if (filters.userId) where.userId = filters.userId
  if (filters.entityType) where.entityType = filters.entityType
  if (filters.entityId) where.entityId = filters.entityId
  if (filters.action) where.action = filters.action
  if (filters.startDate || filters.endDate) {
    where.createdAt = {}
    if (filters.startDate) (where.createdAt as Record<string, Date>).gte = filters.startDate
    if (filters.endDate) (where.createdAt as Record<string, Date>).lte = filters.endDate
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters.limit ?? 50,
      skip: filters.offset ?? 0,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ])

  return { logs, total }
}

export function withAuditLog<T extends (...args: unknown[]) => Promise<unknown>>(
  handler: T,
  auditConfig: {
    action: string
    entityType: string
    getEntityId: (args: Parameters<T>) => string
    getOldValues?: (args: Parameters<T>) => Promise<Record<string, unknown> | undefined>
    getNewValues?: (args: Parameters<T>) => Promise<Record<string, unknown> | undefined>
  }
): T {
  return (async (...args: Parameters<T>) => {
    const session = await auth()
    const tenantId = (session?.user as { tenantId?: string })?.tenantId
    const userId = session?.user?.id

    const entityId = auditConfig.getEntityId(args)
    const oldValues = await auditConfig.getOldValues?.(args)
    const result = await handler(...args)
    const newValues = await auditConfig.getNewValues?.(args)

    if (tenantId) {
      await createAuditLog({
        tenantId,
        userId,
        action: auditConfig.action,
        entityType: auditConfig.entityType,
        entityId,
        oldValues,
        newValues,
      })
    }

    return result
  }) as T
}