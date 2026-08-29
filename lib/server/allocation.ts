import { z } from 'zod'
import { prisma } from '@/lib/db'

export const allocateSchema = z.object({
  tenantId: z.string(),
  orderId: z.string(),
  itemId: z.string(),
  qty: z.number().int().positive(),
})

export async function allocateStock(input: z.infer<typeof allocateSchema>) {
  return prisma.$transaction(async (tx) => {
    const candidates = await tx.inventory.findMany({
      where: { tenantId: input.tenantId, itemId: input.itemId, status: 'Available' },
      orderBy: [{ lot: 'asc' }],
    })
    let remaining = input.qty
    const allocations: { inventoryId: string; qty: number }[] = []
    for (const inv of candidates) {
      if (remaining <= 0) break
      const take = Math.min(inv.qty, remaining)
      if (take <= 0) continue
      await tx.inventory.update({ where: { id: inv.id }, data: { qty: inv.qty - take, status: inv.qty - take === 0 ? 'Allocated' : 'Available' } })
      allocations.push({ inventoryId: inv.id, qty: take })
      remaining -= take
    }
    if (remaining > 0) throw new Error('Insufficient available stock')
    return { orderId: input.orderId, allocated: input.qty - remaining, allocations }
  })
}
