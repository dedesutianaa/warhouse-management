'use client'

import { useMemo, useState } from 'react'
import { Building2, Plus, Star, Truck, Upload, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Tabs } from '@/components/ui-kit/tabs'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { partners } from '@/lib/data'
import { formatNumber } from '@/lib/format'

type Partner = (typeof partners)[number]

const tabItems = [
  { value: 'all', label: 'Semua' },
  { value: 'Supplier', label: 'Supplier' },
  { value: 'Customer', label: 'Customer' },
  { value: 'Carrier', label: 'Kurir' },
]

export default function PartnersPage() {
  const [tab, setTab] = useState('all')

  const rows = useMemo(
    () => (tab === 'all' ? partners : partners.filter((row) => row.type === tab)),
    [tab],
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: partners.length }
    for (const row of partners) map[row.type] = (map[row.type] ?? 0) + 1
    return map
  }, [])

  const columns: Column<Partner>[] = [
    {
      key: 'name',
      header: 'Nama partner',
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-panel text-[#5b6b61]">
            {row.type === 'Carrier' ? <Truck className="size-3.5" /> : <Building2 className="size-3.5" />}
          </span>
          <div>
            <p className="text-[11.5px] font-semibold text-ink">{row.name}</p>
            <p className="font-mono text-[9.5px] text-faint">{row.id}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Tipe',
      render: (row) => (
        <Badge tone={row.type === 'Supplier' ? 'info' : row.type === 'Customer' ? 'success' : 'violet'}>
          {row.type}
        </Badge>
      ),
    },
    {
      key: 'city',
      header: 'Kota',
      sortValue: (row) => row.city,
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.city}</span>,
    },
    {
      key: 'contact',
      header: 'Kontak',
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.contact}</span>,
    },
    {
      key: 'orders',
      header: 'Order',
      sortValue: (row) => row.orders,
      render: (row) => <span className="text-[11px] font-medium text-ink tabular-nums">{formatNumber(row.orders)}</span>,
    },
    {
      key: 'rating',
      header: 'Rating',
      sortValue: (row) => row.rating,
      render: (row) => (
        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-ink">
          <Star className="size-3 fill-[#f59e0b] text-[#f59e0b]" />
          {row.rating.toFixed(1)}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Partner"
        description="Master supplier, customer, carrier, dan klien 3PL beserta alamat dan kontak."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Upload className="size-3.5" />
              Impor
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Tambah partner
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Supplier" value="42" hint="5 supplier utama" icon={<Building2 className="size-4" />} />
        <StatCard label="Customer" value="1.284" delta="86" hint="baru bulan ini" icon={<Users className="size-4" />} tone="blue" />
        <StatCard label="Kurir" value="8" hint="6 aktif hari ini" icon={<Truck className="size-4" />} tone="violet" />
        <StatCard label="Rating rata-rata" value="4,6" hint="dari 5 · 90 hari" icon={<Star className="size-4" />} tone="amber" />
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Direktori partner"
          subtitle="10 partner contoh"
          action={<Badge tone="mint">1.334 total</Badge>}
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
          search={(row) => `${row.name} ${row.city} ${row.contact} ${row.type}`}
          searchPlaceholder="Cari nama, kota, kontak…"
          filters={[
            {
              key: 'city',
              label: 'Semua kota',
              options: ['Jakarta', 'Bekasi', 'Bandung', 'Tangerang', 'Karawang', 'Surabaya'],
              match: (row, value) => row.city === value,
            },
          ]}
          pageSize={8}
          minWidth={860}
        />
      </Panel>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { title: 'Supplier terbaik', name: 'PT Kosmetika Prima', metric: '99,4% kualitas', tone: 'success' as const },
          { title: 'Customer terbesar', name: 'PT Sinar Retail', metric: '1.284 order', tone: 'info' as const },
          { title: 'Kurir on-time', name: 'SiCepat Ekspres', metric: '98,1% on-time', tone: 'violet' as const },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-line bg-white p-3.5">
            <p className="text-[9.5px] tracking-[0.1em] text-faint uppercase">{item.title}</p>
            <p className="mt-1 text-[12px] font-semibold text-ink">{item.name}</p>
            <div className="mt-1.5">
              <Badge tone={item.tone}>{item.metric}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
