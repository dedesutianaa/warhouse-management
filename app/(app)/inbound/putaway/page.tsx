'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  MapPin,
  Printer,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Timer,
  Warehouse,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { putawayTasks } from '@/lib/data'
import { formatNumber } from '@/lib/format'

type PutawayTask = (typeof putawayTasks)[number]

export default function PutawayPage() {
  const columns: Column<PutawayTask>[] = [
    {
      key: 'lpn',
      header: 'LPN',
      sortValue: (row) => row.lpn,
      render: (row) => (
        <div>
          <p className="font-mono text-[11px] font-semibold text-ink">{row.lpn}</p>
          <p className="text-[10px] text-faint">{row.from}</p>
        </div>
      ),
    },
    {
      key: 'item',
      header: 'Item',
      sortValue: (row) => row.name,
      render: (row) => (
        <div>
          <p className="text-[11.5px] font-medium text-ink">{row.name}</p>
          <p className="font-mono text-[10px] text-faint">{row.sku}</p>
        </div>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      sortValue: (row) => row.qty,
      render: (row) => <span className="text-[11px] font-medium text-ink tabular-nums">{formatNumber(row.qty)}</span>,
    },
    {
      key: 'suggested',
      header: 'Saran lokasi',
      render: (row) => (
        <span className="inline-flex items-center gap-1 rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-[#12703f]">
          <MapPin className="size-3" />
          {row.suggested}
        </span>
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
      key: 'assignee',
      header: 'Assignee',
      render: (row) => (
        <span className={row.assignee === 'Belum ditugaskan' ? 'text-[10.5px] text-faint italic' : 'text-[10.5px] text-ink-soft'}>
          {row.assignee}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inbound', 'Putaway']}
        title="Putaway Terarah"
        description="Sistem menyarankan lokasi berdasarkan zona, kapasitas, suhu, konsolidasi, dan FEFO."
        actions={
          <>
            <Link href="/inbound" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Inbound
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Printer className="size-3.5" />
              Cetak label LPN
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <ScanLine className="size-3.5" />
              Mulai putaway
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Task putaway" value="6" hint="4 LPN menunggu" icon={<Warehouse className="size-4" />} />
        <StatCard label="Override hari ini" value="2" hint="semua beralasan" icon={<ShieldCheck className="size-4" />} tone="amber" />
        <StatCard label="Rata-rata waktu" value="6m 12s" delta="18%" hint="vs minggu lalu" icon={<Timer className="size-4" />} tone="blue" />
        <StatCard label="Akurasi lokasi" value="99,6%" hint="scan cocok" icon={<Check className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Antrean putaway"
            subtitle="Diurutkan berdasarkan prioritas dan kedekatan rute"
            action={<Badge tone="mint">6 task</Badge>}
          />
          <DataTable
            rows={putawayTasks}
            columns={columns}
            getRowKey={(row) => row.lpn}
            search={(row) => `${row.lpn} ${row.sku} ${row.name} ${row.suggested} ${row.assignee}`}
            searchPlaceholder="Cari LPN, SKU, lokasi…"
            filters={[
              {
                key: 'priority',
                label: 'Semua prioritas',
                options: ['Tinggi', 'Normal', 'Rendah'],
                match: (row, value) => row.priority === value,
              },
            ]}
            pageSize={6}
            minWidth={720}
          />
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader
              title="Guided putaway"
              subtitle="Scan LPN lalu ikuti lokasi saran"
              action={<Badge tone="brand">RF</Badge>}
            />
            <PanelBody className="space-y-3 pt-0">
              <div className="rounded-xl border border-line bg-[#fafcf9] p-3">
                <p className="text-[9.5px] font-medium tracking-[0.1em] text-faint uppercase">LPN aktif</p>
                <p className="mt-0.5 font-mono text-[13px] font-semibold text-ink">LPN-88214</p>
                <p className="mt-0.5 text-[10px] text-faint">Kopi Arabika Gayo 250g · 240 pcs</p>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#0b3a2c] to-[#14563c] p-3.5 text-white">
                <div className="pointer-events-none absolute -top-6 -right-4 size-20 rounded-full bg-[#4ade80]/20 blur-xl" />
                <div className="relative">
                  <p className="text-[9.5px] tracking-[0.12em] text-white/55 uppercase">Lokasi disarankan</p>
                  <p className="mt-1 font-mono text-[24px] leading-none font-semibold tracking-tight">A-01-02-03</p>
                  <p className="mt-1.5 text-[10px] text-white/60">Zona A · Pick face · Rak 01 · Level 02</p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9.5px] ring-1 ring-white/15">
                      Kapasitas 82%
                    </span>
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9.5px] ring-1 ring-white/15">
                      Single-lot
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <ScanLine className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#8a988f]" />
                <input
                  placeholder="Scan lokasi untuk konfirmasi…"
                  aria-label="Scan lokasi"
                  className="h-10 w-full rounded-xl border border-line bg-white pr-3 pl-9 font-mono text-[11.5px] text-ink placeholder:font-sans placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
                />
              </div>

              <ul className="space-y-1.5">
                {['Zona & suhu kompatibel', 'Kapasitas mencukupi', 'Konsolidasi lot sesuai', 'Tidak ada hold aktif'].map(
                  (rule) => (
                    <li key={rule} className="flex items-center gap-2 text-[10.5px] text-ink-soft">
                      <span className="grid size-4 place-items-center rounded-full bg-mint text-[#12703f]">
                        <Check className="size-2.5" />
                      </span>
                      {rule}
                    </li>
                  ),
                )}
              </ul>

              <div className="flex gap-2">
                <button className={buttonStyles({ variant: 'primary', className: 'flex-1' })}>Konfirmasi</button>
                <button className={buttonStyles({ variant: 'secondary' })}>Override</button>
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Kapasitas zona" subtitle="Ruang tersisa untuk putaway" icon={<Sparkles className="size-3.5 text-[#16a34a]" />} />
            <PanelBody className="space-y-3 pt-0">
              {[
                { zone: 'Zona A · Fast moving', pct: 82 },
                { zone: 'Zona B · Ambient', pct: 74 },
                { zone: 'Zona C · Cool room', pct: 68 },
                { zone: 'Zona D · Bulk', pct: 61 },
              ].map((zone) => (
                <div key={zone.zone}>
                  <div className="mb-1 flex items-center justify-between text-[10.5px]">
                    <span className="text-ink-soft">{zone.zone}</span>
                    <span className="font-semibold text-ink tabular-nums">{zone.pct}%</span>
                  </div>
                  <Progress value={zone.pct} tone={zone.pct >= 80 ? 'amber' : 'green'} />
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Aturan: zona → kapasitas → FEFO</span>
              <Link href="/master/locations" className="font-medium text-[#12703f] hover:underline">
                Lihat lokasi
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>
    </div>
  )
}
