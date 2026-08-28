import Link from 'next/link'
import {
  ArrowUpRight,
  Boxes,
  Building2,
  ChevronDown,
  Download,
  FileText,
  LogOut,
  PackageCheck,
  ShieldCheck,
  Truck,
  Warehouse,
} from 'lucide-react'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Progress } from '@/components/ui-kit/progress'
import { Avatar } from '@/components/ui-kit/avatar'
import { buttonStyles } from '@/components/ui-kit/button'
import { orders, portalStock, portalSummary } from '@/lib/data'
import { formatIDR, formatNumber } from '@/lib/format'

export default function PortalPage() {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex h-15 max-w-[1280px] items-center gap-4 px-4 lg:px-6">
          <Link href="/portal" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-brand text-white">
              <Warehouse className="size-4" />
            </span>
            <span className="leading-none">
              <span className="block text-[13px] font-semibold tracking-[0.02em] text-ink">GUDANGKU</span>
              <span className="mt-0.5 block text-[8.5px] font-medium tracking-[0.16em] text-[#9aa79f] uppercase">
                Client Portal
              </span>
            </span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {['Ringkasan', 'Stok', 'Order', 'Tagihan', 'Dokumen'].map((item, index) => (
              <span
                key={item}
                className={`rounded-lg px-2.5 py-1.5 text-[11px] font-medium ${
                  index === 0 ? 'bg-mint text-brand' : 'text-[#5b6b61]'
                }`}
              >
                {item}
              </span>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 py-1.5 text-[10.5px] font-medium text-ink-soft sm:flex">
              <Building2 className="size-3.5 text-[#8a988f]" />
              {portalSummary.client}
              <ChevronDown className="size-3 text-[#9aa79f]" />
            </span>
            <Avatar name="Dian Puspita" size="md" />
            <Link
              href="/"
              className="grid size-8 place-items-center rounded-lg border border-line text-[#8a988f] hover:bg-panel"
              aria-label="Keluar dari portal"
            >
              <LogOut className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1280px] space-y-4 px-4 py-5 lg:px-6 lg:py-6">
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3a2c] via-[#0f4634] to-[#14563c] p-5 text-white">
          <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-[#4ade80]/15 blur-3xl" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge tone="mint">Portal Klien 3PL</Badge>
              <h1 className="mt-2.5 text-[22px] leading-tight font-semibold tracking-tight">
                Selamat datang, {portalSummary.client}
              </h1>
              <p className="mt-1 text-[11.5px] text-white/65">
                Visibilitas stok, order, dan tagihan Anda di {portalSummary.warehouse} · November 2026
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 lg:w-[380px]">
              {[
                { label: 'Nilai stok', value: formatIDR(portalSummary.stockValue, true) },
                { label: 'SKU aktif', value: formatNumber(portalSummary.skus) },
                { label: 'SLA', value: `${portalSummary.slaCompliance}%` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl bg-white/8 p-2.5 ring-1 ring-white/10">
                  <p className="text-[8.5px] text-white/50">{stat.label}</p>
                  <p className="mt-0.5 text-[13px] font-semibold tabular-nums">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Stok tersedia" value="8.420" unit="pcs" hint="6 SKU ditampilkan" icon={<Boxes className="size-4" />} />
          <StatCard label="Order terbuka" value={String(portalSummary.openOrders)} hint="diproses hari ini" icon={<PackageCheck className="size-4" />} tone="blue" />
          <StatCard label="Inbound hari ini" value={String(portalSummary.inboundToday)} hint="ASN terjadwal" icon={<Truck className="size-4" />} tone="violet" />
          <StatCard label="Okupansi ruang" value={`${portalSummary.storageUsed}%`} hint="shared storage" icon={<Warehouse className="size-4" />} tone="amber" />
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 space-y-4 xl:col-span-8">
            <Panel className="overflow-hidden">
              <PanelHeader
                title="Stok Anda"
                subtitle="Posisi stok per SKU · diperbarui real-time"
                action={
                  <button className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
                    <Download className="size-3.5" />
                    Unduh
                  </button>
                }
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr className="border-y border-line bg-[#fafbf9]">
                      {['SKU / Item', 'Lokasi', 'Lot', 'Qty', 'Status'].map((head) => (
                        <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {portalStock.map((row) => (
                      <tr key={row.id} className="border-b border-line/80 last:border-0">
                        <td className="px-4 py-2.5">
                          <p className="text-[11px] font-semibold text-ink">{row.name}</p>
                          <p className="font-mono text-[9.5px] text-faint">{row.sku}</p>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className="rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#12703f]">
                            {row.location}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 font-mono text-[9.5px] text-ink-soft">{row.lot}</td>
                        <td className="px-4 py-2.5 text-[11px] font-medium text-ink tabular-nums">
                          {formatNumber(row.qty)} {row.uom}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={row.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <PanelFooter>
                <span>Data milik {portalSummary.client}</span>
                <span>Traceability lot tersedia</span>
              </PanelFooter>
            </Panel>

            <Panel className="overflow-hidden">
              <PanelHeader
                title="Order terbaru"
                subtitle="Status fulfillment Anda"
                action={
                  <span className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-[#12703f]">
                    Lihat semua
                    <ArrowUpRight className="size-3" />
                  </span>
                }
              />
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-left">
                  <thead>
                    <tr className="border-y border-line bg-[#fafbf9]">
                      {['Order', 'Channel', 'Kurir', 'Nilai', 'Status'].map((head) => (
                        <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-line/80 last:border-0">
                        <td className="px-4 py-2.5">
                          <p className="text-[10.5px] font-semibold text-ink">{order.id}</p>
                          <p className="text-[9.5px] text-faint">{order.customer}</p>
                        </td>
                        <td className="px-4 py-2.5 text-[10px] text-ink-soft">{order.channel}</td>
                        <td className="px-4 py-2.5 text-[10px] text-ink-soft">{order.carrier}</td>
                        <td className="px-4 py-2.5 text-[10.5px] font-medium text-ink tabular-nums">
                          {formatIDR(order.value, true)}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={order.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <div className="col-span-12 space-y-4 xl:col-span-4">
            <Panel>
              <PanelHeader title="Ringkasan tagihan" subtitle="November 2026 · draft" action={<Badge tone="warning">Draft</Badge>} />
              <PanelBody className="space-y-2.5 pt-0">
                {[
                  { label: 'Penyimpanan (pallet/hari)', value: 4_200_000 },
                  { label: 'Handling inbound', value: 1_850_000 },
                  { label: 'Picking per line', value: 2_640_000 },
                  { label: 'Packing & VAS', value: 980_000 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between border-b border-line pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[10px] text-faint">{row.label}</span>
                    <span className="text-[10.5px] font-medium text-ink tabular-nums">{formatIDR(row.value, true)}</span>
                  </div>
                ))}
                <div className="rounded-xl bg-gradient-to-br from-[#0b3a2c] to-[#14563c] p-3 text-white">
                  <p className="text-[9px] tracking-[0.1em] text-white/55 uppercase">Total estimasi</p>
                  <p className="mt-0.5 text-[19px] font-semibold tabular-nums">{formatIDR(9_670_000)}</p>
                  <p className="mt-1 text-[9px] text-white/55">Belum termasuk PPN · invoice terbit 1 Des</p>
                </div>
                <button className={buttonStyles({ variant: 'secondary', className: 'w-full' })}>
                  <FileText className="size-3.5" />
                  Lihat rincian rate card
                </button>
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader title="Dokumen" subtitle="Unduhan terbaru" />
              <PanelBody className="space-y-2 pt-0">
                {[
                  { name: 'Invoice Oktober 2026.pdf', meta: '1,2 MB · 01 Nov' },
                  { name: 'Laporan stok Oktober.xlsx', meta: '248 KB · 02 Nov' },
                  { name: 'GRN-2026-004182.pdf', meta: '96 KB · 22 Nov' },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center gap-2.5 rounded-lg border border-line px-2.5 py-2">
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-panel text-[#5b6b61]">
                      <FileText className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[10px] font-medium text-ink">{doc.name}</p>
                      <p className="text-[8.5px] text-faint">{doc.meta}</p>
                    </div>
                    <Download className="size-3.5 text-[#9aa79f]" />
                  </div>
                ))}
              </PanelBody>
              <PanelFooter>
                <span>Semua dokumen aman</span>
                <span className="inline-flex items-center gap-1">
                  <ShieldCheck className="size-3 text-[#16a34a]" />
                  Terenkripsi
                </span>
              </PanelFooter>
            </Panel>

            <Panel>
              <PanelHeader title="SLA kepatuhan" subtitle="Bulan berjalan" />
              <PanelBody className="space-y-3 pt-0">
                {[
                  { label: 'On-time shipping', value: 97 },
                  { label: 'Order accuracy', value: 99 },
                  { label: 'Dock-to-stock', value: 88 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-[10px]">
                      <span className="text-ink-soft">{item.label}</span>
                      <span className="font-semibold text-ink tabular-nums">{item.value}%</span>
                    </div>
                    <Progress value={item.value} tone="green" />
                  </div>
                ))}
              </PanelBody>
            </Panel>
          </div>
        </div>

        <p className="pb-2 text-center text-[9.5px] text-faint">
          Portal klien menampilkan data milik {portalSummary.client} saja · isolasi data antar tenant aktif
        </p>
      </main>
    </div>
  )
}
