import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { z } from 'zod'

const shipmentCreateSchema = z.object({
  outboundOrderId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  carrierId: z.string().cuid().optional(),
  serviceLevel: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive(),
    width: z.number().positive(),
    height: z.number().positive(),
  }).optional(),
  packages: z.array(z.object({
    cartonId: z.string().cuid().optional(),
    trackingNumber: z.string().optional(),
    weight: z.number().positive().optional(),
    dimensions: z.object({
      length: z.number().positive(),
      width: z.number().positive(),
      height: z.number().positive(),
    }).optional(),
  })).min(1),
})

const labelRequestSchema = z.object({
  shipmentId: z.string().cuid(),
  format: z.enum(['zpl', 'pdf', 'png']).default('zpl'),
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
  }

  const outboundOrderId = searchParams.get('outboundOrderId')
  if (outboundOrderId) where.outboundOrderId = outboundOrderId

  const carrierId = searchParams.get('carrierId')
  if (carrierId) where.carrierId = carrierId

  const status = searchParams.get('status')
  if (status) where.status = status

  const [shipments, total] = await Promise.all([
    prisma.shipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        outboundOrder: { include: { customer: true } },
        carrier: true,
        packages: { include: { carton: true } },
        trackingEvents: { orderBy: { timestamp: 'desc' }, take: 5 },
      },
    }),
    prisma.shipment.count({ where }),
  ])

  return NextResponse.json({
    success: true,
    data: shipments,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(request: Request) {
  const session = await auth()

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action } = body

  if (action === 'create') {
    const parsed = shipmentCreateSchema.safeParse({ ...body, tenantId: session.user.tenantId })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const shipmentNumber = `SHP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(await prisma.shipment.count() + 1).padStart(6, '0')}`

    const shipment = await prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.create({
        data: {
          ...parsed.data,
          shipmentNumber,
          tenantId: session.user.tenantId,
          status: 'created',
          packages: {
            create: parsed.data.packages.map((pkg, idx) => ({
              ...pkg,
              sequence: idx + 1,
            })),
          },
        },
        include: { packages: true, outboundOrder: true, carrier: true },
      })

      // Update outbound order status
      await tx.outboundOrder.update({
        where: { id: parsed.data.outboundOrderId },
        data: { status: 'shipped', shippedAt: new Date() },
      })

      // Close associated cartons
      const cartonIds = parsed.data.packages.map(p => p.cartonId).filter(Boolean)
      if (cartonIds.length > 0) {
        await tx.carton.updateMany({
          where: { id: { in: cartonIds } },
          data: { status: 'shipped', shippedAt: new Date() },
        })
      }

      return shipment
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'CREATE',
      entityType: 'Shipment',
      entityId: shipment.id,
      newValues: shipment,
    })

    return NextResponse.json({ success: true, data: shipment }, { status: 201 })
  }

  if (action === 'label') {
    const parsed = labelRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const shipment = await prisma.shipment.findFirst({
      where: { id: parsed.data.shipmentId, tenantId: session.user.tenantId },
      include: { packages: true, carrier: true, outboundOrder: { include: { customer: true } } },
    })

    if (!shipment) {
      return NextResponse.json({ error: 'Shipment not found' }, { status: 404 })
    }

    // Generate label content (ZPL example)
    const labelContent = generateLabel(shipment, parsed.data.format)

    // In production, this would call carrier API
    // For now, return mock label data
    const labelData = {
      shipmentId: shipment.id,
      trackingNumber: shipment.packages[0]?.trackingNumber || `TRK${Date.now()}`,
      labelContent,
      format: parsed.data.format,
      generatedAt: new Date(),
    }

    // Update shipment with tracking
    await prisma.shipment.update({
      where: { id: parsed.data.shipmentId },
      data: {
        status: 'labeled',
        trackingNumber: labelData.trackingNumber,
      },
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'LABEL_GENERATED',
      entityType: 'Shipment',
      entityId: parsed.data.shipmentId,
      newValues: { trackingNumber: labelData.trackingNumber },
    })

    return NextResponse.json({ success: true, data: labelData })
  }

  if (action === 'manifest') {
    const { carrierId, date } = body
    if (!carrierId) {
      return NextResponse.json({ error: 'carrierId required' }, { status: 400 })
    }

    const shipments = await prisma.shipment.findMany({
      where: {
        tenantId: session.user.tenantId,
        carrierId,
        status: { in: ['labeled', 'manifested'] },
        ...(date ? { createdAt: { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) } } : {}),
      },
      include: { packages: true, outboundOrder: { include: { customer: true } } },
    })

    const manifest = {
      carrierId,
      date: date || new Date().toISOString().split('T')[0],
      shipmentCount: shipments.length,
      packageCount: shipments.reduce((sum, s) => sum + s.packages.length, 0),
      totalWeight: shipments.reduce((sum, s) => sum + (s.weight || 0), 0),
      shipments: shipments.map(s => ({
        shipmentNumber: s.shipmentNumber,
        trackingNumber: s.trackingNumber,
        packageCount: s.packages.length,
        weight: s.weight,
        serviceLevel: s.serviceLevel,
        customer: s.outboundOrder?.customer?.name,
      })),
    }

    // Update shipments to manifested
    await prisma.shipment.updateMany({
      where: { id: { in: shipments.map(s => s.id) } },
      data: { status: 'manifested', manifestedAt: new Date() },
    })

    await createAuditLog({
      tenantId: session.user.tenantId,
      userId: session.user.id,
      action: 'MANIFEST_CREATED',
      entityType: 'Shipment',
      entityId: 'bulk',
      newValues: manifest,
    })

    return NextResponse.json({ success: true, data: manifest })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

function generateLabel(shipment: Record<string, unknown>, format: string): string {
  const pkg = (shipment.packages as Array<Record<string, unknown>>)[0] || {}
  const order = shipment.outboundOrder as Record<string, unknown> || {}
  const customer = order.customer as Record<string, unknown> || {}

  if (format === 'zpl') {
    return `^XA
^FO50,50^BY3^BCN,100,Y,N,N^FD${pkg.trackingNumber || ''}^FS
^FO50,180^A0N,30,30^FD${shipment.shipmentNumber}^FS
^FO50,220^A0N,25,25^FD${customer.name || ''}^FS
^FO50,260^A0N,20,20^FD${order.shipAddress1 || ''}^FS
^FO50,290^A0N,20,20^FD${order.shipCity || ''}, ${order.shipState || ''} ${order.shipPostalCode || ''}^FS
^FO50,330^A0N,20,20^FDWeight: ${shipment.weight || pkg.weight || 0} ${shipment.weightUom || 'LB'}^FS
^XZ`
  }

  // JSON format for PDF/PNG generation
  return JSON.stringify({
    shipmentNumber: shipment.shipmentNumber,
    trackingNumber: pkg.trackingNumber,
    customer: customer.name,
    address: {
      line1: order.shipAddress1,
      line2: order.shipAddress2,
      city: order.shipCity,
      state: order.shipState,
      postalCode: order.shipPostalCode,
      country: order.shipCountry,
    },
    weight: shipment.weight || pkg.weight,
    serviceLevel: shipment.serviceLevel,
    carrier: (shipment.carrier as Record<string, unknown>)?.code,
  })
}