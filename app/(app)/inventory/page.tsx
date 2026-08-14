'use client'

import Link from 'next/link'
import {
  ArrowLeftRight,
  Boxes,
  Download,
  Layers,
  ScanSearch,
  ShieldCheck,
  Timer,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { ZoneBars } from '@/components/ui-kit/zone-bars'
import { buttonStyles } from '@/components/ui-kit/button'
import { inventory, zoneOccupancy, type StockRow } from '@/lib/data'
import { formatNumber } from '@/lib/format'

export default function InventoryPage() {
  const columns: Column<StockRow>[] = [
    {
      key: 'sku',
      header: 'SKU / Item',
      sortValue: (row) => row.sku,
      render: (row) => (
        <div>
          <p className="text-[11.5px] font-semibold text-ink">{row.name}</p>
          <p className="font-mono text-[10px] text-faint">{row.sku}</p>
        </div>
      ),
    },
    {
      key: 'location',
      header: 'Lokasi',
      sortValue: (row) => row.location,
      render: (row) => (
        <span className="rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-[#12703f]">
          {row.location}
        </span>
      ),
    },
    {
      key: 'lpn',
      header: 'LPN',
      render: (row) => <span className="font-mono text-[10px] text-ink-soft">{row.lpn}</span>,
    },
    {
      key: 'lot',
      header: 'Lot / Expiry',
      sortValue: (row) => row.expiry,
      render: (row) => (
        <div>
          <p className="font-mono text-[10px] text-ink-soft">{row.lot}</p>
          <p className="text-[9.5px] text-faint">{row.expiry}</p>
        </div>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      sortValue: (row) => row.qty,
      render: (row) => (
        <span className="text-[11px] font-semibold text-ink tabular-nums">
          {formatNumber(row.qty)} <span className="text-[9.5px] font-normal text-faint">{row.uom}</span>
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'owner',
      header: 'Pemilik',
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.owner}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Inventori"
        description="Visibilitas stok real-time sampai level lokasi, LPN, lot, serial, dan pemilik barang."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Download className="size-3.5" />
              Ekspor
            </button>
            <Link href="/inventory/cycle-count" className={buttonStyles({ variant: 'primary' })}>
              <ScanSearch className="size-3.5" />
              Stock opname
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total SKU aktif" value="4.812" delta="86" hint="SKU baru bulan ini" icon={<Boxes className="size-4" />} />
        <StatCard label="Nilai stok" value="Rp 18,4 M" hint="valuasi rata-rata" icon={<Layers className="size-4" />} tone="blue" />
        <StatCard label="Okupansi bin" value="76%" delta="4%" hint="vs bulan lalu" icon={<ShieldCheck className="size-4" />} tone="violet" />
        <StatCard label="Near expiry" value="24" unit="lot" hint="≤ 90 hari" icon={<Timer className="size-4" />} tone="amber" />
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Inventory explorer"
          subtitle="1.004 bin · 1.842 LPN aktif · 3 pemilik barang"
          action={
            <Link href="/inventory/ledger" className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-[#12703f] hover:underline">
              Stock ledger
              <ArrowLeftRight className="size-3" />
            </Link>
          }
        />
        <DataTable
          rows={inventory}
          columns={columns}
          getRowKey={(row) => row.id}
          search={(row) => `${row.sku} ${row.name} ${row.location} ${row.lpn} ${row.lot} ${row.owner}`}
          searchPlaceholder="Cari SKU, lokasi, lot, LPN…"
          filters={[
            {
              key: 'zone',
              label: 'Semua zona',
              options: ['A', 'B', 'C', 'D'],
              match: (row, value) => row.zone === value,
            },
            {
              key: 'status',
              label: 'Semua status',
              options: ['Available', 'Allocated', 'Hold', 'Quarantine', 'Damaged', 'Expired', 'Blocked'],
              match: (row, value) => row.status === value,
            },
            {
              key: 'owner',
              label: 'Semua pemilik',
              options: ['PT Sinar Retail', 'PT Kosmetika Prima', 'CV Aroma Nusantara', 'PT Distribusi Sehat'],
              match: (row, value) => row.owner === value,
            },
          ]}
          pageSize={8}
          minWidth={980}
        />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel>
          <PanelHeader title="Distribusi status stok" subtitle="Berdasarkan qty tersedia" />
          <PanelBody className="space-y-3 pt-0">
            {[
              { label: 'Available', value: 78, tone: 'green' as const },
              { label: 'Allocated', value: 12, tone: 'blue' as const },
              { label: 'Hold / Quarantine', value: 6, tone: 'amber' as const },
              { label: 'Damaged / Expired', value: 4, tone: 'rose' as const },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-[10.5px]">
                  <span className="text-ink-soft">{item.label}</span>
                  <span className="font-semibold text-ink tabular-nums">{item.value}%</span>
                </div>
                <Progress value={item.value} tone={item.tone} />
              </div>
            ))}
          </PanelBody>
          <PanelFooter>
            <span>Stok tidak boleh negatif</span>
            <Link href="/inventory/adjustments" className="font-medium text-[#12703f] hover:underline">
              Adjustment
            </Link>
          </PanelFooter>
        </Panel>

        <Panel>
          <PanelHeader title="Okupansi zona" subtitle="Bin terpakai per zona" action={<Badge tone="mint">76%</Badge>} />
          <PanelBody className="pt-0">
            <ZoneBars items={zoneOccupancy} />
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Traceability cepat" subtitle="Lacak lot, serial, atau LPN" />
          <PanelBody className="space-y-2.5 pt-0">
            <div className="relative">
              <ScanSearch className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8a988f]" />
              <input
                placeholder="LOT-2611-A / SN-FW-88214 / LPN-88214"
                aria-label="Cari lot, serial, atau LPN"
                className="h-9 w-full rounded-xl border border-line bg-white pr-3 pl-8.5 font-mono text-[10.5px] text-ink placeholder:font-sans placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
              />
            </div>
            <div className="rounded-xl border border-line p-2.5">
              <p className="text-[9.5px] text-faint">Contoh hasil · LOT-2611-A</p>
              <p className="mt-0.5 text-[11px] font-semibold text-ink">Kopi Arabika Gayo 250g</p>
              <p className="text-[10px] text-ink-soft">240 pcs · A-01-02-03 · diterima 22 Nov</p>
              <div className="mt-1.5 flex gap-1.5">
                <Badge tone="success">Available</Badge>
                <Badge tone="neutral">2 order terkirim</Badge>
              </div>
            </div>
            <p className="text-[9.5px] leading-relaxed text-faint">
              Traceability maju &amp; mundur tersedia dari supplier sampai customer.
            </p>
          </PanelBody>
        </Panel>
      </div>
    </div>
  )
}
