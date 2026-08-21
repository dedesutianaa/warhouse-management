import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileSignature,
  Package,
  Printer,
  ScanLine,
  Truck,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge } from '@/components/ui-kit/badge'
import { buttonStyles } from '@/components/ui-kit/button'
import { manifests } from '@/lib/data'

const lanes = [
  { lane: 'Lane 1', carrier: 'J&T', packages: 48, capacity: 60 },
  { lane: 'Lane 2', carrier: 'JNE', packages: 36, capacity: 60 },
  { lane: 'Lane 3', carrier: 'SiCepat', packages: 52, capacity: 60 },
  { lane: 'Lane 4', carrier: 'Anteraja', packages: 24, capacity: 40 },
]

export default function ShippingPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Outbound', 'Shipping']}
        title="Shipping & Manifest"
        description="Staging per lane, scan loading, manifest kurir, dan serah terima digital."
        actions={
          <>
            <Link href="/outbound" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Outbound
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Printer className="size-3.5" />
              Cetak manifest
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <FileSignature className="size-3.5" />
              Serah terima
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Paket siap kirim" value="160" hint="4 manifest" icon={<Package className="size-4" />} />
        <StatCard label="Sudah dimuat" value="112" hint="70% dari staging" icon={<Truck className="size-4" />} tone="blue" />
        <StatCard label="On-time shipping" value="97,4%" delta="1,2%" hint="target ≥ 97%" icon={<CheckCircle2 className="size-4" />} tone="violet" />
        <StatCard label="Paket bermasalah" value="1" hint="salah kurir" icon={<AlertTriangle className="size-4" />} tone="amber" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Manifest per kurir"
            subtitle="Serah terima hari ini · 22 November 2026"
            action={<Badge tone="mint">4 kurir</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['Kurir / AWB', 'Paket', 'Berat', 'Dock', 'Cut-off', 'Status', ''].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {manifests.map((manifest) => (
                  <tr key={manifest.carrier} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                    <td className="px-4 py-3">
                      <p className="text-[11.5px] font-semibold text-ink">{manifest.carrier}</p>
                      <p className="font-mono text-[10px] text-faint">{manifest.awb}</p>
                    </td>
                    <td className="px-4 py-3 text-[11px] font-medium text-ink tabular-nums">{manifest.packages}</td>
                    <td className="px-4 py-3 text-[11px] text-ink-soft tabular-nums">{manifest.weight} kg</td>
                    <td className="px-4 py-3 text-[11px] text-ink-soft">{manifest.dock}</td>
                    <td className="px-4 py-3 text-[11px] text-ink-soft tabular-nums">{manifest.cutoff}</td>
                    <td className="px-4 py-3">
                      <Badge
                        tone={
                          manifest.status === 'Siap Serah Terima'
                            ? 'success'
                            : manifest.status === 'Loading'
                              ? 'warning'
                              : 'neutral'
                        }
                        dot
                      >
                        {manifest.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <button className={buttonStyles({ variant: 'ghost', size: 'sm' })}>Detail</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelFooter>
            <span>Total 160 paket · 211,9 kg</span>
            <span>Scan loading wajib per paket</span>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Serah terima kurir" subtitle="J&T · 48 paket" action={<Badge tone="warning">Menunggu</Badge>} />
            <PanelBody className="space-y-3 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-panel p-2.5">
                  <p className="text-[9.5px] text-faint">Paket dihitung</p>
                  <p className="text-[16px] font-semibold text-ink tabular-nums">48/48</p>
                </div>
                <div className="rounded-xl bg-panel p-2.5">
                  <p className="text-[9.5px] text-faint">Berat total</p>
                  <p className="text-[16px] font-semibold text-ink tabular-nums">62,4 kg</p>
                </div>
              </div>
              <div>
                <p className="text-[9.5px] text-faint">Nama sopir / kurir</p>
                <p className="text-[11px] font-medium text-ink">Rahmat Hidayat · B 9021 KHD</p>
              </div>
              <div className="grid place-items-center rounded-xl border border-dashed border-line-strong bg-[#fafcf9] py-6 text-center">
                <FileSignature className="size-5 text-[#b3bfb7]" />
                <p className="mt-1.5 text-[10px] font-medium text-ink-soft">Tanda tangan digital</p>
                <p className="text-[9px] text-faint">Minta kurir menandatangani di perangkat</p>
              </div>
              <button className={buttonStyles({ variant: 'primary', className: 'w-full' })}>
                Konfirmasi handover
              </button>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Staging lane" subtitle="Okupansi per lane" />
            <PanelBody className="space-y-2.5 pt-0">
              {lanes.map((lane) => (
                <div key={lane.lane} className="flex items-center gap-2.5">
                  <span className="w-12 text-[10px] font-medium text-ink-soft">{lane.lane}</span>
                  <span className="w-16 text-[10px] text-faint">{lane.carrier}</span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#eef2ec]">
                    <span
                      className="block h-full rounded-full bg-[#16a34a]"
                      style={{ width: `${(lane.packages / lane.capacity) * 100}%` }}
                    />
                  </span>
                  <span className="w-10 text-right text-[10px] font-semibold text-ink tabular-nums">
                    {lane.packages}
                  </span>
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Kapasitas lane 220 paket</span>
              <Link href="/outbound/packing" className="font-medium text-[#12703f] hover:underline">
                Packing
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#f6e3bd] bg-[#fef9ee] p-4 sm:flex-row sm:items-center">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#fbeccd] text-[#96600a]">
          <AlertTriangle className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-semibold text-[#7a4d05]">1 paket terdeteksi salah kurir</p>
          <p className="mt-0.5 text-[11px] text-[#96600a]">
            Paket SO-2026-118391 (SiCepat) berada di Lane 2 (JNE). Pindahkan sebelum manifest dicetak.
          </p>
        </div>
        <button className={buttonStyles({ variant: 'secondary', size: 'sm' })}>
          <ScanLine className="size-3.5" />
          Scan ulang
        </button>
      </div>
    </div>
  )
}
