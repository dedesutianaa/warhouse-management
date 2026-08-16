import Link from 'next/link'
import { ArrowLeft, ArrowRight, Building2, FileText, Plus, Truck, Warehouse } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { buttonStyles } from '@/components/ui-kit/button'
import { transfers } from '@/lib/data'

export default function TransfersPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inventori', 'Transfer']}
        title="Transfer Gudang"
        description="Pemindahan stok antar gudang dengan status in-transit, dokumen pengiriman, dan penerimaan di gudang tujuan."
        actions={
          <>
            <Link href="/inventory" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Inventori
            </Link>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Buat transfer
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="In-transit" value="2" hint="2 truk berjalan" icon={<Truck className="size-4" />} tone="violet" />
        <StatCard label="Diterima bulan ini" value="18" delta="4" hint="transfer selesai" icon={<Warehouse className="size-4" />} />
        <StatCard label="Rata-rata transit" value="1,8 hari" delta="0,3" hint="lebih cepat" icon={<ArrowRight className="size-4" />} tone="blue" />
        <StatCard label="Selisih terima" value="0" hint="30 hari terakhir" icon={<FileText className="size-4" />} tone="amber" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Transfer order"
            subtitle="Semua perpindahan antar gudang"
            action={<Badge tone="mint">5 dokumen</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['ID', 'Rute', 'Item', 'Qty', 'Progres', 'Status', 'ETA'].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer) => (
                  <tr key={transfer.id} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                    <td className="px-4 py-3 text-[11px] font-semibold text-ink">{transfer.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-[10.5px] text-ink-soft">
                        <span>{transfer.from.replace('Gudang ', '')}</span>
                        <ArrowRight className="size-3 text-[#b3bfb7]" />
                        <span>{transfer.to.replace('Gudang ', '')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-ink-soft tabular-nums">{transfer.items}</td>
                    <td className="px-4 py-3 text-[11px] text-ink-soft tabular-nums">{transfer.qty} pcs</td>
                    <td className="px-4 py-3">
                      <div className="flex w-28 items-center gap-2">
                        <Progress value={transfer.progress} tone={transfer.progress === 100 ? 'green' : 'dark'} />
                        <span className="text-[9.5px] text-faint tabular-nums">{transfer.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={transfer.status} />
                    </td>
                    <td className="px-4 py-3 text-[10.5px] text-ink-soft">{transfer.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelFooter>
            <span>Stok in-transit tidak dapat dialokasikan</span>
            <span>2 transfer aktif</span>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Rute aktif" subtitle="TRF-2026-0031 · 120 pcs" action={<Badge tone="violet" dot>In-transit</Badge>} />
            <PanelBody className="pt-0">
              <div className="relative flex items-center justify-between gap-2 rounded-xl border border-line bg-[#fafcf9] p-3">
                <div className="text-center">
                  <span className="mx-auto grid size-9 place-items-center rounded-xl bg-mint text-[#12703f]">
                    <Building2 className="size-4" />
                  </span>
                  <p className="mt-1.5 text-[10px] font-semibold text-ink">Cikarang</p>
                  <p className="text-[9px] text-faint">WH-CKR-01</p>
                </div>
                <div className="flex-1">
                  <div className="relative h-px bg-line-strong">
                    <span className="absolute top-1/2 left-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white ring-1 ring-line">
                      <Truck className="size-3 text-[#16a34a]" />
                    </span>
                  </div>
                  <p className="mt-2 text-center text-[9px] text-faint">55% · 1,8 hari</p>
                </div>
                <div className="text-center">
                  <span className="mx-auto grid size-9 place-items-center rounded-xl bg-panel text-[#5b6b61]">
                    <Building2 className="size-4" />
                  </span>
                  <p className="mt-1.5 text-[10px] font-semibold text-ink">Surabaya</p>
                  <p className="text-[9px] text-faint">WH-SBY-02</p>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {[
                  { label: 'Surat jalan', value: 'SJ-2026-0031.pdf' },
                  { label: 'Kendaraan', value: 'B 9021 KHD · 12 pallet' },
                  { label: 'Driver', value: 'Slamet Riyadi' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between border-b border-line pb-1.5 last:border-0 last:pb-0">
                    <span className="text-[10px] text-faint">{row.label}</span>
                    <span className="text-[10.5px] font-medium text-ink">{row.value}</span>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Stok in-transit" subtitle="Belum tersedia di gudang tujuan" />
            <PanelBody className="space-y-2 pt-0">
              {[
                { name: 'Beras Organik 5kg', qty: 40, eta: '24 Nov' },
                { name: 'Kopi Arabika Gayo 250g', qty: 60, eta: '24 Nov' },
                { name: 'Teh Hijau Melati 20 Bag', qty: 20, eta: '23 Nov' },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-2">
                  <div>
                    <p className="text-[10.5px] font-medium text-ink">{item.name}</p>
                    <p className="text-[9px] text-faint">ETA {item.eta}</p>
                  </div>
                  <span className="text-[10.5px] font-semibold text-ink tabular-nums">{item.qty} pcs</span>
                </div>
              ))}
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  )
}
