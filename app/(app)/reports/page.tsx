import Link from 'next/link'
import {
  ArrowUpRight,
  BarChart3,
  Boxes,
  CalendarClock,
  Clock,
  Download,
  Gauge,
  Layers,
  PackageOpen,
  ScrollText,
  Target,
  Truck,
  Undo2,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge } from '@/components/ui-kit/badge'
import { buttonStyles } from '@/components/ui-kit/button'
import { TrendChart } from '@/components/charts/trend-chart'
import { reports, weeklyTrend } from '@/lib/data'

const iconMap = {
  boxes: Boxes,
  scroll: ScrollText,
  clock: Clock,
  inbound: PackageOpen,
  truck: Truck,
  target: Target,
  gauge: Gauge,
  layers: Layers,
  undo: Undo2,
}

export default function ReportsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Laporan & Analitik"
        description="Laporan operasional, akurasi, kapasitas, dan produktivitas — siap diekspor dan dijadwalkan."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <CalendarClock className="size-3.5" />
              Jadwalkan laporan
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Download className="size-3.5" />
              Ekspor
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Laporan tersedia" value="9" hint="inbound → kapasitas" icon={<BarChart3 className="size-4" />} />
        <StatCard label="Terjadwal" value="4" hint="email mingguan" icon={<CalendarClock className="size-4" />} tone="blue" />
        <StatCard label="Ekspor bulan ini" value="128" delta="18%" hint="CSV & PDF" icon={<Download className="size-4" />} tone="violet" />
        <StatCard label="Data terakhir" value="Real-time" hint="sync 2 mnt lalu" icon={<Clock className="size-4" />} tone="amber" />
      </div>

      <Panel>
        <PanelHeader
          title="Tren throughput 7 hari"
          subtitle="Inbound vs outbound · semua channel"
          action={
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-[10.5px] text-faint sm:flex">
                <span className="size-2 rounded-full bg-[#4ade80]" />
                Inbound
              </span>
              <span className="hidden items-center gap-1.5 text-[10.5px] text-faint sm:flex">
                <span className="size-2 rounded-full bg-brand" />
                Outbound
              </span>
              <Badge tone="mint">+8,4%</Badge>
            </div>
          }
        />
        <PanelBody className="pt-0">
          <TrendChart data={weeklyTrend} height={240} />
        </PanelBody>
        <PanelFooter>
          <span>Total 7 hari: 14.160 inbound · 13.780 outbound</span>
          <span>Diperbarui 2 menit lalu</span>
        </PanelFooter>
      </Panel>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => {
          const Icon = iconMap[report.icon as keyof typeof iconMap] ?? BarChart3
          return (
            <article
              key={report.title}
              className="group flex flex-col rounded-2xl border border-line bg-white p-4 transition-colors hover:border-line-strong"
            >
              <div className="flex items-start justify-between">
                <span className="grid size-9 place-items-center rounded-xl bg-mint text-[#12703f]">
                  <Icon className="size-4" />
                </span>
                <Badge tone="neutral">{report.category}</Badge>
              </div>
              <h3 className="mt-3 text-[12.5px] font-semibold text-ink">{report.title}</h3>
              <p className="mt-1 flex-1 text-[10.5px] leading-relaxed text-faint">{report.description}</p>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5">
                <span className="text-[9.5px] text-faint">{report.updated}</span>
                <span className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold text-[#12703f]">
                  Buka
                  <ArrowUpRight className="size-3" />
                </span>
              </div>
            </article>
          )
        })}
      </div>

      <Panel>
        <PanelHeader title="KPI utama vs target" subtitle="Bulan berjalan · 22 November 2026" action={<Badge tone="success">4 dari 4 tercapai</Badge>} />
        <PanelBody className="grid grid-cols-1 gap-3 pt-0 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Inventory record accuracy', value: '99,2%', target: '≥ 98,5%', pct: 99 },
            { label: 'Order accuracy', value: '99,6%', target: '≥ 99,5%', pct: 99 },
            { label: 'Dock-to-stock time', value: '4j 12m', target: '≤ 8 jam', pct: 88 },
            { label: 'On-time shipping', value: '97,4%', target: '≥ 97%', pct: 97 },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-xl border border-line p-3">
              <p className="text-[9.5px] text-faint">{kpi.label}</p>
              <p className="mt-0.5 text-[18px] font-semibold text-ink tabular-nums">{kpi.value}</p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ec]">
                <div className="h-full rounded-full bg-[#16a34a]" style={{ width: `${kpi.pct}%` }} />
              </div>
              <p className="mt-1 text-[9px] text-faint">Target {kpi.target}</p>
            </div>
          ))}
        </PanelBody>
        <PanelFooter>
          <span>KPI dihitung otomatis dari ledger & task</span>
          <Link href="/settings" className="font-medium text-[#12703f] hover:underline">
            Atur target
          </Link>
        </PanelFooter>
      </Panel>
    </div>
  )
}
