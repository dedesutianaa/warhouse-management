import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  MapPin,
  Printer,
  Route,
  ScanLine,
  Timer,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { buttonStyles } from '@/components/ui-kit/button'
import { pickList } from '@/lib/data'

const putWall = [
  { tote: 'T-04', order: 'SO-2026-118402', items: 3, status: 'Siap sortir' },
  { tote: 'T-05', order: 'SO-2026-118398', items: 4, status: 'Sebagian' },
  { tote: 'T-06', order: 'SO-2026-118394', items: 6, status: 'Kosong' },
  { tote: 'T-07', order: 'SO-2026-118392', items: 4, status: 'Siap sortir' },
  { tote: 'T-08', order: 'SO-2026-118391', items: 2, status: 'Kosong' },
  { tote: 'T-09', order: 'SO-2026-118389', items: 1, status: 'Sebagian' },
]

export default function PickingPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Outbound', 'Picking']}
        title="Picking & Sortir"
        description="Rute teroptimasi, validasi scan lokasi dan item, serta penanganan short pick."
        actions={
          <>
            <Link href="/outbound/waves" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Wave
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Printer className="size-3.5" />
              Cetak pick list
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <ScanLine className="size-3.5" />
              Mulai picking
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Wave aktif" value="WAVE-1122-01" hint="J&T · 48 order" icon={<Route className="size-4" />} />
        <StatCard label="Line selesai" value="2/7" hint="5 line tersisa" icon={<Check className="size-4" />} tone="blue" />
        <StatCard label="Short pick" value="1" hint="SKU-4520 · lokasi kosong" icon={<AlertTriangle className="size-4" />} tone="amber" />
        <StatCard label="Akurasi pick" value="99,4%" delta="0,3%" hint="30 hari" icon={<ScanLine className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Pick list · WAVE-1122-01"
            subtitle="Rute dioptimasi berdasarkan koordinat lokasi"
            action={<Badge tone="mint">2/7 selesai</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['#', 'Lokasi', 'SKU / Item', 'Qty', 'Lot', 'Tote', 'Status'].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pickList.map((line) => {
                  const current = line.status === 'Berjalan'
                  return (
                    <tr
                      key={line.seq}
                      className={`border-b border-line/80 last:border-0 ${
                        current ? 'bg-[#f4fbf6]' : 'hover:bg-[#fafcf9]'
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={`grid size-6 place-items-center rounded-full text-[10px] font-semibold ${
                            line.status === 'Selesai'
                              ? 'bg-mint text-[#12703f]'
                              : current
                                ? 'bg-brand text-white'
                                : 'bg-panel text-[#8a988f]'
                          }`}
                        >
                          {line.status === 'Selesai' ? <Check className="size-3" /> : line.seq}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-[#12703f]">
                          <MapPin className="size-3" />
                          {line.location}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[11px] font-medium text-ink">{line.name}</p>
                        <p className="font-mono text-[10px] text-faint">{line.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-semibold text-ink tabular-nums">{line.qty}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-ink-soft">{line.lot}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">
                          {line.tote}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={line.status} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <PanelFooter>
            <span>Total 12 pcs · 3 tote</span>
            <span className="inline-flex items-center gap-1">
              <Timer className="size-3" />
              Estimasi 14 menit
            </span>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Rute picking" subtitle="Zona A → B → C · 186 m" action={<Badge tone="neutral">7 stop</Badge>} />
            <PanelBody className="pt-0">
              <ol className="relative space-y-3 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-px before:bg-line">
                {[
                  { loc: 'A-01-02-03', dist: '0 m', state: 'done' },
                  { loc: 'A-01-02-04', dist: '12 m', state: 'done' },
                  { loc: 'A-02-01-01', dist: '28 m', state: 'current' },
                  { loc: 'A-02-01-04', dist: '16 m', state: 'todo' },
                  { loc: 'B-01-03-02', dist: '42 m', state: 'todo' },
                  { loc: 'B-02-02-04', dist: '38 m', state: 'todo' },
                  { loc: 'C-01-01-02', dist: '50 m', state: 'todo' },
                ].map((stop) => (
                  <li key={stop.loc} className="relative flex items-center gap-2.5">
                    <span
                      className={`relative z-10 grid size-6 shrink-0 place-items-center rounded-full text-[9px] font-semibold ring-4 ring-white ${
                        stop.state === 'done'
                          ? 'bg-mint text-[#12703f]'
                          : stop.state === 'current'
                            ? 'bg-brand text-white'
                            : 'bg-panel text-[#8a988f]'
                      }`}
                    >
                      {stop.state === 'done' ? <Check className="size-3" /> : <MapPin className="size-3" />}
                    </span>
                    <span
                      className={`flex-1 font-mono text-[10.5px] ${
                        stop.state === 'current' ? 'font-semibold text-ink' : 'text-ink-soft'
                      }`}
                    >
                      {stop.loc}
                    </span>
                    <span className="text-[9.5px] text-faint">{stop.dist}</span>
                  </li>
                ))}
              </ol>
            </PanelBody>
          </Panel>

          <div className="rounded-2xl border border-[#f6e3bd] bg-[#fef9ee] p-3.5">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#96600a]" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-[#7a4d05]">Short pick terdeteksi</p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#96600a]">
                  SKU-4520 di A-02-01-04 hanya tersedia 0 dari 1 pcs. Sistem menawarkan lokasi alternatif dan
                  membuat task cycle count.
                </p>
                <div className="mt-2 flex gap-2">
                  <button className={buttonStyles({ variant: 'secondary', size: 'sm' })}>Lihat alternatif</button>
                  <button className={buttonStyles({ variant: 'primary', size: 'sm' })}>Laporkan</button>
                </div>
              </div>
            </div>
          </div>

          <Panel>
            <PanelHeader title="Put wall / sortir" subtitle="6 tote aktif" />
            <PanelBody className="grid grid-cols-3 gap-2 pt-0">
              {putWall.map((slot) => (
                <div
                  key={slot.tote}
                  className={`rounded-xl border p-2 ${
                    slot.status === 'Siap sortir'
                      ? 'border-[#cdebd8] bg-[#f4fbf6]'
                      : slot.status === 'Sebagian'
                        ? 'border-[#f6e3bd] bg-[#fef9ee]'
                        : 'border-line bg-[#fafcf9]'
                  }`}
                >
                  <p className="font-mono text-[10px] font-semibold text-ink">{slot.tote}</p>
                  <p className="mt-0.5 truncate text-[8.5px] text-faint">{slot.order.slice(-6)}</p>
                  <p className="mt-1 text-[9px] font-medium text-ink-soft">{slot.items} item</p>
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Scan tote untuk sortir</span>
              <Link href="/outbound/packing" className="font-medium text-[#12703f] hover:underline">
                Packing
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>
    </div>
  )
}
