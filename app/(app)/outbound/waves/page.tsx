import Link from 'next/link'
import {
  ArrowLeft,
  CalendarClock,
  Check,
  Layers,
  Plus,
  Sparkles,
  Timer,
  Users,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { buttonStyles } from '@/components/ui-kit/button'
import { orders, waves } from '@/lib/data'

const pickers = [
  { name: 'Bayu Saputra', zone: 'Zona A', load: 78, lines: 186 },
  { name: 'Doni Setiawan', zone: 'Zona B', load: 64, lines: 164 },
  { name: 'Sari Wulandari', zone: 'Zona A', load: 42, lines: 142 },
  { name: 'Rina Marlina', zone: 'Zona C', load: 28, lines: 96 },
]

export default function WavesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Outbound', 'Wave']}
        title="Wave Planning"
        description="Kelompokkan order per kurir, cut-off, zona, dan prioritas lalu rilis ke lantai gudang."
        actions={
          <>
            <Link href="/outbound" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Outbound
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <CalendarClock className="size-3.5" />
              Jadwalkan
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Buat Wave
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Wave aktif" value="3" hint="2 picking · 1 released" icon={<Layers className="size-4" />} />
        <StatCard label="Order dalam wave" value="160" hint="dari 214 siap" icon={<Check className="size-4" />} tone="blue" />
        <StatCard label="Cut-off terdekat" value="11:30" hint="J&T · 48 order" icon={<Timer className="size-4" />} tone="amber" />
        <StatCard label="Pick productivity" value="186" unit="line/jam" delta="8,4%" hint="vs kemarin" icon={<Users className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 xl:col-span-8">
          <PanelHeader
            title="Wave hari ini"
            subtitle="Sabtu, 22 November 2026"
            action={<Badge tone="mint">5 wave</Badge>}
          />
          <PanelBody className="space-y-2.5 pt-0">
            {waves.map((wave) => (
              <div key={wave.id} className="rounded-xl border border-line p-3 transition-colors hover:border-line-strong">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-ink">{wave.id}</span>
                  <Badge tone="neutral">{wave.carrier}</Badge>
                  <StatusBadge status={wave.status} />
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] text-faint">
                    <Timer className="size-3" />
                    Cut-off {wave.cutoff}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-ink-soft">
                  <span>
                    <span className="font-semibold text-ink tabular-nums">{wave.orders}</span> order
                  </span>
                  <span>
                    <span className="font-semibold text-ink tabular-nums">{wave.lines}</span> line
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="size-3 text-[#8a988f]" />
                    {wave.picker}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={wave.progress} tone={wave.progress === 100 ? 'green' : 'dark'} />
                  <span className="w-8 text-right text-[10px] font-semibold text-ink tabular-nums">{wave.progress}%</span>
                </div>
              </div>
            ))}
          </PanelBody>
          <PanelFooter>
            <span>Total 178 order · 463 line</span>
            <Link href="/outbound/picking" className="font-medium text-[#12703f] hover:underline">
              Buka picking
            </Link>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader
              title="Rekomendasi wave"
              subtitle="Berdasarkan cut-off & zona"
              icon={<Sparkles className="size-3.5 text-[#16a34a]" />}
            />
            <PanelBody className="space-y-2 pt-0">
              {[
                { title: 'Gabungkan 18 order J&T', detail: 'Cut-off 11:30 · Zona A & B', gain: '−12% jarak' },
                { title: 'Pisahkan 6 order bulky', detail: 'Zona D · butuh pallet jack', gain: '−8 mnt' },
                { title: 'Prioritaskan 4 order Same Day', detail: 'Instant · cut-off 10:45', gain: 'SLA aman' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-line bg-[#fafcf9] p-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[11px] font-semibold text-ink">{item.title}</p>
                    <Badge tone="mint">{item.gain}</Badge>
                  </div>
                  <p className="mt-0.5 text-[10px] text-faint">{item.detail}</p>
                </div>
              ))}
              <button className={buttonStyles({ variant: 'primary', className: 'w-full' })}>
                Terapkan rekomendasi
              </button>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Beban picker" subtitle="Kapasitas per shift" />
            <PanelBody className="space-y-3 pt-0">
              {pickers.map((picker) => (
                <div key={picker.name}>
                  <div className="mb-1 flex items-center justify-between text-[10.5px]">
                    <span className="font-medium text-ink">{picker.name}</span>
                    <span className="text-faint tabular-nums">
                      {picker.zone} · {picker.lines} line
                    </span>
                  </div>
                  <Progress value={picker.load} tone={picker.load >= 75 ? 'amber' : 'green'} />
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Auto-assign: zona terdekat</span>
              <Link href="/labor" className="font-medium text-[#12703f] hover:underline">
                Tenaga kerja
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Order belum masuk wave"
          subtitle="Siap dialokasikan ke wave berikutnya"
          action={<Badge tone="warning">6 order</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-y border-line bg-[#fafbf9]">
                {['Order', 'Channel', 'Kurir', 'Zona', 'Cut-off', 'Prioritas'].map((head) => (
                  <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.slice(2, 8).map((order, index) => (
                <tr key={order.id} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                  <td className="px-4 py-2.5">
                    <p className="text-[11px] font-semibold text-ink">{order.id}</p>
                    <p className="text-[10px] text-faint">{order.customer}</p>
                  </td>
                  <td className="px-4 py-2.5 text-[10.5px] text-ink-soft">{order.channel}</td>
                  <td className="px-4 py-2.5 text-[10.5px] text-ink-soft">{order.carrier}</td>
                  <td className="px-4 py-2.5">
                    <span className="rounded-md bg-panel px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">
                      {['A', 'B', 'A', 'C', 'B', 'D'][index]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[10.5px] text-ink-soft tabular-nums">{order.sla}</td>
                  <td className="px-4 py-2.5">
                    <Badge tone={order.priority === 'Express' ? 'warning' : 'neutral'}>{order.priority}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
