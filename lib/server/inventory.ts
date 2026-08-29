import { z } from 'zod'
import { prisma } from '@/lib/db'

export const moveSchema = z.object({
  tenantId: z.string(),
  itemId: z.string(),
  fromLocationId: z.string(),
  toLocationId: z.string(),
  qty: z.number().int().positive(),
  userId: z.string(),
})

export async function moveInventory(input: z.infer<typeof moveSchema>) {
  return prisma.$transaction(async (tx) => {
    const source = await tx.inventory.findFirst({
      where: { tenantId: input.tenantId, itemId: input.itemId, locationId: input.fromLocationId, status: 'Available' },
    })
    if (!source || source.qty < input.qty) throw new Error('Insufficient stock')
    await tx.inventory.update({ where: { id: source.id }, data: { qty: source.qty - input.qty } })
    const target = await tx.inventory.findFirst({
      where: { tenantId: input.tenantId, itemId: input.itemId, locationId: input.toLocationId, status: 'Available' },
    })
    if (target) {
      await tx.inventory.update({ where: { id: target.id }, data: { qty: target.qty + input.qty } })
    } else {
      await tx.inventory.create({
        data: {
          tenantId: input.tenantId,
          itemId: input.itemId,
          locationId: input.toLocationId,
          qty: input.qty,
          status: 'Available',
        },
      })
    }
    await tx.inventoryTransaction.create({
      data: {
        tenantId: input.tenantId,
        type: 'Move',
        itemId: input.itemId,
        location: `${input.fromLocationId}->${input.toLocationId}`,
        qty: input.qty,
        before: source.qty,
        after: source.qty - input.qty,
        userId: input.userId,
      },
    })
    return { ok: true }
  })
}
