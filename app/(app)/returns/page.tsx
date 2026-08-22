'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, ChevronRight, Upload, Undo2, RotateCcw, ShieldAlert } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelHeader, PanelBody, PanelFooter } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Tabs } from '@/components/ui-kit/tabs'
import { DataTable, type DataTableColumn } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'

interface ReturnRow {
  id: string
  rmaNumber: string
  order?: { orderNumber: string }
  customer: { name: string }
  warehouse: { name: string }
  lines: Array<{ item: { name: string; sku: string }; qty: number }>
  status: string
  grade?: string
  disposition?: string
  createdAt: string
  receivedAt?: string
}

const STATUS_MAP: Record<string, string> = {
  RMA_CREATED: 'Pending',
  RECEIVED: 'Received',
  INSPECTION: 'Inspection',
  DISPOSITION_PENDING: 'Pending',
  RESTOCKED: 'Restocked',
  REFURBISH: 'Refurbish',
  QUARANTINE: 'Quarantine',
  SCRAPPED: 'Scrapped',
  RTV: 'RTV',
  COMPLETED: 'Completed',
}

const GRADE_TONES: Record<string, string> = {
  A: 'success',
  B: 'warning',
  C: 'neutral',
  DAMAGED: 'danger',
}

const tabItems = [
  { value: 'all', label: 'Semua' },
  { value: 'RMA_CREATED', label: 'RMA Created' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'INSPECTION', label: 'Inspection' },
  { value: 'DISPOSITION_PENDING', label: 'Disposition Pending' },
  { value: 'RESTOCKED', label: 'Restocked' },
  { value: 'REFURBISH', label: 'Refurbish' },
  { value: 'QUARANTINE', label: 'Quarantine' },
  { value: 'SCRAPPED', label: 'Scrapped' },
  { value: 'RTV', label: 'RTV' },
  { value: 'COMPLETED', label: 'Completed' },
]

export default function ReturnsPage() {
  const [returns, setReturns] = useState<ReturnRow[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [page, setPage] = useState(0)
  const pageSize = 7

  const fetchReturns = async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: (page + 1).toString(),
      limit: pageSize.toString(),
      sortBy: 'createdAt',
      sortOrder: 'desc',
    })
    if (tab !== 'all') params.set('status', tab)
    if (search) params.set('search', search)

    try {
      const res = await fetch(`/api/v1/returns?${params}`)
      const data = await res.json()
      if (data.success) {
        setReturns(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch returns:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReturns()
  }, [tab, page, search])

  const filteredReturns = returns

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: returns.length }
    for (const row of returns) map[row.status] = (map[row.status] ?? 0) + 1
    return map
  }, [returns])

  const columns: DataTableColumn<ReturnRow>[] = [
    {
      key: 'rmaNumber',
      header: 'RMA / Order',
      sortValue: (row) => row.rmaNumber,
      render: (row) => (
        <div>
          <p className="text-[11.5px] font-semibold text-ink">{row.rmaNumber}</p>
          <p className="text-[10px] text-faint">{row.order?.orderNumber || '-'}</p>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortValue: (row) => row.customer.name,
      render: (row) => <span className="text-[11px] text-ink-soft">{row.customer.name}</span>,
    },
    {
      key: 'warehouse',
      header: 'Warehouse',
      render: (row) => <span className="text-[11px] text-ink-soft">{row.warehouse.name}</span>,
    },
    {
      key: 'item',
      header: 'Item',
      render: (row) => (
        <div>
          <p className="text-[11px] font-medium text-ink">{row.lines[0]?.item.name || '-'}</p>
          <p className="font-mono text-[9.5px] text-faint">{row.lines[0]?.item.sku || '-'}</p>
        </div>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      sortValue: (row) => row.lines.reduce((sum, l) => sum + l.qty, 0),
      render: (row) => <span className="text-[11px] font-medium text-ink tabular-nums">{row.lines.reduce((sum, l) => sum + l.qty, 0)}</span>,
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (row) => row.grade ? <Badge tone={GRADE_TONES[row.grade] as any}>{row.grade}</Badge> : '-',
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={STATUS_MAP[row.status] || row.status} />,
    },
    {
      key: 'disposition',
      header: 'Disposisi',
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.disposition || '-'}</span>,
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
        title="Retur"
        description="Reverse logistics: RMA, inspeksi, grading, disposisi, dan pemicu refund ke OMS."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Upload className="size-3.5" />
              Impor RMA
            </button>
            <Link href="/returns/new" className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Buat RMA
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="RMA terbuka" value={counts.RMA_CREATED || 0} hint="perlu tindakan" icon={<Undo2 className="size-4" />} tone="amber" />
        <StatCard label="Menunggu inspeksi" value={counts.INSPECTION || 0} hint="RMA pending" icon={<RotateCcw className="size-4" />} tone="blue" />
        <StatCard label="Disposisi restock" value={counts.RESTOCKED || 0} hint="7 hari terakhir" icon={<Undo2 className="size-4" />} />
        <StatCard label="Nilai retur" value="Rp 2,4 jt" delta="6%" deltaTone="down" hint="bulan ini" icon={<ShieldAlert className="size-4" />} tone="violet" />
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Daftar retur"
          subtitle="Semua RMA dari marketplace, website, dan manual"
          action={<Badge tone="mint">{returns.length} RMA</Badge>}
        />
        <div className="px-5 pb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#9aa79f]" />
              <input
                type="search"
                value={search}
                onChange={(event) => { setSearch(event.target.value); setPage(0); }}
                placeholder="Cari RMA, order, customer…"
                className="h-9 w-full rounded-xl border border-line bg-white pr-3 pl-8.5 text-[12px] text-ink placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="px-5 pb-3">
          <Tabs
            items={tabItems.map((item) => ({ ...item, count: counts[item.value] ?? 0 }))}
            value={tab}
            onChange={(value) => { setTab(value); setPage(0); }}
          />
        </div>
        <DataTable
          rows={filteredReturns}
          columns={columns}
          getRowKey={(row) => row.id}
          search={(row) => `${row.rmaNumber} ${row.order?.orderNumber} ${row.customer.name} ${row.lines[0]?.item.sku} ${row.lines[0]?.item.name}`}
          searchPlaceholder="Cari RMA, order, customer…"
          filters={[
            {
              key: 'grade',
              label: 'Semua grade',
              options: ['A', 'B', 'C', 'DAMAGED'],
              match: (row, value) => row.grade === value,
            },
          ]}
          rowHref={(row) => `/returns/${row.id}`}
          pageSize={pageSize}
          minWidth={980}
        />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Alasan retur terbanyak" subtitle="30 hari terakhir" />
          <PanelBody className="space-y-3 pt-0">
            {[
              { label: 'Tidak sesuai deskripsi', value: 34 },
              { label: 'Kemasan rusak saat kirim', value: 26 },
              { label: 'Salah item / varian', value: 18 },
              { label: 'Kedaluwarsa dekat', value: 12 },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between text-[10.5px]">
                  <span className="text-ink-soft">{item.label}</span>
                  <span className="font-semibold text-ink tabular-nums">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ec]">
                  <div className="h-full rounded-full bg-[#16a34a]" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Deteksi fraud retur" subtitle="Serial & kondisi tidak cocok" action={<Badge tone="warning">1 flag</Badge>} />
          <PanelBody className="pt-0">
            <div className="rounded-xl border border-[#f6e3bd] bg-[#fef9ee] p-3">
              <p className="text-[11px] font-semibold text-[#7a4d05]">RMA-2026-0043</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-[#96600a]">
                Serial produk tidak cocok dengan order asal. Barang ditahan di area karantina untuk investigasi.
              </p>
              <button className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'mt-2' })}>
                Tinjau kasus
              </button>
            </div>
          </PanelBody>
          <PanelFooter>
            <span>Foto bukti wajib</span>
            <Link href="/audit" className="font-medium text-[#12703f] hover:underline">
              Audit
            </Link>
          </PanelFooter>
        </Panel>
      </div>
    </div>
  )
}