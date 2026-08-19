'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  ChevronRight,
  Layers,
  PackageCheck,
  Plus,
  Timer,
  Truck,
  Upload,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Tabs } from '@/components/ui-kit/tabs'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { orders, type Order } from '@/lib/data'
import { formatIDR } from '@/lib/format'

const pipeline = [
  { label: 'Draft', value: 12, tone: 'bg-[#f2f5f1] text-[#5b6b61]' },
  { label: 'Allocated', value: 86, tone: 'bg-[#eaf2fe] text-[#1d4ed8]' },
  { label: 'Picking', value: 214, tone: 'bg-[#f1ecfe] text-[#6d28d9]' },
  { label: 'Packing', value: 96, tone: 'bg-[#fef6e7] text-[#96600a]' },
  { label: 'Staged', value: 48, tone: 'bg-mint text-[#12703f]' },
  { label: 'Shipped', value: 828, tone: 'bg-[#e8f5ec] text-[#12703f]' },
]

const tabItems = [
  { value: 'all', label: 'Semua' },
  { value: 'Allocated', label: 'Allocated' },
  { value: 'Picking', label: 'Picking' },
  { value: 'Packing', label: 'Packing' },
  { value: 'Staged', label: 'Staged' },
  { value: 'Shipped', label: 'Shipped' },
  { value: 'On Hold', label: 'On Hold' },
]

export default function OutboundPage() {
  const [tab, setTab] = useState('all')

  const rows = useMemo(
    () => (tab === 'all' ? orders : orders.filter((order) => order.status === tab)),
    [tab],
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: orders.length }
    for (const order of orders) map[order.status] = (map[order.status] ?? 0) + 1
    return map
  }, [])

  const columns: Column<Order>[] = [
    {
      key: 'id',
      header: 'Order',
      sortValue: (row) => row.id,
      render: (row) => (
        <div>
          <p className="text-[11.5px] font-semibold text-ink">{row.id}</p>
          <p className="text-[10px] text-faint">
            {row.createdAt} · {row.priority}
          </p>
        </div>
      ),
    },
    {
      key: 'channel',
      header: 'Channel',
      sortValue: (row) => row.channel,
      render: (row) => (
        <span className="inline-flex items-center rounded-md bg-panel px-1.5 py-0.5 text-[10px] font-medium text-ink-soft">
          {row.channel}
        </span>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortValue: (row) => row.customer,
      render: (row) => (
        <div>
          <p className="text-[11px] font-medium text-ink">{row.customer}</p>
          <p className="text-[10px] text-faint">{row.city}</p>
        </div>
      ),
    },
    {
      key: 'items',
      header: 'Item',
      sortValue: (row) => row.items,
      render: (row) => (
        <span className="text-[11px] text-ink-soft tabular-nums">
          {row.items} line · {row.qty} pcs
        </span>
      ),
    },
    {
      key: 'value',
      header: 'Nilai',
      sortValue: (row) => row.value,
      render: (row) => (
        <span className="text-[11px] font-medium text-ink tabular-nums">{formatIDR(row.value, true)}</span>
      ),
    },
    {
      key: 'carrier',
      header: 'Kurir',
      render: (row) => <span className="text-[11px] text-ink-soft">{row.carrier}</span>,
    },
    {
      key: 'sla',
      header: 'SLA',
      render: (row) => (
        <span
          className={`text-[10.5px] font-medium tabular-nums ${
            row.sla.startsWith('Terlambat') ? 'text-[#b42318]' : 'text-ink-soft'
          }`}
        >
          {row.sla}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'action',
      header: '',
      className: 'w-8',
      render: () => <ChevronRight className="size-3.5 text-[#b3bfb7]" />,
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Outbound"
        description="Alokasi, wave, picking, packing, dan pengiriman — dari order masuk sampai serah terima kurir."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Upload className="size-3.5" />
              Impor Order
            </button>
            <Link href="/outbound/waves" className={buttonStyles({ variant: 'primary' })}>
              <Layers className="size-3.5" />
              Buat Wave
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Order hari ini" value="1.284" delta="12,4%" hint="vs kemarin" icon={<PackageCheck className="size-4" />} />
        <StatCard label="Siap alokasi" value="86" hint="stok tersedia" icon={<Plus className="size-4" />} tone="blue" />
        <StatCard label="Sedang picking" value="214" hint="5 wave aktif" icon={<Layers className="size-4" />} tone="violet" />
        <StatCard label="On-time shipping" value="97,4%" delta="1,2%" hint="target ≥ 97%" icon={<Truck className="size-4" />} tone="amber" />
      </div>

      <Panel>
        <PanelHeader
          title="Pipeline fulfillment"
          subtitle="Distribusi order per tahap · real-time"
          action={<Badge tone="mint" dot>Live</Badge>}
        />
        <PanelBody className="pt-0">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
            {pipeline.map((stage, index) => (
              <div key={stage.label} className="flex flex-1 items-center gap-2">
                <div className="flex-1 rounded-xl border border-line bg-[#fafcf9] p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-medium text-faint">{stage.label}</span>
                    <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-semibold ${stage.tone}`}>
                      {index === 5 ? 'selesai' : 'aktif'}
                    </span>
                  </div>
                  <p className="mt-1 text-[18px] leading-none font-semibold text-ink tabular-nums">{stage.value}</p>
                </div>
                {index < pipeline.length - 1 ? (
                  <ArrowRight className="hidden size-3.5 shrink-0 text-[#c3cec6] sm:block" />
                ) : null}
              </div>
            ))}
          </div>
        </PanelBody>
      </Panel>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Order outbound"
          subtitle="Semua channel: marketplace, website, dan ERP"
          action={
            <span className="inline-flex items-center gap-1 text-[10.5px] text-faint">
              <Timer className="size-3.5" />
              Cut-off terdekat 11:30
            </span>
          }
        />
        <div className="px-5 pb-3">
          <Tabs
            items={tabItems.map((item) => ({ ...item, count: counts[item.value] ?? 0 }))}
            value={tab}
            onChange={setTab}
          />
        </div>
        <DataTable
          rows={rows}
          columns={columns}
          getRowKey={(row) => row.id}
          search={(row) => `${row.id} ${row.customer} ${row.city} ${row.channel} ${row.carrier}`}
          searchPlaceholder="Cari order, customer, kurir…"
          filters={[
            {
              key: 'channel',
              label: 'Semua channel',
              options: ['Shopee', 'Tokopedia', 'TikTok Shop', 'Lazada', 'Blibli', 'Website'],
              match: (row, value) => row.channel === value,
            },
            {
              key: 'carrier',
              label: 'Semua kurir',
              options: ['JNE', 'J&T', 'SiCepat', 'Anteraja', 'Ninja Xpress'],
              match: (row, value) => row.carrier === value,
            },
          ]}
          rowHref={(row) => `/outbound/${row.id}`}
          pageSize={8}
          minWidth={980}
        />
      </Panel>
    </div>
  )
}
