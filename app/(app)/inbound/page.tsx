'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CalendarClock,
  ChevronRight,
  Download,
  PackageCheck,
  PackageOpen,
  Plus,
  Timer,
  Truck,
  Upload,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { Tabs } from '@/components/ui-kit/tabs'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { inboundShipments, type Inbound } from '@/lib/data'
import { formatNumber } from '@/lib/format'

const docks = [
  { dock: 'Dock 1', vehicle: 'B 9021 KHD', supplier: 'CV Aroma Nusantara', time: '08:15–10:00', status: 'QC', tone: 'violet' as const },
  { dock: 'Dock 2', vehicle: 'B 1148 TRC', supplier: 'PT Sumber Pangan', time: '09:30–11:30', status: 'Receiving', tone: 'info' as const },
  { dock: 'Dock 3', vehicle: 'B 7712 JKT', supplier: 'PT Kosmetika Prima', time: '11:00–12:30', status: 'Menunggu', tone: 'neutral' as const },
  { dock: 'Dock 4', vehicle: '—', supplier: 'Belum dijadwalkan', time: '13:00–15:00', status: 'Kosong', tone: 'neutral' as const },
]

const tabItems = [
  { value: 'all', label: 'Semua' },
  { value: 'Menunggu', label: 'Menunggu' },
  { value: 'Receiving', label: 'Receiving' },
  { value: 'QC', label: 'QC' },
  { value: 'Putaway', label: 'Putaway' },
  { value: 'Selesai', label: 'Selesai' },
]

export default function InboundPage() {
  const [tab, setTab] = useState('all')

  const rows = useMemo(
    () => (tab === 'all' ? inboundShipments : inboundShipments.filter((row) => row.status === tab)),
    [tab],
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: inboundShipments.length }
    for (const row of inboundShipments) map[row.status] = (map[row.status] ?? 0) + 1
    return map
  }, [])

  const columns: Column<Inbound>[] = [
    {
      key: 'id',
      header: 'ASN / PO',
      sortValue: (row) => row.id,
      render: (row) => (
        <div>
          <p className="text-[11.5px] font-semibold text-ink">{row.id}</p>
          <p className="text-[10px] text-faint">{row.po}</p>
        </div>
      ),
    },
    {
      key: 'supplier',
      header: 'Supplier',
      sortValue: (row) => row.supplier,
      render: (row) => <span className="text-[11.5px] text-ink-soft">{row.supplier}</span>,
    },
    {
      key: 'qty',
      header: 'Ekspektasi / Diterima',
      sortValue: (row) => row.expected,
      render: (row) => (
        <div className="w-36">
          <div className="mb-1 flex items-baseline justify-between text-[10.5px]">
            <span className="font-medium text-ink tabular-nums">{formatNumber(row.received)}</span>
            <span className="text-faint tabular-nums">/ {formatNumber(row.expected)} pcs</span>
          </div>
          <Progress value={row.progress} tone={row.progress === 100 ? 'green' : 'dark'} />
        </div>
      ),
    },
    {
      key: 'dock',
      header: 'Dock',
      render: (row) => <span className="text-[11px] text-ink-soft">{row.dock}</span>,
    },
    {
      key: 'eta',
      header: 'ETA',
      sortValue: (row) => row.eta,
      render: (row) => <span className="text-[11px] whitespace-nowrap text-ink-soft">{row.eta}</span>,
    },
    {
      key: 'operator',
      header: 'Operator',
      render: (row) => <span className="text-[11px] text-ink-soft">{row.operator}</span>,
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
        title="Inbound"
        description="Penerimaan barang dari PO, ASN, transfer, dan retur — lengkap dengan QC dan putaway terarah."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Upload className="size-3.5" />
              Impor ASN
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Buat Penerimaan
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="PO terbuka" value="18" hint="6 supplier" icon={<PackageOpen className="size-4" />} />
        <StatCard
          label="Menunggu dock"
          value="3"
          hint="slot hari ini"
          icon={<Truck className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Diterima hari ini"
          value="1.240"
          unit="pcs"
          delta="8,2%"
          hint="vs kemarin"
          icon={<PackageCheck className="size-4" />}
          tone="blue"
        />
        <StatCard
          label="Dock-to-stock"
          value="4j 12m"
          delta="1j 08m"
          hint="target ≤ 8 jam"
          icon={<Timer className="size-4" />}
          tone="violet"
        />
      </div>

      <Panel>
        <PanelHeader
          title="Jadwal dock hari ini"
          subtitle="Sabtu, 22 November 2026 · 4 dock aktif"
          action={
            <Link href="/inbound/putaway" className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-[#12703f] hover:underline">
              Putaway queue
              <ChevronRight className="size-3" />
            </Link>
          }
        />
        <PanelBody className="grid grid-cols-1 gap-2.5 pt-0 sm:grid-cols-2 xl:grid-cols-4">
          {docks.map((dock) => (
            <div key={dock.dock} className="rounded-xl border border-line bg-[#fafcf9] p-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-ink">{dock.dock}</span>
                <Badge tone={dock.tone} dot>
                  {dock.status}
                </Badge>
              </div>
              <p className="mt-2 text-[10.5px] font-medium text-ink-soft">{dock.supplier}</p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-faint">
                <span className="font-mono">{dock.vehicle}</span>
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="size-3" />
                  {dock.time}
                </span>
              </div>
            </div>
          ))}
        </PanelBody>
      </Panel>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Penerimaan & ASN"
          subtitle="Semua dokumen inbound lintas supplier"
          action={
            <button className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
              <Download className="size-3.5" />
              Ekspor
            </button>
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
          search={(row) => `${row.id} ${row.po} ${row.supplier} ${row.operator}`}
          searchPlaceholder="Cari ASN, PO, supplier…"
          filters={[
            {
              key: 'dock',
              label: 'Semua dock',
              options: ['Dock 1', 'Dock 2', 'Dock 3', 'Dock 4'],
              match: (row, value) => row.dock === value,
            },
          ]}
          rowHref={(row) => `/inbound/${row.id}`}
          pageSize={6}
          minWidth={900}
        />
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-white px-4 py-3">
        <p className="text-[11px] text-faint">
          <span className="font-semibold text-ink">Tips:</span> gunakan blind receiving untuk supplier dengan
          riwayat selisih tinggi.
        </p>
        <Link href="/inbound/qc" className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#12703f] hover:underline">
          Buka QC inbound
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  )
}
