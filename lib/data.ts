export type Order = {
  id: string
  channel: string
  customer: string
  city: string
  items: number
  qty: number
  value: number
  carrier: string
  status: string
  sla: string
  createdAt: string
  priority: 'Normal' | 'Express' | 'Same Day'
}

export const orders: Order[] = [
  { id: 'SO-2026-118402', channel: 'Shopee', customer: 'Rina Kartika', city: 'Jakarta Selatan', items: 3, qty: 5, value: 428000, carrier: 'J&T', status: 'Picking', sla: '58 mnt', createdAt: '09:12', priority: 'Express' },
  { id: 'SO-2026-118401', channel: 'Tokopedia', customer: 'Budi Santoso', city: 'Bandung', items: 2, qty: 2, value: 189000, carrier: 'JNE', status: 'Packing', sla: '1j 12m', createdAt: '09:08', priority: 'Normal' },
  { id: 'SO-2026-118400', channel: 'TikTok Shop', customer: 'Siti Aminah', city: 'Surabaya', items: 4, qty: 7, value: 612000, carrier: 'SiCepat', status: 'Allocated', sla: '2j 05m', createdAt: '09:02', priority: 'Normal' },
  { id: 'SO-2026-118399', channel: 'Website', customer: 'Dewi Lestari', city: 'Yogyakarta', items: 1, qty: 1, value: 149000, carrier: 'Anteraja', status: 'Staged', sla: '3j 40m', createdAt: '08:55', priority: 'Same Day' },
  { id: 'SO-2026-118398', channel: 'Lazada', customer: 'Agus Wijaya', city: 'Semarang', items: 5, qty: 9, value: 874000, carrier: 'JNE', status: 'Picked', sla: '1j 48m', createdAt: '08:47', priority: 'Express' },
  { id: 'SO-2026-118397', channel: 'Shopee', customer: 'Maya Putri', city: 'Depok', items: 2, qty: 3, value: 267000, carrier: 'J&T', status: 'Shipped', sla: 'Selesai', createdAt: '08:31', priority: 'Normal' },
  { id: 'SO-2026-118396', channel: 'Blibli', customer: 'Rizky Ramadhan', city: 'Bekasi', items: 3, qty: 4, value: 356000, carrier: 'Ninja Xpress', status: 'On Hold', sla: 'Terlambat 12m', createdAt: '08:22', priority: 'Express' },
  { id: 'SO-2026-118395', channel: 'Tokopedia', customer: 'Nadia Safira', city: 'Tangerang', items: 1, qty: 2, value: 198000, carrier: 'SiCepat', status: 'Shipped', sla: 'Selesai', createdAt: '08:14', priority: 'Normal' },
  { id: 'SO-2026-118394', channel: 'TikTok Shop', customer: 'Fajar Nugroho', city: 'Malang', items: 6, qty: 11, value: 1024000, carrier: 'JNE', status: 'Picking', sla: '2j 30m', createdAt: '08:05', priority: 'Normal' },
  { id: 'SO-2026-118393', channel: 'Website', customer: 'Intan Permata', city: 'Denpasar', items: 2, qty: 2, value: 312000, carrier: 'Anteraja', status: 'Allocated', sla: '4j 10m', createdAt: '07:58', priority: 'Normal' },
  { id: 'SO-2026-118392', channel: 'Shopee', customer: 'Hendra Gunawan', city: 'Medan', items: 4, qty: 6, value: 489000, carrier: 'J&T', status: 'Packing', sla: '1j 05m', createdAt: '07:44', priority: 'Express' },
  { id: 'SO-2026-118391', channel: 'Lazada', customer: 'Putri Ayu', city: 'Palembang', items: 2, qty: 3, value: 224000, carrier: 'SiCepat', status: 'Staged', sla: '3j 15m', createdAt: '07:36', priority: 'Normal' },
  { id: 'SO-2026-118390', channel: 'Tokopedia', customer: 'Yoga Pratama', city: 'Solo', items: 3, qty: 5, value: 398000, carrier: 'JNE', status: 'Shipped', sla: 'Selesai', createdAt: '07:21', priority: 'Normal' },
  { id: 'SO-2026-118389', channel: 'TikTok Shop', customer: 'Ayu Lestari', city: 'Makassar', items: 1, qty: 1, value: 129000, carrier: 'Ninja Xpress', status: 'Allocated', sla: '5j 00m', createdAt: '07:10', priority: 'Normal' },
]

export const slaRisks = [
  { id: 'SO-2026-118402', stage: 'Picking', carrier: 'J&T', left: '58 mnt', tone: 'warning' as const, customer: 'Rina Kartika' },
  { id: 'SO-2026-118396', stage: 'On Hold', carrier: 'Ninja Xpress', left: 'Lewat 12 mnt', tone: 'danger' as const, customer: 'Rizky Ramadhan' },
  { id: 'SO-2026-118392', stage: 'Packing', carrier: 'J&T', left: '1j 05m', tone: 'warning' as const, customer: 'Hendra Gunawan' },
  { id: 'SO-2026-118398', stage: 'Picked', carrier: 'JNE', left: '1j 48m', tone: 'neutral' as const, customer: 'Agus Wijaya' },
]

export const throughput = [
  { label: '08', inbound: 120, outbound: 86 },
  { label: '09', inbound: 168, outbound: 142 },
  { label: '10', inbound: 142, outbound: 196 },
  { label: '11', inbound: 196, outbound: 224 },
  { label: '12', inbound: 88, outbound: 164 },
  { label: '13', inbound: 132, outbound: 188 },
  { label: '14', inbound: 176, outbound: 232 },
  { label: '15', inbound: 148, outbound: 204 },
  { label: '16', inbound: 92, outbound: 156 },
  { label: '17', inbound: 64, outbound: 118 },
]

export const weeklyTrend = [
  { label: 'Sen', inbound: 1840, outbound: 1620 },
  { label: 'Sel', inbound: 2120, outbound: 1980 },
  { label: 'Rab', inbound: 1960, outbound: 2140 },
  { label: 'Kam', inbound: 2340, outbound: 2280 },
  { label: 'Jum', inbound: 2180, outbound: 2460 },
  { label: 'Sab', inbound: 2480, outbound: 2320 },
  { label: 'Min', inbound: 1240, outbound: 980 },
]

export const capacityZones = [
  { label: 'Zona A · Fast moving', value: 34, color: '#0e3b2e', hint: '82%' },
  { label: 'Zona B · Ambient', value: 26, color: '#16a34a', hint: '74%' },
  { label: 'Zona C · Cool room', value: 22, color: '#4ade80', hint: '68%' },
  { label: 'Zona D · Bulk', value: 18, color: '#c9e9d4', hint: '61%' },
]

export const zoneOccupancy = [
  { label: 'Zona A · Fast moving', used: 328, capacity: 400, hint: 'Pick face & forward area' },
  { label: 'Zona B · Ambient', used: 296, capacity: 400, hint: 'Rak pallet 3 level' },
  { label: 'Zona C · Cool room', used: 136, capacity: 200, hint: 'Suhu 2–8°C' },
  { label: 'Zona D · Bulk', used: 244, capacity: 400, hint: 'Bulk & overflow' },
]

export const activity = [
  { id: 'a1', actor: 'Sari Wulandari', action: 'menyelesaikan putaway', target: 'LPN-88214 → A-01-02-03', time: '2 mnt lalu', tone: 'success' as const },
  { id: 'a2', actor: 'Sistem', action: 'mengirim GRN ke ERP', target: 'PO-2026-004182', time: '6 mnt lalu', tone: 'info' as const },
  { id: 'a3', actor: 'Bayu Saputra', action: 'melaporkan short pick', target: 'SO-2026-118402 · SKU-4520', time: '11 mnt lalu', tone: 'warning' as const },
  { id: 'a4', actor: 'Rina Marlina', action: 'menyetujui adjustment', target: 'ADJ-2026-0091 · −4 pcs', time: '24 mnt lalu', tone: 'success' as const },
  { id: 'a5', actor: 'Sistem', action: 'mendeteksi SLA berisiko', target: 'SO-2026-118396', time: '31 mnt lalu', tone: 'danger' as const },
  { id: 'a6', actor: 'Doni Setiawan', action: 'mencetak manifest', target: 'JNE · 42 paket', time: '48 mnt lalu', tone: 'neutral' as const },
]

export const lowStock = [
  { sku: 'SKU-4520', name: 'Serum Vitamin C 30ml', available: 18, min: 60, location: 'A-02-01-04' },
  { sku: 'SKU-8890', name: 'Beras Organik 5kg', available: 24, min: 80, location: 'D-01-03-02' },
  { sku: 'SKU-7412', name: 'Masker Wajah Aloe 10pcs', available: 36, min: 100, location: 'B-03-02-01' },
  { sku: 'SKU-1155', name: 'Sereal Granola 400g', available: 42, min: 90, location: 'A-01-04-02' },
]

export type Inbound = {
  id: string
  po: string
  supplier: string
  expected: number
  received: number
  dock: string
  eta: string
  status: string
  progress: number
  operator: string
}

export const inboundShipments: Inbound[] = [
  { id: 'ASN-2026-00871', po: 'PO-2026-004182', supplier: 'PT Sumber Pangan Nusantara', expected: 1200, received: 840, dock: 'Dock 2', eta: '22 Nov · 09:30', status: 'Receiving', progress: 70, operator: 'Sari Wulandari' },
  { id: 'ASN-2026-00870', po: 'PO-2026-004179', supplier: 'CV Aroma Nusantara', expected: 640, received: 640, dock: 'Dock 1', eta: '22 Nov · 08:15', status: 'QC', progress: 85, operator: 'Bayu Saputra' },
  { id: 'ASN-2026-00869', po: 'PO-2026-004176', supplier: 'PT Kosmetika Prima', expected: 2400, received: 0, dock: 'Dock 3', eta: '22 Nov · 11:00', status: 'Menunggu Dock', progress: 0, operator: '—' },
  { id: 'ASN-2026-00868', po: 'PO-2026-004171', supplier: 'PT Distribusi Sehat', expected: 480, received: 480, dock: 'Dock 2', eta: '22 Nov · 07:40', status: 'Putaway', progress: 92, operator: 'Doni Setiawan' },
  { id: 'ASN-2026-00867', po: 'PO-2026-004168', supplier: 'PT Kemasan Jaya', expected: 3600, received: 3600, dock: 'Dock 4', eta: '21 Nov · 16:20', status: 'Selesai', progress: 100, operator: 'Rina Marlina' },
  { id: 'ASN-2026-00866', po: 'PO-2026-004165', supplier: 'PT Sumber Pangan Nusantara', expected: 900, received: 900, dock: 'Dock 1', eta: '21 Nov · 14:05', status: 'Selesai', progress: 100, operator: 'Sari Wulandari' },
  { id: 'ASN-2026-00865', po: 'PO-2026-004160', supplier: 'CV Aroma Nusantara', expected: 720, received: 690, dock: 'Dock 3', eta: '21 Nov · 11:30', status: 'Selesai', progress: 100, operator: 'Bayu Saputra' },
  { id: 'ASN-2026-00864', po: 'PO-2026-004154', supplier: 'PT Kosmetika Prima', expected: 1500, received: 0, dock: 'Dock 2', eta: '23 Nov · 09:00', status: 'Menunggu', progress: 0, operator: '—' },
]

export const inboundLines = [
  { sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', expected: 480, received: 480, lot: 'LOT-2611-A', expiry: '2027-08-14', status: 'Sesuai' },
  { sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', expected: 360, received: 360, lot: 'LOT-2611-B', expiry: '2027-05-02', status: 'Sesuai' },
  { sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', expected: 240, received: 228, lot: 'LOT-2611-C', expiry: '2027-02-20', status: 'Short 12' },
  { sku: 'SKU-9021', name: 'Madu Hutan 500ml', expected: 120, received: 120, lot: 'LOT-2611-D', expiry: '2028-01-11', status: 'Sesuai' },
  { sku: 'SKU-6234', name: 'Minyak Kelapa 1L', expected: 0, received: 24, lot: 'LOT-2611-E', expiry: '2027-09-30', status: 'Over 24' },
]

export const putawayTasks = [
  { lpn: 'LPN-88214', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', qty: 240, from: 'Dock 2', suggested: 'A-01-02-03', reason: 'Konsolidasi lot + FEFO', priority: 'Tinggi', assignee: 'Sari Wulandari' },
  { lpn: 'LPN-88215', sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', qty: 180, from: 'Dock 2', suggested: 'A-02-01-01', reason: 'Fast moving · pick face', priority: 'Tinggi', assignee: 'Sari Wulandari' },
  { lpn: 'LPN-88216', sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', qty: 228, from: 'Dock 2', suggested: 'B-01-03-02', reason: 'Kapasitas & kelas B', priority: 'Normal', assignee: 'Doni Setiawan' },
  { lpn: 'LPN-88217', sku: 'SKU-9021', name: 'Madu Hutan 500ml', qty: 120, from: 'Dock 2', suggested: 'B-02-02-04', reason: 'Single-lot restriction', priority: 'Normal', assignee: 'Doni Setiawan' },
  { lpn: 'LPN-88218', sku: 'SKU-6234', name: 'Minyak Kelapa 1L', qty: 24, from: 'Dock 2', suggested: 'D-01-01-02', reason: 'Overflow · bulk', priority: 'Rendah', assignee: 'Belum ditugaskan' },
  { lpn: 'LPN-88219', sku: 'SKU-3311', name: 'Sabun Cair Sensitive 500ml', qty: 96, from: 'Dock 1', suggested: 'A-03-02-01', reason: 'Konsolidasi SKU', priority: 'Normal', assignee: 'Rina Marlina' },
]

export const qcInspections = [
  { id: 'QC-2026-0142', po: 'PO-2026-004179', supplier: 'CV Aroma Nusantara', sample: 32, passed: 32, failed: 0, status: 'Selesai', inspector: 'Bayu Saputra' },
  { id: 'QC-2026-0141', po: 'PO-2026-004182', supplier: 'PT Sumber Pangan Nusantara', sample: 40, passed: 37, failed: 3, status: 'Berjalan', inspector: 'Bayu Saputra' },
  { id: 'QC-2026-0140', po: 'PO-2026-004171', supplier: 'PT Distribusi Sehat', sample: 24, passed: 24, failed: 0, status: 'Selesai', inspector: 'Rina Marlina' },
  { id: 'QC-2026-0139', po: 'PO-2026-004168', supplier: 'PT Kemasan Jaya', sample: 20, passed: 18, failed: 2, status: 'Hold', inspector: 'Doni Setiawan' },
  { id: 'QC-2026-0138', po: 'PO-2026-004165', supplier: 'PT Sumber Pangan Nusantara', sample: 30, passed: 30, failed: 0, status: 'Selesai', inspector: 'Sari Wulandari' },
]

export const waves = [
  { id: 'WAVE-1122-01', carrier: 'J&T', orders: 48, lines: 126, picker: 'Bayu Saputra', cutoff: '11:30', progress: 68, status: 'Picking' },
  { id: 'WAVE-1122-02', carrier: 'JNE', orders: 36, lines: 94, picker: 'Doni Setiawan', cutoff: '13:00', progress: 42, status: 'Picking' },
  { id: 'WAVE-1122-03', carrier: 'SiCepat', orders: 52, lines: 138, picker: 'Sari Wulandari', cutoff: '14:30', progress: 12, status: 'Released' },
  { id: 'WAVE-1122-04', carrier: 'Anteraja', orders: 24, lines: 61, picker: 'Belum ditugaskan', cutoff: '15:00', progress: 0, status: 'Draft' },
  { id: 'WAVE-1122-05', carrier: 'Ninja Xpress', orders: 18, lines: 44, picker: 'Rina Marlina', cutoff: '16:00', progress: 100, status: 'Selesai' },
]

export const pickList = [
  { seq: 1, location: 'A-01-02-03', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', qty: 2, lot: 'LOT-2611-A', tote: 'T-04', status: 'Selesai' },
  { seq: 2, location: 'A-01-02-04', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', qty: 1, lot: 'LOT-2610-C', tote: 'T-04', status: 'Selesai' },
  { seq: 3, location: 'A-02-01-01', sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', qty: 3, lot: 'LOT-2611-B', tote: 'T-04', status: 'Berjalan' },
  { seq: 4, location: 'A-02-01-04', sku: 'SKU-4520', name: 'Serum Vitamin C 30ml', qty: 1, lot: 'LOT-2609-A', tote: 'T-05', status: 'Menunggu' },
  { seq: 5, location: 'B-01-03-02', sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', qty: 2, lot: 'LOT-2611-C', tote: 'T-05', status: 'Menunggu' },
  { seq: 6, location: 'B-02-02-04', sku: 'SKU-9021', name: 'Madu Hutan 500ml', qty: 1, lot: 'LOT-2611-D', tote: 'T-05', status: 'Menunggu' },
  { seq: 7, location: 'C-01-01-02', sku: 'SKU-3311', name: 'Sabun Cair Sensitive 500ml', qty: 2, lot: 'LOT-2610-F', tote: 'T-06', status: 'Menunggu' },
]

export const packingOrder = {
  id: 'SO-2026-118401',
  channel: 'Tokopedia',
  customer: 'Budi Santoso',
  address: 'Jl. Cihampelas No. 118, Bandung, Jawa Barat 40131',
  phone: '+62 812-****-4471',
  carrier: 'JNE',
  service: 'REG · Estimasi 2–3 hari',
  awb: 'JNE-8823-4410-9921',
  weight: 1.24,
  carton: 'Kardus M · 30×20×15 cm',
  items: [
    { sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', qty: 1, verified: true },
    { sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', qty: 1, verified: false },
  ],
}

export const manifests = [
  { carrier: 'J&T', awb: 'JT-9921-0042', packages: 48, weight: 62.4, dock: 'Dock 1', cutoff: '11:30', status: 'Siap Serah Terima' },
  { carrier: 'JNE', awb: 'JNE-8823-4410', packages: 36, weight: 48.1, dock: 'Dock 2', cutoff: '13:00', status: 'Menunggu Pickup' },
  { carrier: 'SiCepat', awb: 'SC-7712-8890', packages: 52, weight: 71.8, dock: 'Dock 3', cutoff: '14:30', status: 'Loading' },
  { carrier: 'Anteraja', awb: 'ANT-5510-2214', packages: 24, weight: 29.6, dock: 'Dock 4', cutoff: '15:00', status: 'Menunggu Pickup' },
]

export type StockRow = {
  id: string
  sku: string
  name: string
  location: string
  lpn: string
  lot: string
  expiry: string
  qty: number
  uom: string
  status: string
  owner: string
  zone: string
}

export const inventory: StockRow[] = [
  { id: 'i1', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', location: 'A-01-02-03', lpn: 'LPN-88214', lot: 'LOT-2611-A', expiry: '2027-08-14', qty: 240, uom: 'pcs', status: 'Available', owner: 'PT Sinar Retail', zone: 'A' },
  { id: 'i2', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', location: 'A-01-02-04', lpn: 'LPN-88190', lot: 'LOT-2610-C', expiry: '2027-06-02', qty: 96, uom: 'pcs', status: 'Allocated', owner: 'PT Sinar Retail', zone: 'A' },
  { id: 'i3', sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', location: 'A-02-01-01', lpn: 'LPN-88215', lot: 'LOT-2611-B', expiry: '2027-05-02', qty: 180, uom: 'pcs', status: 'Available', owner: 'PT Sinar Retail', zone: 'A' },
  { id: 'i4', sku: 'SKU-4520', name: 'Serum Vitamin C 30ml', location: 'A-02-01-04', lpn: 'LPN-88102', lot: 'LOT-2609-A', expiry: '2026-12-18', qty: 18, uom: 'pcs', status: 'Available', owner: 'PT Kosmetika Prima', zone: 'A' },
  { id: 'i5', sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', location: 'B-01-03-02', lpn: 'LPN-88216', lot: 'LOT-2611-C', expiry: '2027-02-20', qty: 228, uom: 'pcs', status: 'Available', owner: 'PT Sinar Retail', zone: 'B' },
  { id: 'i6', sku: 'SKU-9021', name: 'Madu Hutan 500ml', location: 'B-02-02-04', lpn: 'LPN-88217', lot: 'LOT-2611-D', expiry: '2028-01-11', qty: 120, uom: 'pcs', status: 'Available', owner: 'CV Aroma Nusantara', zone: 'B' },
  { id: 'i7', sku: 'SKU-3311', name: 'Sabun Cair Sensitive 500ml', location: 'A-03-02-01', lpn: 'LPN-88219', lot: 'LOT-2610-F', expiry: '2027-11-30', qty: 96, uom: 'pcs', status: 'Available', owner: 'PT Kosmetika Prima', zone: 'A' },
  { id: 'i8', sku: 'SKU-7412', name: 'Masker Wajah Aloe 10pcs', location: 'B-03-02-01', lpn: 'LPN-88044', lot: 'LOT-2608-B', expiry: '2026-12-05', qty: 36, uom: 'pack', status: 'Hold', owner: 'PT Kosmetika Prima', zone: 'B' },
  { id: 'i9', sku: 'SKU-8890', name: 'Beras Organik 5kg', location: 'D-01-03-02', lpn: 'LPN-87990', lot: 'LOT-2610-A', expiry: '2027-04-18', qty: 24, uom: 'sack', status: 'Available', owner: 'PT Sinar Retail', zone: 'D' },
  { id: 'i10', sku: 'SKU-6234', name: 'Minyak Kelapa 1L', location: 'D-01-01-02', lpn: 'LPN-88218', lot: 'LOT-2611-E', expiry: '2027-09-30', qty: 24, uom: 'pcs', status: 'Available', owner: 'CV Aroma Nusantara', zone: 'D' },
  { id: 'i11', sku: 'SKU-1155', name: 'Sereal Granola 400g', location: 'A-01-04-02', lpn: 'LPN-88012', lot: 'LOT-2609-D', expiry: '2027-01-22', qty: 42, uom: 'pcs', status: 'Available', owner: 'PT Sinar Retail', zone: 'A' },
  { id: 'i12', sku: 'SKU-3377', name: 'Pasta Gigi Herbal 150g', location: 'B-01-01-03', lpn: 'LPN-88031', lot: 'LOT-2610-G', expiry: '2027-07-09', qty: 144, uom: 'pcs', status: 'Available', owner: 'PT Distribusi Sehat', zone: 'B' },
  { id: 'i13', sku: 'SKU-4488', name: 'Face Wash Gentle 100ml', location: 'A-03-01-02', lpn: 'LPN-88077', lot: 'LOT-2609-E', expiry: '2026-12-28', qty: 12, uom: 'pcs', status: 'Quarantine', owner: 'PT Kosmetika Prima', zone: 'A' },
  { id: 'i14', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', location: 'C-01-02-01', lpn: 'LPN-87901', lot: 'LOT-2607-A', expiry: '2026-12-02', qty: 8, uom: 'pcs', status: 'Expired', owner: 'PT Sinar Retail', zone: 'C' },
  { id: 'i15', sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', location: 'B-02-01-02', lpn: 'LPN-87955', lot: 'LOT-2608-C', expiry: '2027-03-14', qty: 60, uom: 'pcs', status: 'Damaged', owner: 'PT Sinar Retail', zone: 'B' },
  { id: 'i16', sku: 'SKU-9021', name: 'Madu Hutan 500ml', location: 'D-02-01-01', lpn: 'LPN-87920', lot: 'LOT-2606-B', expiry: '2027-10-05', qty: 48, uom: 'pcs', status: 'Blocked', owner: 'CV Aroma Nusantara', zone: 'D' },
]

export const ledger = [
  { id: 'TX-99201', time: '22 Nov · 09:42', doc: 'GRN-2026-004182', type: 'Receipt', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', from: 'Dock 2', to: 'A-01-02-03', qty: 240, before: 0, after: 240, user: 'Sari Wulandari' },
  { id: 'TX-99200', time: '22 Nov · 09:38', doc: 'SO-2026-118402', type: 'Allocation', sku: 'SKU-4520', name: 'Serum Vitamin C 30ml', from: 'Available', to: 'Allocated', qty: 1, before: 19, after: 18, user: 'Sistem' },
  { id: 'TX-99199', time: '22 Nov · 09:31', doc: 'PICK-1122-01', type: 'Pick', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', from: 'A-01-02-03', to: 'Staging', qty: 2, before: 242, after: 240, user: 'Bayu Saputra' },
  { id: 'TX-99198', time: '22 Nov · 09:12', doc: 'ADJ-2026-0091', type: 'Adjustment', sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', from: 'A-01-03-02', to: 'A-01-03-02', qty: -4, before: 232, after: 228, user: 'Rina Marlina' },
  { id: 'TX-99197', time: '22 Nov · 08:58', doc: 'MOVE-2026-1188', type: 'Move', sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', from: 'B-02-01-02', to: 'A-02-01-01', qty: 60, before: 60, after: 60, user: 'Doni Setiawan' },
  { id: 'TX-99196', time: '22 Nov · 08:44', doc: 'TRF-2026-0031', type: 'Transfer Out', sku: 'SKU-8890', name: 'Beras Organik 5kg', from: 'WH-CKR-01', to: 'In-Transit', qty: 40, before: 64, after: 24, user: 'Rina Marlina' },
  { id: 'TX-99195', time: '22 Nov · 08:20', doc: 'GRN-2026-004179', type: 'Receipt', sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', from: 'Dock 1', to: 'A-02-01-01', qty: 180, before: 0, after: 180, user: 'Bayu Saputra' },
  { id: 'TX-99194', time: '22 Nov · 08:02', doc: 'SO-2026-118397', type: 'Ship Confirm', sku: 'SKU-3311', name: 'Sabun Cair Sensitive 500ml', from: 'Staging', to: 'Shipped', qty: 2, before: 98, after: 96, user: 'Sistem' },
  { id: 'TX-99193', time: '21 Nov · 17:48', doc: 'CC-2026-0077', type: 'Count', sku: 'SKU-7412', name: 'Masker Wajah Aloe 10pcs', from: 'B-03-02-01', to: 'B-03-02-01', qty: -2, before: 38, after: 36, user: 'Sari Wulandari' },
  { id: 'TX-99192', time: '21 Nov · 17:12', doc: 'RET-2026-0044', type: 'Return', sku: 'SKU-4488', name: 'Face Wash Gentle 100ml', from: 'Return Area', to: 'Quarantine', qty: 12, before: 0, after: 12, user: 'Rina Marlina' },
]

export const cycleCounts = [
  { id: 'CC-2026-0078', scope: 'Zona A · Kelas A', type: 'Terjadwal', locations: 48, progress: 62, variance: 2, status: 'Berjalan', due: '22 Nov' },
  { id: 'CC-2026-0077', scope: 'Zona B · Rak 03', type: 'Event · short pick', locations: 12, progress: 100, variance: 2, status: 'Selesai', due: '21 Nov' },
  { id: 'CC-2026-0076', scope: 'Zona C · Cool room', type: 'Terjadwal', locations: 24, progress: 100, variance: 0, status: 'Selesai', due: '20 Nov' },
  { id: 'CC-2026-0075', scope: 'Zona D · Bulk', type: 'Ad hoc', locations: 36, progress: 0, variance: 0, status: 'Draft', due: '23 Nov' },
  { id: 'CC-2026-0074', scope: 'Pick face · Zona A', type: 'Terjadwal', locations: 60, progress: 100, variance: 5, status: 'Selesai', due: '19 Nov' },
]

export const adjustments = [
  { id: 'ADJ-2026-0091', sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', qty: -4, value: 196000, reason: 'Rusak saat handling', requester: 'Rina Marlina', approver: 'Andi Pratama', status: 'Approved', date: '22 Nov' },
  { id: 'ADJ-2026-0090', sku: 'SKU-7412', name: 'Masker Wajah Aloe 10pcs', qty: -2, value: 78000, reason: 'Selisih cycle count', requester: 'Sari Wulandari', approver: 'Andi Pratama', status: 'Pending', date: '22 Nov' },
  { id: 'ADJ-2026-0089', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', qty: 6, value: 414000, reason: 'Temuan stok', requester: 'Bayu Saputra', approver: '—', status: 'Pending', date: '21 Nov' },
  { id: 'ADJ-2026-0088', sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', qty: -12, value: 216000, reason: 'Kemasan penyok', requester: 'Doni Setiawan', approver: 'Rina Marlina', status: 'Approved', date: '21 Nov' },
  { id: 'ADJ-2026-0087', sku: 'SKU-8890', name: 'Beras Organik 5kg', qty: -1, value: 129000, reason: 'Sampel QC', requester: 'Rina Marlina', approver: 'Andi Pratama', status: 'Rejected', date: '20 Nov' },
  { id: 'ADJ-2026-0086', sku: 'SKU-9021', name: 'Madu Hutan 500ml', qty: 3, value: 267000, reason: 'Retur vendor dibatalkan', requester: 'Sari Wulandari', approver: 'Andi Pratama', status: 'Approved', date: '20 Nov' },
]

export const transfers = [
  { id: 'TRF-2026-0031', from: 'Gudang Cikarang', to: 'Gudang Surabaya', items: 4, qty: 120, status: 'In-Transit', eta: '24 Nov', progress: 55 },
  { id: 'TRF-2026-0030', from: 'Gudang Cikarang', to: 'Gudang Surabaya', items: 2, qty: 48, status: 'Diterima', eta: '21 Nov', progress: 100 },
  { id: 'TRF-2026-0029', from: 'Gudang Surabaya', to: 'Gudang Cikarang', items: 6, qty: 240, status: 'In-Transit', eta: '23 Nov', progress: 30 },
  { id: 'TRF-2026-0028', from: 'Gudang Cikarang', to: 'Gudang Medan', items: 3, qty: 72, status: 'Draft', eta: '25 Nov', progress: 0 },
  { id: 'TRF-2026-0027', from: 'Gudang Surabaya', to: 'Gudang Cikarang', items: 1, qty: 24, status: 'Diterima', eta: '19 Nov', progress: 100 },
]

export const expiryItems = [
  { sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', lot: 'LOT-2607-A', location: 'C-01-02-01', qty: 8, expiry: '2026-12-02', daysLeft: 10, action: 'Scrap / write-off' },
  { sku: 'SKU-7412', name: 'Masker Wajah Aloe 10pcs', lot: 'LOT-2608-B', location: 'B-03-02-01', qty: 36, expiry: '2026-12-05', daysLeft: 13, action: 'Hold · QC ulang' },
  { sku: 'SKU-4520', name: 'Serum Vitamin C 30ml', lot: 'LOT-2609-A', location: 'A-02-01-04', qty: 18, expiry: '2026-12-18', daysLeft: 26, action: 'Prioritaskan FEFO' },
  { sku: 'SKU-4488', name: 'Face Wash Gentle 100ml', lot: 'LOT-2609-E', location: 'A-03-01-02', qty: 12, expiry: '2026-12-28', daysLeft: 36, action: 'Promo channel' },
  { sku: 'SKU-1155', name: 'Sereal Granola 400g', lot: 'LOT-2609-D', location: 'A-01-04-02', qty: 42, expiry: '2027-01-22', daysLeft: 61, action: 'Monitor' },
  { sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', lot: 'LOT-2611-C', location: 'B-01-03-02', qty: 228, expiry: '2027-02-20', daysLeft: 90, action: 'Monitor' },
  { sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', lot: 'LOT-2608-C', location: 'B-02-01-02', qty: 60, expiry: '2027-03-14', daysLeft: 112, action: 'Monitor' },
]

export const replenishment = [
  { sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', pickFace: 'A-01-02-03', current: 24, min: 60, max: 240, suggest: 216, priority: 'Tinggi' },
  { sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', pickFace: 'A-02-01-01', current: 36, min: 48, max: 180, suggest: 144, priority: 'Tinggi' },
  { sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', pickFace: 'B-01-03-02', current: 48, min: 60, max: 228, suggest: 180, priority: 'Normal' },
  { sku: 'SKU-3311', name: 'Sabun Cair Sensitive 500ml', pickFace: 'A-03-02-01', current: 30, min: 40, max: 96, suggest: 66, priority: 'Normal' },
  { sku: 'SKU-9021', name: 'Madu Hutan 500ml', pickFace: 'B-02-02-04', current: 18, min: 24, max: 120, suggest: 102, priority: 'Rendah' },
  { sku: 'SKU-3377', name: 'Pasta Gigi Herbal 150g', pickFace: 'B-01-01-03', current: 36, min: 48, max: 144, suggest: 108, priority: 'Normal' },
]

export const returns = [
  { id: 'RMA-2026-0044', order: 'SO-2026-117902', customer: 'Dewi Lestari', sku: 'SKU-4488', name: 'Face Wash Gentle 100ml', qty: 12, reason: 'Tidak sesuai deskripsi', grade: 'B', status: 'Inspeksi', received: '22 Nov', disposition: '—' },
  { id: 'RMA-2026-0043', order: 'SO-2026-117844', customer: 'Agus Wijaya', sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', qty: 2, reason: 'Kemasan rusak', grade: 'C', status: 'Menunggu Disposisi', received: '22 Nov', disposition: 'Quarantine' },
  { id: 'RMA-2026-0042', order: 'SO-2026-117801', customer: 'Maya Putri', sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', qty: 1, reason: 'Salah item', grade: 'A', status: 'Selesai', received: '21 Nov', disposition: 'Restock' },
  { id: 'RMA-2026-0041', order: 'SO-2026-117766', customer: 'Rizky Ramadhan', sku: 'SKU-4520', name: 'Serum Vitamin C 30ml', qty: 1, reason: 'Kedaluwarsa dekat', grade: 'B', status: 'Selesai', received: '21 Nov', disposition: 'RTV' },
  { id: 'RMA-2026-0040', order: 'SO-2026-117702', customer: 'Nadia Safira', sku: 'SKU-7412', name: 'Masker Wajah Aloe 10pcs', qty: 3, reason: 'Tidak cocok', grade: 'A', status: 'Selesai', received: '20 Nov', disposition: 'Restock' },
  { id: 'RMA-2026-0039', order: 'SO-2026-117655', customer: 'Fajar Nugroho', sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', qty: 4, reason: 'Hancur saat kirim', grade: 'C', status: 'Selesai', received: '20 Nov', disposition: 'Scrap' },
  { id: 'RMA-2026-0038', order: 'SO-2026-117601', customer: 'Intan Permata', sku: 'SKU-3311', name: 'Sabun Cair Sensitive 500ml', qty: 2, reason: 'Bocor', grade: 'C', status: 'Selesai', received: '19 Nov', disposition: 'Scrap' },
]

export const returnDetail = {
  id: 'RMA-2026-0044',
  order: 'SO-2026-117902',
  customer: 'Dewi Lestari',
  channel: 'Website',
  received: '22 Nov 2026 · 08:42',
  reason: 'Tidak sesuai deskripsi',
  sku: 'SKU-4488',
  name: 'Face Wash Gentle 100ml',
  qty: 12,
  serial: 'SN-FW-88214',
  checklist: [
    { label: 'Segel kemasan utuh', pass: true },
    { label: 'Produk sesuai SKU & serial', pass: true },
    { label: 'Tidak ada tanda pemakaian', pass: false },
    { label: 'Kelengkapan aksesori', pass: true },
    { label: 'Kemasan luar layak jual', pass: false },
  ],
}

export const tasks = [
  { id: 'TSK-88214', type: 'Putaway', title: 'Simpan LPN-88214 · 240 pcs', location: 'A-01-02-03', priority: 'Tinggi', assignee: 'Sari Wulandari', status: 'Berjalan', sla: '12 mnt' },
  { id: 'TSK-88215', type: 'Pick', title: 'Pick 3 line · WAVE-1122-01', location: 'A-02-01-01', priority: 'Tinggi', assignee: 'Bayu Saputra', status: 'Berjalan', sla: '24 mnt' },
  { id: 'TSK-88216', type: 'Replenish', title: 'Isi pick face SKU-1042', location: 'A-01-02-03', priority: 'Normal', assignee: 'Doni Setiawan', status: 'Tersedia', sla: '45 mnt' },
  { id: 'TSK-88217', type: 'Count', title: 'Cycle count Zona A · 48 bin', location: 'Zona A', priority: 'Normal', assignee: 'Rina Marlina', status: 'Berjalan', sla: '2j' },
  { id: 'TSK-88218', type: 'Move', title: 'Pindah 60 pcs ke pick face', location: 'B-02-01-02', priority: 'Rendah', assignee: 'Belum ditugaskan', status: 'Tersedia', sla: '3j' },
  { id: 'TSK-88219', type: 'Pack', title: 'Pack SO-2026-118401 · 2 item', location: 'Pack Station 2', priority: 'Tinggi', assignee: 'Maya Sari', status: 'Menunggu Review', sla: '18 mnt' },
  { id: 'TSK-88220', type: 'Putaway', title: 'Simpan LPN-88215 · 180 pcs', location: 'A-02-01-01', priority: 'Normal', assignee: 'Sari Wulandari', status: 'Selesai', sla: 'Selesai' },
  { id: 'TSK-88221', type: 'Pick', title: 'Pick 4 line · WAVE-1122-02', location: 'B-01-03-02', priority: 'Normal', assignee: 'Doni Setiawan', status: 'Berjalan', sla: '1j 10m' },
  { id: 'TSK-88222', type: 'QC', title: 'Inspeksi retur RMA-2026-0044', location: 'Return Area', priority: 'Tinggi', assignee: 'Rina Marlina', status: 'Menunggu Review', sla: '30 mnt' },
  { id: 'TSK-88223', type: 'Count', title: 'Recount bin B-03-02-01', location: 'B-03-02-01', priority: 'Tinggi', assignee: 'Bayu Saputra', status: 'Tersedia', sla: '40 mnt' },
  { id: 'TSK-88224', type: 'Move', title: 'Konsolidasi LPN-87955', location: 'B-02-01-02', priority: 'Rendah', assignee: 'Belum ditugaskan', status: 'Tersedia', sla: '4j' },
  { id: 'TSK-88225', type: 'Pack', title: 'Pack SO-2026-118392 · 4 item', location: 'Pack Station 1', priority: 'Normal', assignee: 'Maya Sari', status: 'Selesai', sla: 'Selesai' },
]

export const labor = [
  { name: 'Bayu Saputra', role: 'Picker', shift: 'Shift 1', lines: 186, units: 412, accuracy: 99.4, idle: 8, zone: 'A' },
  { name: 'Sari Wulandari', role: 'Putaway', shift: 'Shift 1', lines: 142, units: 386, accuracy: 99.8, idle: 6, zone: 'A' },
  { name: 'Doni Setiawan', role: 'Picker', shift: 'Shift 1', lines: 164, units: 358, accuracy: 98.9, idle: 12, zone: 'B' },
  { name: 'Rina Marlina', role: 'Inventory', shift: 'Shift 1', lines: 96, units: 240, accuracy: 99.6, idle: 14, zone: 'C' },
  { name: 'Maya Sari', role: 'Packer', shift: 'Shift 1', lines: 128, units: 302, accuracy: 99.9, idle: 5, zone: 'Pack' },
  { name: 'Agus Salim', role: 'Picker', shift: 'Shift 2', lines: 152, units: 344, accuracy: 99.1, idle: 9, zone: 'B' },
  { name: 'Lestari Ningsih', role: 'Receiving', shift: 'Shift 2', lines: 88, units: 512, accuracy: 99.7, idle: 11, zone: 'Dock' },
]

export const items = [
  { sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', category: 'Makanan & Minuman', uom: 'pcs', stock: 344, control: 'Lot + Expiry', abc: 'A', status: 'Aktif', barcode: '8991002100421' },
  { sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', category: 'Makanan & Minuman', uom: 'pcs', stock: 240, control: 'Lot + Expiry', abc: 'A', status: 'Aktif', barcode: '8991002100872' },
  { sku: 'SKU-3311', name: 'Sabun Cair Sensitive 500ml', category: 'Perawatan Tubuh', uom: 'pcs', stock: 96, control: 'Lot', abc: 'B', status: 'Aktif', barcode: '8991002103314' },
  { sku: 'SKU-4520', name: 'Serum Vitamin C 30ml', category: 'Kosmetik', uom: 'pcs', stock: 18, control: 'Lot + Serial', abc: 'A', status: 'Aktif', barcode: '8991002104526' },
  { sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', category: 'Makanan & Minuman', uom: 'pcs', stock: 228, control: 'Lot + Expiry', abc: 'B', status: 'Aktif', barcode: '8991002105103' },
  { sku: 'SKU-6234', name: 'Minyak Kelapa 1L', category: 'Makanan & Minuman', uom: 'pcs', stock: 24, control: 'Lot + Expiry', abc: 'C', status: 'Aktif', barcode: '8991002106230' },
  { sku: 'SKU-7412', name: 'Masker Wajah Aloe 10pcs', category: 'Kosmetik', uom: 'pack', stock: 36, control: 'Lot + Expiry', abc: 'B', status: 'Aktif', barcode: '8991002107411' },
  { sku: 'SKU-8890', name: 'Beras Organik 5kg', category: 'Sembako', uom: 'sack', stock: 24, control: 'Lot', abc: 'A', status: 'Aktif', barcode: '8991002108894' },
  { sku: 'SKU-9021', name: 'Madu Hutan 500ml', category: 'Makanan & Minuman', uom: 'pcs', stock: 168, control: 'Lot + Expiry', abc: 'B', status: 'Aktif', barcode: '8991002109020' },
  { sku: 'SKU-1155', name: 'Sereal Granola 400g', category: 'Makanan & Minuman', uom: 'pcs', stock: 42, control: 'Lot + Expiry', abc: 'B', status: 'Aktif', barcode: '8991002111559' },
  { sku: 'SKU-3377', name: 'Pasta Gigi Herbal 150g', category: 'Perawatan Tubuh', uom: 'pcs', stock: 144, control: 'Lot', abc: 'C', status: 'Aktif', barcode: '8991002113379' },
  { sku: 'SKU-4488', name: 'Face Wash Gentle 100ml', category: 'Kosmetik', uom: 'pcs', stock: 12, control: 'Lot + Serial', abc: 'B', status: 'Nonaktif', barcode: '8991002114482' },
]

export const locations = [
  { code: 'A-01-02-03', zone: 'A', type: 'Pick face', capacity: 240, used: 196, status: 'Aktif', restriction: 'Single-lot' },
  { code: 'A-01-02-04', zone: 'A', type: 'Pick face', capacity: 240, used: 96, status: 'Aktif', restriction: '—' },
  { code: 'A-02-01-01', zone: 'A', type: 'Pick face', capacity: 180, used: 180, status: 'Aktif', restriction: 'Single-lot' },
  { code: 'A-02-01-04', zone: 'A', type: 'Storage', capacity: 120, used: 18, status: 'Aktif', restriction: '—' },
  { code: 'A-03-02-01', zone: 'A', type: 'Storage', capacity: 200, used: 96, status: 'Aktif', restriction: '—' },
  { code: 'B-01-03-02', zone: 'B', type: 'Storage', capacity: 300, used: 228, status: 'Aktif', restriction: '—' },
  { code: 'B-02-01-02', zone: 'B', type: 'Storage', capacity: 300, used: 60, status: 'Aktif', restriction: '—' },
  { code: 'B-02-02-04', zone: 'B', type: 'Storage', capacity: 160, used: 120, status: 'Aktif', restriction: 'Single-SKU' },
  { code: 'B-03-02-01', zone: 'B', type: 'Quarantine', capacity: 80, used: 36, status: 'Blokir', restriction: 'Hold' },
  { code: 'C-01-01-02', zone: 'C', type: 'Storage', capacity: 120, used: 96, status: 'Aktif', restriction: 'Suhu 2–8°C' },
  { code: 'C-01-02-01', zone: 'C', type: 'Storage', capacity: 120, used: 8, status: 'Aktif', restriction: 'Suhu 2–8°C' },
  { code: 'D-01-01-02', zone: 'D', type: 'Bulk', capacity: 600, used: 24, status: 'Aktif', restriction: 'Pallet only' },
  { code: 'D-01-03-02', zone: 'D', type: 'Bulk', capacity: 600, used: 24, status: 'Aktif', restriction: 'Pallet only' },
  { code: 'D-02-01-01', zone: 'D', type: 'Bulk', capacity: 600, used: 48, status: 'Aktif', restriction: 'Hazmat' },
]

export const partners = [
  { id: 'P-001', name: 'PT Sumber Pangan Nusantara', type: 'Supplier', city: 'Bekasi', contact: 'Hendra Kusuma', orders: 42, rating: 4.8, status: 'Aktif' },
  { id: 'P-002', name: 'CV Aroma Nusantara', type: 'Supplier', city: 'Bandung', contact: 'Lina Marlina', orders: 28, rating: 4.6, status: 'Aktif' },
  { id: 'P-003', name: 'PT Kosmetika Prima', type: 'Supplier', city: 'Tangerang', contact: 'Dian Puspita', orders: 36, rating: 4.9, status: 'Aktif' },
  { id: 'P-004', name: 'PT Distribusi Sehat', type: 'Supplier', city: 'Jakarta', contact: 'Rudi Hartono', orders: 19, rating: 4.3, status: 'Aktif' },
  { id: 'P-005', name: 'PT Kemasan Jaya', type: 'Supplier', city: 'Karawang', contact: 'Siti Rahma', orders: 12, rating: 4.1, status: 'Aktif' },
  { id: 'P-006', name: 'PT Sinar Retail', type: 'Customer', city: 'Jakarta', contact: 'Andi Pratama', orders: 1284, rating: 4.9, status: 'Aktif' },
  { id: 'P-007', name: 'CV Toko Sehat Sentosa', type: 'Customer', city: 'Surabaya', contact: 'Budi Santoso', orders: 342, rating: 4.7, status: 'Aktif' },
  { id: 'P-008', name: 'JNE Express', type: 'Carrier', city: 'Jakarta', contact: 'Account Manager JNE', orders: 486, rating: 4.5, status: 'Aktif' },
  { id: 'P-009', name: 'J&T Express', type: 'Carrier', city: 'Jakarta', contact: 'Account Manager J&T', orders: 512, rating: 4.4, status: 'Aktif' },
  { id: 'P-010', name: 'SiCepat Ekspres', type: 'Carrier', city: 'Jakarta', contact: 'Account Manager SiCepat', orders: 398, rating: 4.6, status: 'Aktif' },
]

export const reasonCodes = [
  { code: 'ADJ-DMG', label: 'Barang rusak', category: 'Adjustment', usage: 42, status: 'Aktif' },
  { code: 'ADJ-LOST', label: 'Hilang / tidak ditemukan', category: 'Adjustment', usage: 18, status: 'Aktif' },
  { code: 'ADJ-FOUND', label: 'Temuan stok', category: 'Adjustment', usage: 26, status: 'Aktif' },
  { code: 'RCV-SHORT', label: 'Penerimaan kurang', category: 'Inbound', usage: 34, status: 'Aktif' },
  { code: 'RCV-OVER', label: 'Penerimaan lebih', category: 'Inbound', usage: 12, status: 'Aktif' },
  { code: 'RCV-DMG', label: 'Rusak saat terima', category: 'Inbound', usage: 21, status: 'Aktif' },
  { code: 'PICK-SHORT', label: 'Short pick', category: 'Outbound', usage: 56, status: 'Aktif' },
  { code: 'PICK-WRONG', label: 'Salah ambil', category: 'Outbound', usage: 9, status: 'Aktif' },
  { code: 'RET-NS', label: 'Tidak sesuai deskripsi', category: 'Retur', usage: 28, status: 'Aktif' },
  { code: 'RET-DMG', label: 'Rusak saat pengiriman', category: 'Retur', usage: 16, status: 'Aktif' },
  { code: 'HOLD-QC', label: 'Hold hasil QC', category: 'Inventori', usage: 14, status: 'Aktif' },
  { code: 'HOLD-EXP', label: 'Mendekati kedaluwarsa', category: 'Inventori', usage: 22, status: 'Aktif' },
]

export const reports = [
  { title: 'Stock on Hand', description: 'Posisi stok per item, lokasi, lot, dan status.', category: 'Inventori', updated: 'Real-time', icon: 'boxes' },
  { title: 'Stock Card / Ledger', description: 'Riwayat pergerakan stok immutable per SKU.', category: 'Inventori', updated: 'Real-time', icon: 'scroll' },
  { title: 'Near Expiry', description: 'Lot mendekati kedaluwarsa 30/60/90 hari.', category: 'Inventori', updated: '10 mnt lalu', icon: 'clock' },
  { title: 'Penerimaan vs PO', description: 'Selisih penerimaan dan dock-to-stock time.', category: 'Inbound', updated: '15 mnt lalu', icon: 'inbound' },
  { title: 'Order Fulfillment', description: 'On-time shipping, short pick, dan cycle time.', category: 'Outbound', updated: '5 mnt lalu', icon: 'truck' },
  { title: 'Akurasi Cycle Count', description: 'Hasil hitung, selisih, dan adjustment per alasan.', category: 'Akurasi', updated: '1 jam lalu', icon: 'target' },
  { title: 'Produktivitas Tenaga Kerja', description: 'Lines/jam, unit/jam, akurasi, dan idle time.', category: 'Tenaga Kerja', updated: '20 mnt lalu', icon: 'gauge' },
  { title: 'Kapasitas & Okupansi', description: 'Utilisasi ruang per zona dan lokasi.', category: 'Kapasitas', updated: '30 mnt lalu', icon: 'layers' },
  { title: 'Analitik Retur', description: 'Alasan retur per SKU, supplier, dan kurir.', category: 'Retur', updated: '2 jam lalu', icon: 'undo' },
]

export const integrations = [
  { name: 'SAP Business One', type: 'ERP', status: 'Terhubung', lastSync: '2 mnt lalu', messages: 1284, errors: 0 },
  { name: 'Shopee', type: 'Marketplace', status: 'Terhubung', lastSync: '1 mnt lalu', messages: 8420, errors: 3 },
  { name: 'Tokopedia / TikTok Shop', type: 'Marketplace', status: 'Terhubung', lastSync: '3 mnt lalu', messages: 6210, errors: 1 },
  { name: 'Lazada', type: 'Marketplace', status: 'Terhubung', lastSync: '5 mnt lalu', messages: 2140, errors: 0 },
  { name: 'JNE', type: 'Kurir', status: 'Terhubung', lastSync: '1 mnt lalu', messages: 1860, errors: 2 },
  { name: 'J&T Express', type: 'Kurir', status: 'Terhubung', lastSync: '4 mnt lalu', messages: 2044, errors: 0 },
  { name: 'SiCepat', type: 'Kurir', status: 'Terputus', lastSync: '42 mnt lalu', messages: 980, errors: 12 },
  { name: 'Zebra Printer ZPL', type: 'Perangkat', status: 'Terhubung', lastSync: 'Real-time', messages: 640, errors: 0 },
]

export const integrationLogs = [
  { id: 'MSG-88214', time: '09:44:12', source: 'Shopee', event: 'order.created', status: 'Sukses', detail: 'SO-2026-118402 · 3 line', latency: '182 ms' },
  { id: 'MSG-88213', time: '09:43:58', source: 'SAP Business One', event: 'grn.posted', status: 'Sukses', detail: 'GRN-2026-004182', latency: '240 ms' },
  { id: 'MSG-88212', time: '09:42:31', source: 'SiCepat', event: 'awb.create', status: 'Gagal', detail: 'Timeout upstream · retry 2/5', latency: '5.000 ms' },
  { id: 'MSG-88211', time: '09:41:07', source: 'JNE', event: 'shipment.confirmed', status: 'Sukses', detail: 'JNE-8823-4410-9921', latency: '310 ms' },
  { id: 'MSG-88210', time: '09:39:44', source: 'Tokopedia', event: 'stock.sync', status: 'Sukses', detail: '1.284 SKU · ATP update', latency: '1.120 ms' },
  { id: 'MSG-88209', time: '09:38:02', source: 'Shopee', event: 'order.created', status: 'Retry', detail: 'Alamat tidak lengkap · retry 1/5', latency: '—' },
  { id: 'MSG-88208', time: '09:36:19', source: 'SAP Business One', event: 'item.sync', status: 'Sukses', detail: '42 item diperbarui', latency: '890 ms' },
  { id: 'MSG-88207', time: '09:34:55', source: 'J&T Express', event: 'tracking.update', status: 'Sukses', detail: '18 paket · in transit', latency: '205 ms' },
]

export const users = [
  { name: 'Andi Pratama', email: 'andi.pratama@gudangku.id', role: 'Warehouse Manager', warehouse: 'Semua gudang', status: 'Aktif', lastActive: 'Sekarang' },
  { name: 'Rina Marlina', email: 'rina.marlina@gudangku.id', role: 'Inventory Controller', warehouse: 'WH-CKR-01', status: 'Aktif', lastActive: '4 mnt lalu' },
  { name: 'Bayu Saputra', email: 'bayu.saputra@gudangku.id', role: 'Supervisor', warehouse: 'WH-CKR-01', status: 'Aktif', lastActive: '12 mnt lalu' },
  { name: 'Sari Wulandari', email: 'sari.wulandari@gudangku.id', role: 'Operator', warehouse: 'WH-CKR-01', status: 'Aktif', lastActive: '1 mnt lalu' },
  { name: 'Doni Setiawan', email: 'doni.setiawan@gudangku.id', role: 'Operator', warehouse: 'WH-CKR-01', status: 'Aktif', lastActive: '8 mnt lalu' },
  { name: 'Maya Sari', email: 'maya.sari@gudangku.id', role: 'Packer', warehouse: 'WH-CKR-01', status: 'Aktif', lastActive: '3 mnt lalu' },
  { name: 'Agus Salim', email: 'agus.salim@gudangku.id', role: 'Operator', warehouse: 'WH-SBY-02', status: 'Nonaktif', lastActive: '2 hari lalu' },
  { name: 'Dian Puspita', email: 'dian.puspita@kosmetikaprima.co.id', role: 'Klien 3PL', warehouse: 'WH-CKR-01', status: 'Aktif', lastActive: '1 jam lalu' },
]

export const roles = [
  { name: 'Warehouse Manager', users: 2, scope: 'Semua gudang', permissions: 'Penuh kecuali konfigurasi tenant' },
  { name: 'Supervisor', users: 4, scope: 'Gudang ditugaskan', permissions: 'Task, approval, override' },
  { name: 'Operator', users: 38, scope: 'Gudang ditugaskan', permissions: 'Task mobile & scan' },
  { name: 'Inventory Controller', users: 3, scope: 'Gudang ditugaskan', permissions: 'Count, adjustment, hold' },
  { name: 'Auditor', users: 1, scope: 'Read-only', permissions: 'Ledger & audit trail' },
  { name: 'Klien 3PL', users: 6, scope: 'Data klien sendiri', permissions: 'Portal stok & order' },
]

export const auditLogs = [
  { id: 'AUD-99201', time: '22 Nov · 09:44', actor: 'Rina Marlina', action: 'Menyetujui adjustment', entity: 'ADJ-2026-0091', detail: '−4 pcs · Rp 196.000', ip: '10.20.4.18' },
  { id: 'AUD-99200', time: '22 Nov · 09:31', actor: 'Bayu Saputra', action: 'Short pick', entity: 'SO-2026-118402', detail: 'SKU-4520 · qty 1', ip: '10.20.4.42' },
  { id: 'AUD-99199', time: '22 Nov · 09:12', actor: 'Sari Wulandari', action: 'Override putaway', entity: 'LPN-88214', detail: 'A-01-02-03 → A-01-02-04 · reason: kapasitas', ip: '10.20.4.31' },
  { id: 'AUD-99198', time: '22 Nov · 08:58', actor: 'Andi Pratama', action: 'Mengubah konfigurasi', entity: 'WH-CKR-01', detail: 'Cut-off J&T 11:30 → 11:45', ip: '10.20.1.10' },
  { id: 'AUD-99197', time: '22 Nov · 08:44', actor: 'Sistem', action: 'Sinkronisasi ERP', entity: 'GRN-2026-004179', detail: '42 line · sukses', ip: '—' },
  { id: 'AUD-99196', time: '22 Nov · 08:20', actor: 'Doni Setiawan', action: 'Login mobile', entity: 'Device RF-014', detail: 'PIN · shift 1', ip: '10.20.6.14' },
  { id: 'AUD-99195', time: '22 Nov · 08:02', actor: 'Rina Marlina', action: 'Hold stok', entity: 'LOT-2608-B', detail: '36 pack · reason HOLD-QC', ip: '10.20.4.18' },
  { id: 'AUD-99194', time: '21 Nov · 17:48', actor: 'Sari Wulandari', action: 'Cycle count', entity: 'CC-2026-0077', detail: 'Selisih −2 · recount', ip: '10.20.4.31' },
  { id: 'AUD-99193', time: '21 Nov · 17:12', actor: 'Andi Pratama', action: 'Membuat pengguna', entity: 'USR-0042', detail: 'Role: Packer · WH-CKR-01', ip: '10.20.1.10' },
  { id: 'AUD-99192', time: '21 Nov · 16:40', actor: 'Sistem', action: 'Webhook gagal', entity: 'SiCepat · awb.create', detail: 'Timeout · retry 2/5', ip: '—' },
]

export const notifications = [
  { id: 'n1', title: 'SLA berisiko', body: 'SO-2026-118396 melewati cut-off Ninja Xpress 12 menit.', time: '2 mnt', tone: 'danger' as const },
  { id: 'n2', title: 'Approval menunggu', body: 'ADJ-2026-0090 menunggu persetujuan Anda.', time: '18 mnt', tone: 'warning' as const },
  { id: 'n3', title: 'Stok minimum', body: 'SKU-4520 tersisa 18 pcs dari minimum 60.', time: '42 mnt', tone: 'warning' as const },
  { id: 'n4', title: 'Integrasi terputus', body: 'SiCepat tidak merespons selama 42 menit.', time: '1 jam', tone: 'danger' as const },
]

export const portalSummary = {
  client: 'PT Sinar Retail',
  warehouse: 'Gudang Cikarang',
  stockValue: 8_420_000_000,
  skus: 1284,
  openOrders: 86,
  inboundToday: 3,
  slaCompliance: 97.4,
  storageUsed: 68,
}

export const portalStock = inventory.slice(0, 6)
