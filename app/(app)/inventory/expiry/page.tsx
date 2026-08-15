'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowLeft, CalendarClock, Download, Megaphone, Timer } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { expiryItems } from '@/lib/data'

type ExpiryRow = (typeof expiryItems)[number]

export default function ExpiryPage() {
  const columns: Column<ExpiryRow>[] = [
    {
      key: 'item',
      header: 'SKU / Item',
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <p className="text-[11.5px] font-semibold text-ink">{row.name}</p>
          <p className="font-mono text-[10px] text-faint">{row.sku}</p>
        </div>
      ),
    },
    {
      key: 'lot',
      header: 'Lot',
      render: (row) => <span className="font-mono text-[10px] text-ink-soft">{row.lot}</span>,
    },
    {
      key: 'location',
      header: 'Lokasi',
      render: (row) => (
        <span className="rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#12703f]">
          {row.location}
        </span>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      sortValue: (row) => row.qty,
      render: (row) => <span className="text-[11px] font-medium text-ink tabular-nums">{row.qty}</span>,
    },
    {
      key: 'expiry',
      header: 'Kedaluwarsa',
      sortValue: (row) => row.daysLeft,
      render: (row) => (
        <div>
          <p className="text-[10.5px] text-ink-soft">{row.expiry}</p>
          <p className="text-[9.5px] text-faint">{row.daysLeft} hari lagi</p>
        </div>
      ),
    },
    {
      key: 'risk',
      header: 'Risiko',
      render: (row) => (
        <div className="w-24">
          <Progress
            value={Math.max(4, 100 - (row.daysLeft / 120) * 100)}
            tone={row.daysLeft <= 30 ? 'rose' : row.daysLeft <= 60 ? 'amber' : 'green'}
            className="h-1"
          />
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Saran tindakan',
      render: (row) => (
        <Badge tone={row.daysLeft <= 30 ? 'danger' : row.daysLeft <= 60 ? 'warning' : 'neutral'}>
          {row.action}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inventori', 'Kedaluwarsa']}
        title="Kedaluwarsa"
        description="Pantau lot mendekati kedaluwarsa, prioritaskan FEFO, dan cegah write-off."
        actions={
          <>
            <Link href="/inventory" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Inventori
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Download className="size-3.5" />
              Ekspor
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Megaphone className="size-3.5" />
              Kampanye promo
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="≤ 30 hari" value="3" unit="lot" hint="Rp 1,8 jt berisiko" icon={<AlertTriangle className="size-4" />} tone="rose" />
        <StatCard label="31–60 hari" value="1" unit="lot" hint="prioritaskan FEFO" icon={<Timer className="size-4" />} tone="amber" />
        <StatCard label="61–90 hari" value="2" unit="lot" hint="monitor channel" icon={<CalendarClock className="size-4" />} tone="blue" />
        <StatCard label="Write-off bulan ini" value="Rp 420 rb" delta="38%" deltaTone="down" hint="vs bulan lalu" icon={<Megaphone className="size-4" />} tone="violet" />
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Lot mendekati kedaluwarsa"
          subtitle="Diurutkan berdasarkan sisa hari"
          action={<Badge tone="warning">7 lot</Badge>}
        />
        <DataTable
          rows={expiryItems}
          columns={columns}
          getRowKey={(row) => `${row.sku}-${row.lot}`}
          search={(row) => `${row.sku} ${row.name} ${row.lot} ${row.location}`}
          searchPlaceholder="Cari SKU, lot, lokasi…"
          filters={[
            {
              key: 'bucket',
              label: 'Semua bucket',
              options: ['≤ 30 hari', '31–60 hari', '61–90 hari'],
              match: (row, value) =>
                value === '≤ 30 hari' ? row.daysLeft <= 30 : value === '31–60 hari' ? row.daysLeft > 30 && row.daysLeft <= 60 : row.daysLeft > 60,
            },
          ]}
          pageSize={7}
          minWidth={900}
        />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Aturan minimum sisa shelf life" subtitle="Per customer / channel saat pengiriman" />
          <PanelBody className="space-y-2 pt-0">
            {[
              { name: 'PT Sinar Retail · Shopee', value: '70% sisa shelf life', tone: 'success' as const },
              { name: 'CV Toko Sehat Sentosa · Website', value: '80% sisa shelf life', tone: 'warning' as const },
              { name: 'PT Kosmetika Prima · Semua channel', value: '75% sisa shelf life', tone: 'info' as const },
            ].map((rule) => (
              <div key={rule.name} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                <span className="text-[10.5px] text-ink-soft">{rule.name}</span>
                <Badge tone={rule.tone}>{rule.value}</Badge>
              </div>
            ))}
          </PanelBody>
          <PanelFooter>
            <span>Lot di bawah ambang otomatis Hold saat receiving</span>
            <Link href="/settings" className="font-medium text-[#12703f] hover:underline">
              Ubah aturan
            </Link>
          </PanelFooter>
        </Panel>

        <Panel>
          <PanelHeader title="Aksi cepat" subtitle="Kurangi risiko write-off" />
          <PanelBody className="space-y-2 pt-0">
            <button className={buttonStyles({ variant: 'primary', className: 'w-full justify-start' })}>
              <Megaphone className="size-3.5" />
              Buat kampanye diskon
            </button>
            <button className={buttonStyles({ variant: 'secondary', className: 'w-full justify-start' })}>
              <Timer className="size-3.5" />
              Prioritaskan FEFO di wave
            </button>
            <button className={buttonStyles({ variant: 'secondary', className: 'w-full justify-start' })}>
              <ArrowLeft className="size-3.5" />
              Ajukan retur ke vendor
            </button>
            <p className="pt-1 text-[9.5px] leading-relaxed text-faint">
              Tindakan tercatat di audit trail dan memengaruhi alokasi otomatis.
            </p>
          </PanelBody>
        </Panel>
      </div>
    </div>
  )
}
