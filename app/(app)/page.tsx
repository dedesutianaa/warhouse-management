import Link from 'next/link'
import {
  ArrowRight,
  Boxes,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  Download,
  PackageOpen,
  ScanLine,
  ShieldCheck,
  Timer,
  Truck,
  Users,
  Warehouse,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { buttonStyles } from '@/components/ui-kit/button'
import { ThroughputChart } from '@/components/charts/throughput-chart'
import { CapacityDonut } from '@/components/charts/capacity-donut'
import { MiniSpark } from '@/components/charts/mini-spark'
import {
  activity,
  capacityZones,
  lowStock,
  orders,
  slaRisks,
  throughput,
} from '@/lib/data'
import { formatIDR, formatNumber } from '@/lib/format'

const toneStyles = {
  success: 'bg-[#e8f5ec] text-[#12703f]',
  info: 'bg-[#eaf2fe] text-[#1d4ed8]',
  warning: 'bg-[#fef6e7] text-[#96600a]',
  danger: 'bg-[#fdecec] text-[#b42318]',
  neutral: 'bg-[#f2f5f1] text-[#5b6b61]',
}

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Ringkasan operasi Gudang Cikarang · Shift 1 · Sabtu, 22 November 2026"
        actions={
          <>
            <span className="hidden h-9 items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-[11.5px] font-medium text-ink-soft sm:flex">
              <CalendarDays className="size-3.5 text-[#8a988f]" />
              Hari ini
            </span>
            <Link href="/reports" className={buttonStyles({ variant: 'secondary' })}>
              <Download className="size-3.5" />
              Ekspor
            </Link>
            <Link href="/outbound/packing" className={buttonStyles({ variant: 'primary' })}>
              <ScanLine className="size-3.5" />
              Mulai scan
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        <section className="relative col-span-12 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3a2c] via-[#0f4634] to-[#14563c] p-4 text-white xl:col-span-3">
          <div className="pointer-events-none absolute -top-10 -right-8 size-32 rounded-full bg-[#4ade80]/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-6 size-28 rounded-full bg-[#4ade80]/10 blur-xl" />
          <div className="relative flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] font-medium tracking-[0.14em] text-white/50 uppercase">
                Ringkasan hari ini
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-medium text-white/80 ring-1 ring-white/15">
                <span className="size-1 rounded-full bg-[#4ade80]" />
                Live
              </span>
            </div>
            <p className="mt-3.5 text-[10.5px] text-white/55">Paket diproses</p>
            <p className="mt-0.5 text-[30px] leading-none font-semibold tracking-tight tabular-nums">
              1.284
            </p>
            <p className="mt-1 text-[10px] text-white/50">dari target 1.650 paket · 78%</p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-[78%] rounded-full bg-[#7ee2a0]" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white/8 p-2 ring-1 ring-white/10">
                <p className="text-[9px] text-white/50">On-time</p>
                <p className="mt-0.5 text-[13px] font-semibold tabular-nums">97,4%</p>
              </div>
              <div className="rounded-xl bg-white/8 p-2 ring-1 ring-white/10">
                <p className="text-[9px] text-white/50">Akurasi stok</p>
                <p className="mt-0.5 text-[13px] font-semibold tabular-nums">99,2%</p>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {[
                { label: 'Allocated', value: 86, pct: 34 },
                { label: 'Picking', value: 214, pct: 78 },
                { label: 'Packing', value: 96, pct: 52 },
              ].map((stage) => (
                <div key={stage.label} className="flex items-center gap-2">
                  <span className="w-14 text-[9.5px] text-white/55">{stage.label}</span>
                  <span className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
                    <span
                      className="block h-full rounded-full bg-[#7ee2a0]"
                      style={{ width: `${stage.pct}%` }}
                    />
                  </span>
                  <span className="w-6 text-right text-[9.5px] font-medium text-white/75 tabular-nums">
                    {stage.value}
                  </span>
                </div>
              ))}
            </div>
            <Link
              href="/tasks"
              className="mt-auto flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#d9f5e2] pt-0 text-[11px] font-semibold text-[#0b3a2c] transition-colors hover:bg-white"
            >
              Buka task board
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </section>

        <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-3 md:col-span-6 xl:col-span-6">
          <StatCard
            label="Order masuk"
            value="1.284"
            delta="12,4%"
            hint="vs kemarin"
            icon={<PackageOpen className="size-4" />}
            tone="mint"
            spark={<MiniSpark data={[820, 940, 880, 1020, 1140, 1080, 1284]} />}
          />
          <StatCard
            label="Siap kirim"
            value="342"
            delta="48"
            deltaTone="flat"
            hint="menunggu pickup"
            icon={<Truck className="size-4" />}
            tone="blue"
            spark={<MiniSpark data={[180, 220, 260, 240, 300, 320, 342]} color="#2563eb" />}
          />
          <StatCard
            label="Akurasi stok"
            value="99,2%"
            delta="0,6%"
            hint="30 hari terakhir"
            icon={<ShieldCheck className="size-4" />}
            tone="violet"
            spark={<MiniSpark data={[98.4, 98.6, 98.9, 99.0, 99.1, 99.2, 99.2]} color="#7c3aed" />}
          />
        </div>

        <Panel className="col-span-12 md:col-span-6 xl:col-span-3">
          <PanelHeader
            title="Kapasitas gudang"
            subtitle="1.004 dari 1.400 bin terpakai"
            action={<Badge tone="mint">76%</Badge>}
          />
          <PanelBody className="pt-1">
            <CapacityDonut
              segments={capacityZones}
              centerValue="76%"
              centerLabel="Okupansi"
              size={150}
            />
          </PanelBody>
        </Panel>

        <Panel className="col-span-12 xl:col-span-8">
          <PanelHeader
            title="Throughput per jam"
            subtitle="Inbound vs outbound · 22 November 2026"
            action={
              <div className="flex items-center gap-3">
                <span className="hidden items-center gap-1.5 text-[10.5px] text-faint sm:flex">
                  <span className="size-2 rounded-full bg-[#c9e9d4]" />
                  Inbound
                </span>
                <span className="hidden items-center gap-1.5 text-[10.5px] text-faint sm:flex">
                  <span className="size-2 rounded-full bg-brand" />
                  Outbound
                </span>
                <Link
                  href="/reports"
                  className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-[#12703f] hover:underline"
                >
                  Laporan
                  <ChevronRight className="size-3" />
                </Link>
              </div>
            }
          />
          <PanelBody className="pt-0">
            <ThroughputChart data={throughput} height={286} />
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3">
              <div>
                <p className="text-[9.5px] text-faint">Total inbound</p>
                <p className="text-[13px] font-semibold text-ink tabular-nums">1.326 pcs</p>
              </div>
              <div>
                <p className="text-[9.5px] text-faint">Total outbound</p>
                <p className="text-[13px] font-semibold text-ink tabular-nums">1.710 pcs</p>
              </div>
              <div>
                <p className="text-[9.5px] text-faint">Jam tersibuk</p>
                <p className="text-[13px] font-semibold text-ink tabular-nums">14:00 · 232</p>
              </div>
            </div>
          </PanelBody>
        </Panel>

        <Panel className="col-span-12 xl:col-span-4">
          <PanelHeader
            title="SLA berisiko"
            subtitle="Menuju cut-off kurir terdekat"
            action={<Badge tone="danger" dot>4 order</Badge>}
          />
          <PanelBody className="space-y-2 pt-0">
            {slaRisks.map((risk) => (
              <Link
                key={risk.id}
                href={`/outbound/${risk.id}`}
                className="flex items-center gap-2.5 rounded-xl border border-line px-2.5 py-2 transition-colors hover:border-line-strong hover:bg-[#fafcf9]"
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-lg ${
                    risk.tone === 'danger'
                      ? 'bg-[#fdecec] text-[#b42318]'
                      : risk.tone === 'warning'
                        ? 'bg-[#fef6e7] text-[#96600a]'
                        : 'bg-[#f2f5f1] text-[#5b6b61]'
                  }`}
                >
                  <Timer className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11.5px] font-semibold text-ink">{risk.id}</p>
                  <p className="truncate text-[10px] text-faint">
                    {risk.customer} · {risk.carrier}
                  </p>
                </div>
                <div className="text-right">
                  <StatusBadge status={risk.stage} />
                  <p
                    className={`mt-1 text-[10px] font-semibold tabular-nums ${
                      risk.tone === 'danger' ? 'text-[#b42318]' : 'text-ink-soft'
                    }`}
                  >
                    {risk.left}
                  </p>
                </div>
              </Link>
            ))}
          </PanelBody>
          <PanelFooter>
            <span>Eskalasi otomatis 60 menit sebelum cut-off</span>
            <Link href="/outbound" className="font-medium text-[#12703f] hover:underline">
              Buka outbound
            </Link>
          </PanelFooter>
        </Panel>

        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Order terbaru"
            subtitle="Aliran order dari semua channel"
            action={
              <Link
                href="/outbound"
                className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-[#12703f] hover:underline"
              >
                Lihat semua
                <ChevronRight className="size-3" />
              </Link>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['Order', 'Channel', 'Kurir', 'Nilai', 'Status', 'SLA'].map((head) => (
                    <th
                      key={head}
                      className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((order) => (
                  <tr key={order.id} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                    <td className="px-4 py-2.5">
                      <Link href={`/outbound/${order.id}`} className="block">
                        <span className="block text-[11.5px] font-semibold text-ink">{order.id}</span>
                        <span className="block text-[10px] text-faint">
                          {order.customer} · {order.city}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-ink-soft">{order.channel}</td>
                    <td className="px-4 py-2.5 text-[11px] text-ink-soft">{order.carrier}</td>
                    <td className="px-4 py-2.5 text-[11px] font-medium text-ink tabular-nums">
                      {formatIDR(order.value, true)}
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-ink-soft tabular-nums">{order.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader
              title="Aktivitas terbaru"
              subtitle="Audit trail operasional"
              action={<Badge tone="neutral">Live</Badge>}
            />
            <PanelBody className="pt-0">
              <ol className="relative space-y-3 before:absolute before:top-1 before:bottom-1 before:left-[13px] before:w-px before:bg-line">
                {activity.slice(0, 5).map((item) => (
                  <li key={item.id} className="relative flex gap-2.5">
                    <span
                      className={`relative z-10 grid size-7 shrink-0 place-items-center rounded-full ring-4 ring-white ${toneStyles[item.tone]}`}
                    >
                      <span className="size-1.5 rounded-full bg-current" />
                    </span>
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-[11px] leading-snug text-ink-soft">
                        <span className="font-semibold text-ink">{item.actor}</span> {item.action}
                      </p>
                      <p className="truncate text-[10px] text-faint">{item.target}</p>
                    </div>
                    <span className="shrink-0 pt-0.5 text-[9.5px] text-[#a3afa7]">{item.time}</span>
                  </li>
                ))}
              </ol>
            </PanelBody>
            <PanelFooter>
              <span>6 event terakhir</span>
              <Link href="/audit" className="font-medium text-[#12703f] hover:underline">
                Audit trail
              </Link>
            </PanelFooter>
          </Panel>

          <Panel>
            <PanelHeader
              title="Stok menipis"
              subtitle="Di bawah minimum pick face"
              action={<Badge tone="warning">4 SKU</Badge>}
            />
            <PanelBody className="space-y-3 pt-0">
              {lowStock.map((item) => (
                <div key={item.sku}>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <p className="truncate text-[11px] font-medium text-ink">{item.name}</p>
                    <span className="shrink-0 text-[10px] text-faint tabular-nums">
                      {item.available}/{item.min}
                    </span>
                  </div>
                  <Progress value={(item.available / item.min) * 100} tone="amber" />
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Replenishment disarankan</span>
              <Link href="/inventory/replenishment" className="font-medium text-[#12703f] hover:underline">
                Buat task
              </Link>
            </PanelFooter>
          </Panel>
        </div>

        <div className="col-span-12 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-white p-3 sm:grid-cols-4">
          {[
            { icon: ClipboardList, label: 'Task terbuka', value: '18', hint: '3 terlambat' },
            { icon: Users, label: 'Operator aktif', value: '24', hint: 'Shift 1' },
            { icon: Warehouse, label: 'Dock terpakai', value: '3/4', hint: '1 tersedia' },
            { icon: Boxes, label: 'LPN aktif', value: '1.842', hint: 'Pallet & tote' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 rounded-xl px-2 py-1.5">
              <span className="grid size-8 place-items-center rounded-lg bg-panel text-[#5b6b61]">
                <item.icon className="size-4" />
              </span>
              <div>
                <p className="text-[10px] text-faint">{item.label}</p>
                <p className="text-[14px] leading-tight font-semibold text-ink tabular-nums">
                  {item.value}
                  <span className="ml-1.5 text-[9.5px] font-normal text-faint">{item.hint}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
