import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const idParamSchema = z.object({
  id: z.string().cuid(),
})

export const tenantIdSchema = z.object({
  tenantId: z.string().cuid(),
})

export const warehouseIdSchema = z.object({
  warehouseId: z.string().cuid(),
})

// Item schemas
export const itemCreateSchema = z.object({
  tenantId: z.string().cuid(),
  sku: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  categoryId: z.string().cuid().optional(),
  brandId: z.string().cuid().optional(),
  baseUomId: z.string().cuid(),
  purchaseUomId: z.string().cuid().optional(),
  salesUomId: z.string().cuid().optional(),
  weight: z.number().positive().optional(),
  volume: z.number().positive().optional(),
  dimensions: z.record(z.unknown()).optional(),
  imageUrl: z.string().url().optional(),
  hasLot: z.boolean().default(false),
  hasSerial: z.boolean().default(false),
  hasExpiry: z.boolean().default(false),
  shelfLifeDays: z.number().int().positive().optional(),
  minShelfLifePct: z.number().int().min(0).max(100).optional(),
  storageTempMin: z.number().optional(),
  storageTempMax: z.number().optional(),
  isHazmat: z.boolean().default(false),
  isFragile: z.boolean().default(false),
  putawayRuleId: z.string().cuid().optional(),
  pickingRuleId: z.string().cuid().optional(),
  replenRuleId: z.string().cuid().optional(),
  allocationRuleId: z.string().cuid().optional(),
})

export const itemUpdateSchema = itemCreateSchema.partial()

// Location schemas
export const locationCreateSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  zoneId: z.string().cuid().optional(),
  code: z.string().min(1).max(50),
  name: z.string().max(100).optional(),
  type: z.string().min(1),
  capacityWeight: z.number().positive().optional(),
  capacityVolume: z.number().positive().optional(),
  capacityPallets: z.number().int().positive().optional(),
  maxWeight: z.number().positive().optional(),
  maxVolume: z.number().positive().optional(),
  dimensions: z.record(z.unknown()).optional(),
  temperatureZone: z.string().optional(),
  locationClass: z.enum(['A', 'B', 'C']).default('B'),
  restrictions: z.array(z.string()).default([]),
  coordinates: z.record(z.unknown()).optional(),
  pickSequence: z.number().int().optional(),
  putawaySequence: z.number().int().optional(),
  parentId: z.string().cuid().optional(),
})

export const locationUpdateSchema = locationCreateSchema.partial()

// Partner schemas
export const partnerCreateSchema = z.object({
  tenantId: z.string().cuid(),
  code: z.string().min(1).max(50),
  name: z.string().min(1).max(200),
  type: z.enum(['supplier', 'customer', 'carrier', 'client']),
  contactName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
  paymentTerms: z.number().int().positive().optional(),
  currency: z.string().default('IDR'),
})

export const partnerUpdateSchema = partnerCreateSchema.partial()

// Inbound schemas
export const inboundOrderCreateSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  supplierId: z.string().cuid(),
  referenceType: z.enum(['PO', 'ASN', 'TRANSFER', 'RETURN', 'MANUAL']),
  referenceId: z.string().cuid(),
  referenceNumber: z.string().min(1),
  expectedDate: z.string().datetime().optional(),
  dockId: z.string().cuid().optional(),
  assignedToId: z.string().cuid().optional(),
  notes: z.string().optional(),
  lines: z.array(z.object({
    itemId: z.string().cuid(),
    expectedQty: z.number().positive(),
    uomId: z.string().cuid(),
    lot: z.string().optional(),
    expiryDate: z.string().datetime().optional(),
    serialNumbers: z.array(z.string()).default([]),
  })).min(1),
})

export const receiptCreateSchema = z.object({
  tenantId: z.string().cuid(),
  inboundOrderId: z.string().cuid(),
  receivedById: z.string().cuid(),
  dockId: z.string().cuid().optional(),
  lines: z.array(z.object({
    inboundLineId: z.string().cuid().optional(),
    itemId: z.string().cuid(),
    expectedQty: z.number().positive(),
    receivedQty: z.number().nonnegative(),
    uomId: z.string().cuid(),
    lot: z.string().optional(),
    expiryDate: z.string().datetime().optional(),
    serialNumbers: z.array(z.string()).default([]),
    discrepancyReason: z.string().optional(),
    photos: z.array(z.string().url()).default([]),
  })).min(1),
})

// Inventory schemas
export const inventoryMoveSchema = z.object({
  tenantId: z.string().cuid(),
  itemId: z.string().cuid(),
  fromLocationId: z.string().cuid(),
  toLocationId: z.string().cuid(),
  qty: z.number().positive(),
  uomId: z.string().cuid(),
  lot: z.string().optional(),
  serialNumber: z.string().optional(),
  reasonCodeId: z.string().cuid().optional(),
  performedById: z.string().cuid(),
  taskId: z.string().cuid().optional(),
  notes: z.string().optional(),
})

export const inventoryAdjustmentSchema = z.object({
  tenantId: z.string().cuid(),
  itemId: z.string().cuid(),
  inventoryId: z.string().cuid(),
  reasonCodeId: z.string().cuid(),
  qty: z.number().int(),
  value: z.number().optional(),
  requesterId: z.string().cuid(),
  attachments: z.array(z.string().url()).default([]),
  notes: z.string().optional(),
})

// Outbound schemas
export const outboundOrderCreateSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  customerId: z.string().cuid(),
  carrierId: z.string().cuid().optional(),
  channel: z.string().optional(),
  referenceType: z.enum(['SO', 'MARKETPLACE', 'ERP', 'MANUAL']).optional(),
  referenceId: z.string().cuid().optional(),
  referenceNumber: z.string().optional(),
  priority: z.number().int().default(0),
  slaDeadline: z.string().datetime().optional(),
  cutOffTime: z.string().datetime().optional(),
  shippingAddress: z.record(z.unknown()).optional(),
  billingAddress: z.record(z.unknown()).optional(),
  notes: z.string().optional(),
  lines: z.array(z.object({
    itemId: z.string().cuid(),
    orderedQty: z.number().positive(),
    uomId: z.string().cuid(),
    lot: z.string().optional(),
    serialNumbers: z.array(z.string()).default([]),
  })).min(1),
})

export const allocationSchema = z.object({
  tenantId: z.string().cuid(),
  orderId: z.string().cuid(),
  itemId: z.string().cuid(),
  qty: z.number().positive(),
})

// Wave schemas
export const waveCreateSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  carrierId: z.string().cuid().optional(),
  cutOffTime: z.string().datetime(),
  strategy: z.string().optional(),
  priority: z.number().int().default(0),
  orderIds: z.array(z.string().cuid()).optional(),
})

// Task schemas
export const taskCreateSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  type: z.enum(['RECEIVE', 'PUTAWAY', 'PICK', 'REPLENISH', 'MOVE', 'COUNT', 'PACK', 'QC', 'RETURN_INSPECTION', 'SHIPPING']),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'CRITICAL']).default('NORMAL'),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  sourceLocationId: z.string().cuid().optional(),
  targetLocationId: z.string().cuid().optional(),
  itemId: z.string().cuid().optional(),
  lpnId: z.string().cuid().optional(),
  expectedQty: z.number().positive().optional(),
  uomId: z.string().cuid().optional(),
  assignedToId: z.string().cuid().optional(),
  createdById: z.string().cuid(),
  waveId: z.string().cuid().optional(),
  orderId: z.string().cuid().optional(),
  inboundOrderId: z.string().cuid().optional(),
  slaMinutes: z.number().int().positive().optional(),
  notes: z.string().optional(),
})

// Return schemas
export const returnCreateSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  orderId: z.string().cuid().optional(),
  customerId: z.string().cuid(),
  reasonCodeId: z.string().cuid().optional(),
  reason: z.string().optional(),
  lines: z.array(z.object({
    itemId: z.string().cuid(),
    qty: z.number().positive(),
    uomId: z.string().cuid(),
    lot: z.string().optional(),
    serialNumber: z.string().optional(),
  })).min(1),
})

// Transfer schemas
export const transferCreateSchema = z.object({
  tenantId: z.string().cuid(),
  fromWarehouseId: z.string().cuid(),
  toWarehouseId: z.string().cuid(),
  lines: z.array(z.object({
    itemId: z.string().cuid(),
    fromLocationId: z.string().cuid(),
    toLocationId: z.string().cuid().optional(),
    qty: z.number().positive(),
    uomId: z.string().cuid(),
    lot: z.string().optional(),
    serialNumbers: z.array(z.string()).default([]),
  })).min(1),
  eta: z.string().datetime().optional(),
  notes: z.string().optional(),
})

// Cycle Count schemas
export const cycleCountCreateSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  type: z.enum(['scheduled', 'event', 'ad_hoc']).default('scheduled'),
  scope: z.string().min(1),
  assignedToId: z.string().cuid().optional(),
  dueDate: z.string().datetime().optional(),
  locationIds: z.array(z.string().cuid()).optional(),
  itemIds: z.array(z.string().cuid()).optional(),
})

// QC schemas
export const qcCreateSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  type: z.enum(['receiving', 'in_process', 'final', 'return', 'complaint']),
  referenceType: z.enum(['InboundOrder', 'Receipt', 'OutboundOrder', 'Return', 'Transfer']).optional(),
  referenceId: z.string().cuid().optional(),
  itemId: z.string().cuid(),
  locationId: z.string().cuid().optional(),
  qty: z.number().positive().optional(),
  sampleSize: z.number().int().positive().optional(),
  inspectorId: z.string().cuid().optional(),
  checklists: z.array(z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    criteria: z.string().optional(),
    required: z.boolean().default(true),
    sortOrder: z.number().int().default(0),
  })).optional(),
})

export const qcInspectionCreateSchema = z.object({
  tenantId: z.string().cuid(),
  inboundOrderId: z.string().cuid().optional(),
  receiptId: z.string().cuid().optional(),
  inspectorId: z.string().cuid(),
  sampleSize: z.number().int().positive(),
  items: z.array(z.object({
    itemId: z.string().cuid(),
    sampleQty: z.number().int().positive(),
  })).min(1),
})

// Replenishment schemas
export const replenishmentRuleSchema = z.object({
  tenantId: z.string().cuid(),
  warehouseId: z.string().cuid(),
  itemId: z.string().cuid(),
  minQty: z.number().nonnegative(),
  maxQty: z.number().positive(),
  reorderPoint: z.number().nonnegative(),
  reorderQty: z.number().positive(),
  priority: z.number().int().default(50),
  zoneIds: z.array(z.string().cuid()).optional(),
  active: z.boolean().default(true),
})

// Integration schemas
export const integrationCreateSchema = z.object({
  tenantId: z.string().cuid(),
  name: z.string().min(1).max(100),
  type: z.enum(['ERP', 'MARKETPLACE', 'CARRIER', 'DEVICE', 'OTHER']),
  provider: z.string().min(1),
  config: z.record(z.unknown()).default({}),
  credentials: z.record(z.unknown()).default({}),
})

export const webhookCreateSchema = z.object({
  tenantId: z.string().cuid(),
  integrationId: z.string().cuid().optional(),
  url: z.string().url(),
  events: z.array(z.string()).min(1),
  secret: z.string().min(16),
  maxRetries: z.number().int().positive().default(5),
})

// Document Template schemas
export const documentTemplateCreateSchema = z.object({
  tenantId: z.string().cuid(),
  name: z.string().min(1).max(100),
  type: z.enum(['GRN', 'PACKING_LIST', 'INVOICE', 'DELIVERY_NOTE', 'MANIFEST', 'LABEL', 'BARCODE']),
  format: z.enum(['zpl', 'pdf', 'html']).default('zpl'),
  content: z.string().min(1),
  variables: z.array(z.string()).default([]),
  isDefault: z.boolean().default(false),
})

// Feature Flag schemas
export const featureFlagCreateSchema = z.object({
  tenantId: z.string().cuid(),
  key: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  enabled: z.boolean().default(false),
  rolloutPct: z.number().int().min(0).max(100).default(0),
  targetRoles: z.array(z.string()).default([]),
  targetWarehouses: z.array(z.string()).default([]),
})

// System Setting schemas
export const systemSettingCreateSchema = z.object({
  tenantId: z.string().cuid(),
  key: z.string().min(1).max(100),
  value: z.unknown(),
  description: z.string().optional(),
  isPublic: z.boolean().default(false),
})

// Response schemas
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }).optional(),
    meta: z.object({
      page: z.number().optional(),
      limit: z.number().optional(),
      total: z.number().optional(),
      totalPages: z.number().optional(),
    }).optional(),
  })

export const apiErrorSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
})

export type PaginationInput = z.infer<typeof paginationSchema>
export type ItemCreateInput = z.infer<typeof itemCreateSchema>
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>
export type LocationCreateInput = z.infer<typeof locationCreateSchema>
export type LocationUpdateInput = z.infer<typeof locationUpdateSchema>
export type PartnerCreateInput = z.infer<typeof partnerCreateSchema>
export type PartnerUpdateInput = z.infer<typeof partnerUpdateSchema>
export type InboundOrderCreateInput = z.infer<typeof inboundOrderCreateSchema>
export type ReceiptCreateInput = z.infer<typeof receiptCreateSchema>
export type InventoryMoveInput = z.infer<typeof inventoryMoveSchema>
export type InventoryAdjustmentInput = z.infer<typeof inventoryAdjustmentSchema>
export type OutboundOrderCreateInput = z.infer<typeof outboundOrderCreateSchema>
export type AllocationInput = z.infer<typeof allocationSchema>
export type WaveCreateInput = z.infer<typeof waveCreateSchema>
export type TaskCreateInput = z.infer<typeof taskCreateSchema>
export type ReturnCreateInput = z.infer<typeof returnCreateSchema>
export type TransferCreateInput = z.infer<typeof transferCreateSchema>
export type CycleCountCreateInput = z.infer<typeof cycleCountCreateSchema>
export type QcCreateInput = z.infer<typeof qcCreateSchema>
export type QcInspectionCreateInput = z.infer<typeof qcInspectionCreateSchema>
export type ReplenishmentRuleInput = z.infer<typeof replenishmentRuleSchema>
export type IntegrationCreateInput = z.infer<typeof integrationCreateSchema>
export type WebhookCreateInput = z.infer<typeof webhookCreateSchema>
export type DocumentTemplateCreateInput = z.infer<typeof documentTemplateCreateSchema>
export type FeatureFlagCreateInput = z.infer<typeof featureFlagCreateSchema>
export type SystemSettingCreateInput = z.infer<typeof systemSettingCreateSchema>