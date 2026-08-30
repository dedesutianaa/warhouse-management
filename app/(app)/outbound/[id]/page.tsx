import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Printer,
  ShieldCheck,
  Truck,
  User,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Stepper } from '@/components/ui-kit/stepper'
import { buttonStyles } from '@/components/ui-kit/button'
import { orders } from '@/lib/data'
import { formatIDR } from '@/lib/format'

const lines = [
  { sku: 'SKU-1042', name: 'Kopi Arabika Gayo 250g', qty: 2, location: 'A-01-02-03', lot: 'LOT-2611-A', status: 'Picked' },
  { sku: 'SKU-2087', name: 'Teh Hijau Melati 20 Bag', qty: 1, location: 'A-02-01-01', lot: 'LOT-2611-B', status: 'Picked' },
  { sku: 'SKU-5108', name: 'Biskuit Cokelat 120g', qty: 2, location: 'B-01-03-02', lot: 'LOT-2611-C', status: 'Picking' },
]

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = orders.find((row) => row.id === id) ?? orders[0]

  const steps = [
    { label: 'Created', hint: order.createdAt, state: 'done' as const },
    { label: 'Allocated', hint: '09:14', state: 'done' as const },
    { label: 'Released', hint: '09:18', state: 'done' as const },
    { label: 'Picking', hint: 'Berjalan', state: 'current' as const },
    { label: 'Packing', hint: 'Menunggu', state: 'todo' as const },
    { label: 'Staged', hint: 'Menunggu', state: 'todo' as const },
    { label: 'Shipped', hint: '—', state: 'todo' as const },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Outbound', 'Order']}
        title={order.id}
        description={`${order.customer} · ${order.channel} · dibuat ${order.createdAt} · ${order.priority}`}
        actions={
          <>
            <Link href="/outbound" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Kembali
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Printer className="size-3.5" />
              Cetak label
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Truck className="size-3.5" />
              Release ke gudang
            </button>
          </>
        }
      />

      <Panel>
        <PanelBody className="py-4">
          <Stepper steps={steps} />
        </PanelBody>
      </Panel>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 space-y-4 xl:col-span-8">
          <Panel className="overflow-hidden">
            <PanelHeader
              title="Line order"
              subtitle={`${lines.length} line · ${order.qty} pcs · alokasi FEFO`}
              action={<StatusBadge status={order.status} />}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-line bg-[#fafbf9]">
                    {['SKU / Item', 'Qty', 'Lokasi alokasi', 'Lot', 'Status'].map((head) => (
                      <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.sku} className="border-b border-line/80 last:border-0">
                      <td className="px-4 py-3">
                        <p className="text-[11.5px] font-semibold text-ink">{line.name}</p>
                        <p className="font-mono text-[10px] text-faint">{line.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-[11px] font-medium text-ink tabular-nums">{line.qty}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-[#12703f]">
                          {line.location}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-[10.5px] text-ink-soft">{line.lot}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={line.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PanelFooter>
              <span>Alokasi: FEFO · lot terdekat kedaluwarsa</span>
              <span>Stok teralokasi 5 pcs</span>
            </PanelFooter>
          </Panel>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Panel>
              <PanelHeader title="Pengiriman" subtitle="Kurir & layanan terpilih" />
              <PanelBody className="space-y-2.5 pt-0">
                {[
                  { icon: Truck, label: 'Kurir', value: `${order.carrier} · REG` },
                  { icon: Package, label: 'AWB', value: 'JT-9921-0042-118' },
                  { icon: Clock, label: 'Cut-off', value: '11:30 · sisa 58 menit' },
                  { icon: MapPin, label: 'Tujuan', value: `${order.city}, Indonesia` },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-2.5">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-panel text-[#8a988f]">
                      <row.icon className="size-3.5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[9.5px] text-faint">{row.label}</p>
                      <p className="text-[11px] font-medium text-ink">{row.value}</p>
                    </div>
                  </div>
                ))}
              </PanelBody>
            </Panel>

            <Panel>
              <PanelHeader
                title="Data penerima"
                subtitle="Dimasking sesuai peran (UU PDP)"
                action={<Badge tone="neutral">Masked</Badge>}
              />
              <PanelBody className="space-y-2.5 pt-0">
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-full bg-mint text-[#12703f]">
                    <User className="size-4" />
                  </span>
                  <div>
                    <p className="text-[11.5px] font-semibold text-ink">{order.customer}</p>
                    <p className="text-[10px] text-faint">+62 812-****-4471</p>
                  </div>
                </div>
                <p className="rounded-xl bg-panel p-2.5 text-[10.5px] leading-relaxed text-ink-soft">
                  Jl. Cihampelas No. 118, Kel. Cipaganti, Kec. Coblong, {order.city} 40131
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-faint">
                  <ShieldCheck className="size-3.5 text-[#16a34a]" />
                  Alamat lengkap hanya untuk packing & kurir
                </div>
              </PanelBody>
            </Panel>
          </div>

          <Panel>
            <PanelHeader title="Timeline order" subtitle="Riwayat status & dokumen" />
            <PanelBody className="pt-0">
              <ol className="relative space-y-3 before:absolute before:top-1 before:bottom-1 before:left-[13px] before:w-px before:bg-line">
                {[
                  { text: 'Order diterima dari Shopee', time: '09:12', done: true },
                  { text: 'Validasi alamat & layanan kurir', time: '09:13', done: true },
                  { text: 'Alokasi stok FEFO · 5 pcs', time: '09:14', done: true },
                  { text: 'Release ke wave WAVE-1122-01', time: '09:18', done: true },
                  { text: 'Picking dimulai · Bayu Saputra', time: '09:26', done: false },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5">
                    <span
                      className={`relative z-10 mt-0.5 grid size-6 shrink-0 place-items-center rounded-full ring-4 ring-white ${
                        item.done ? 'bg-mint text-[#12703f]' : 'bg-[#fef6e7] text-[#96600a]'
                      }`}
                    >
                      {item.done ? <CheckCircle2 className="size-3.5" /> : <Clock className="size-3.5" />}
                    </span>
                    <p className="flex-1 text-[10.5px] text-ink-soft">{item.text}</p>
                    <span className="text-[9.5px] text-faint">{item.time}</span>
                  </li>
                ))}
              </ol>
            </PanelBody>
          </Panel>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Ringkasan order" subtitle="Nilai & prioritas" />
            <PanelBody className="space-y-3 pt-0">
              <div className="rounded-xl bg-gradient-to-br from-[#0b3a2c] to-[#14563c] p-3.5 text-white">
                <p className="text-[9.5px] tracking-[0.12em] text-white/55 uppercase">Total order</p>
                <p className="mt-1 text-[22px] leading-none font-semibold tabular-nums">{formatIDR(order.value)}</p>
                <p className="mt-1.5 text-[10px] text-white/60">
                  {order.items} line · {order.qty} pcs · {order.channel}
                </p>
              </div>
              {[
                { label: 'Prioritas', value: order.priority },
                { label: 'SLA tersisa', value: order.sla },
                { label: 'Gudang', value: 'WH-CKR-01 · Cikarang' },
                { label: 'Pemilik stok', value: 'PT Sinar Retail' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-line pb-2 last:border-0 last:pb-0">
                  <span className="text-[10.5px] text-faint">{row.label}</span>
                  <span className="text-[11px] font-medium text-ink">{row.value}</span>
                </div>
              ))}
            </PanelBody>
          </Panel>

          <div className="flex items-start gap-2.5 rounded-2xl border border-[#f6e3bd] bg-[#fef9ee] p-3.5">
            <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#96600a]" />
            <div>
              <p className="text-[11px] font-semibold text-[#7a4d05]">SLA berisiko</p>
              <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#96600a]">
                Sisa 58 menit sebelum cut-off J&amp;T. Pastikan picking selesai sebelum 10:45.
              </p>
            </div>
          </div>

          <Panel>
            <PanelHeader title="Aksi order" subtitle="Kontrol status & eksepsi" />
            <PanelBody className="space-y-2 pt-0">
              <button className={buttonStyles({ variant: 'primary', className: 'w-full' })}>Lanjutkan picking</button>
              <button className={buttonStyles({ variant: 'secondary', className: 'w-full' })}>Ubah kurir / alamat</button>
              <button className={buttonStyles({ variant: 'danger', className: 'w-full' })}>Batalkan order</button>
              <p className="pt-1 text-[9.5px] leading-relaxed text-faint">
                Pembatalan setelah packing memerlukan un-pack dan put-back terkontrol.
              </p>
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  )
}
