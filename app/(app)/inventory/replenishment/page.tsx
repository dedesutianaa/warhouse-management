'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Boxes, Plus, RefreshCw, Timer, Zap } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { replenishment } from '@/lib/data'

type ReplenishRow = (typeof replenishment)[number]

export default function ReplenishmentPage() {
  const columns: Column<ReplenishRow>[] = [
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
      key: 'pickFace',
      header: 'Pick face',
      render: (row) => (
        <span className="rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#12703f]">
          {row.pickFace}
        </span>
      ),
    },
    {
      key: 'level',
      header: 'Stok / Min / Max',
      sortValue: (row) => row.current,
      render: (row) => (
        <div className="w-32">
          <div className="mb-1 flex items-baseline justify-between text-[10px]">
            <span className="font-semibold text-ink tabular-nums">{row.current}</span>
            <span className="text-faint tabular-nums">
              {row.min} / {row.max}
            </span>
          </div>
          <Progress
            value={(row.current / row.max) * 100}
            tone={row.current <= row.min ? 'rose' : 'green'}
            className="h-1"
          />
        </div>
      ),
    },
    {
      key: 'suggest',
      header: 'Saran qty',
      sortValue: (row) => row.suggest,
      render: (row) => (
        <span className="text-[11px] font-semibold text-[#12703f] tabular-nums">+{row.suggest}</span>
      ),
    },
    {
      key: 'priority',
      header: 'Prioritas',
      render: (row) => (
        <Badge tone={row.priority === 'Tinggi' ? 'danger' : row.priority === 'Normal' ? 'info' : 'neutral'} dot>
          {row.priority}
        </Badge>
      ),
    },
    {
      key: 'action',
      header: '',
      render: () => (
        <button className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
          <Plus className="size-3" />
          Task
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inventori', 'Replenishment']}
        title="Replenishment"
        description="Isi ulang pick face dari lokasi reserve berdasarkan min/max dan prioritas wave."
        actions={
          <>
            <Link href="/inventory" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Inventori
            </Link>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Zap className="size-3.5" />
              Buat task massal
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="SKU di bawah min" value="6" hint="pick face" icon={<Boxes className="size-4" />} tone="amber" />
        <StatCard label="Task dibuat" value="4" hint="hari ini" icon={<RefreshCw className="size-4" />} />
        <StatCard label="Pick face kosong" value="1" hint="SKU-1042" icon={<Zap className="size-4" />} tone="rose" />
        <StatCard label="Waktu replenish" value="6m 12s" delta="14%" hint="vs minggu lalu" icon={<Timer className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Kebutuhan replenishment"
            subtitle="Dihitung dari min/max dan permintaan wave"
            action={<Badge tone="warning">6 SKU</Badge>}
          />
          <DataTable
            rows={replenishment}
            columns={columns}
            getRowKey={(row) => row.sku}
            search={(row) => `${row.sku} ${row.name} ${row.pickFace}`}
            searchPlaceholder="Cari SKU atau lokasi…"
            filters={[
              {
                key: 'priority',
                label: 'Semua prioritas',
                options: ['Tinggi', 'Normal', 'Rendah'],
                match: (row, value) => row.priority === value,
              },
            ]}
            pageSize={6}
            minWidth={700}
          />
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Aturan min/max" subtitle="Per item & kategori" />
            <PanelBody className="space-y-2 pt-0">
              {[
                { label: 'Fast moving (A)', min: '60', max: '240', tone: 'success' as const },
                { label: 'Medium (B)', min: '48', max: '180', tone: 'info' as const },
                { label: 'Slow moving (C)', min: '24', max: '96', tone: 'neutral' as const },
              ].map((rule) => (
                <div key={rule.label} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-2">
                  <span className="text-[10.5px] text-ink-soft">{rule.label}</span>
                  <span className="text-[10px] text-faint tabular-nums">
                    min {rule.min} · max {rule.max}
                  </span>
                </div>
              ))}
              <p className="text-[9.5px] leading-relaxed text-faint">
                Task otomatis dibuat saat stok pick face menyentuh batas minimum.
              </p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Kapasitas pick face" subtitle="Zona A · 4 lokasi" />
            <PanelBody className="space-y-3 pt-0">
              {[
                { loc: 'A-01-02-03', pct: 82 },
                { loc: 'A-02-01-01', pct: 100 },
                { loc: 'A-03-02-01', pct: 48 },
                { loc: 'A-01-04-02', pct: 35 },
              ].map((item) => (
                <div key={item.loc}>
                  <div className="mb-1 flex items-center justify-between text-[10px]">
                    <span className="font-mono text-ink-soft">{item.loc}</span>
                    <span className="font-semibold text-ink tabular-nums">{item.pct}%</span>
                  </div>
                  <Progress value={item.pct} tone={item.pct >= 95 ? 'amber' : 'green'} />
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Reserve → pick face</span>
              <Link href="/tasks" className="font-medium text-[#12703f] hover:underline">
                Task board
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHeader title="Task replenishment aktif" subtitle="Ditugaskan ke operator zona" />
        <PanelBody className="grid grid-cols-1 gap-2.5 pt-0 sm:grid-cols-3">
          {[
            { id: 'TSK-88216', item: 'Kopi Arabika Gayo 250g', qty: 216, assignee: 'Doni Setiawan', status: 'Tersedia' },
            { id: 'TSK-88230', item: 'Teh Hijau Melati 20 Bag', qty: 144, assignee: 'Sari Wulandari', status: 'Berjalan' },
            { id: 'TSK-88231', item: 'Biskuit Cokelat 120g', qty: 180, assignee: 'Belum ditugaskan', status: 'Tersedia' },
          ].map((task) => (
            <div key={task.id} className="rounded-xl border border-line p-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold text-ink">{task.id}</span>
                <Badge tone={task.status === 'Berjalan' ? 'info' : 'neutral'} dot>
                  {task.status}
                </Badge>
              </div>
              <p className="mt-1.5 text-[11px] font-medium text-ink">{task.item}</p>
              <div className="mt-1 flex items-center justify-between text-[10px] text-faint">
                <span>+{task.qty} pcs</span>
                <span className="inline-flex items-center gap-1">
                  <ArrowRight className="size-3" />
                  {task.assignee}
                </span>
              </div>
            </div>
          ))}
        </PanelBody>
      </Panel>
    </div>
  )
}
