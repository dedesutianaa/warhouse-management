import Link from 'next/link'
import { ArrowLeft, Check, ImageIcon, Package, RotateCcw, ShieldAlert, X } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { Badge } from '@/components/ui-kit/badge'
import { Stepper } from '@/components/ui-kit/stepper'
import { buttonStyles } from '@/components/ui-kit/button'
import { returnDetail } from '@/lib/data'

const dispositions = [
  { key: 'restock', label: 'Restock ke Available', hint: 'Layak jual · grade A', selected: true },
  { key: 'refurbish', label: 'Refurbish / repack', hint: 'Perlu relabel & QC ulang', selected: false },
  { key: 'quarantine', label: 'Quarantine', hint: 'Investigasi atau klaim', selected: false },
  { key: 'scrap', label: 'Scrap / write-off', hint: 'Tidak layak jual', selected: false },
  { key: 'rtv', label: 'Retur ke vendor (RTV)', hint: 'Klaim ke supplier', selected: false },
]

export default function ReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Retur', 'Inspeksi']}
        title={returnDetail.id}
        description={`${returnDetail.customer} · ${returnDetail.order} · diterima ${returnDetail.received}`}
        actions={
          <>
            <Link href="/returns" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Kembali
            </Link>
            <button className={buttonStyles({ variant: 'danger' })}>Tolak retur</button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Check className="size-3.5" />
              Simpan disposisi
            </button>
          </>
        }
      />

      <Panel>
        <PanelBody className="py-4">
          <Stepper
            steps={[
              { label: 'RMA dibuat', hint: '21 Nov', state: 'done' },
              { label: 'Diterima', hint: '08:42', state: 'done' },
              { label: 'Inspeksi', hint: 'Berjalan', state: 'current' },
              { label: 'Disposisi', hint: 'Menunggu', state: 'todo' },
              { label: 'Refund', hint: 'Menunggu', state: 'todo' },
            ]}
          />
        </PanelBody>
      </Panel>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 space-y-4 xl:col-span-8">
          <Panel>
            <PanelHeader
              title="Item retur"
              subtitle="Verifikasi terhadap RMA dan order asal"
              action={<Badge tone="warning" dot>Grade B</Badge>}
            />
            <PanelBody className="pt-0">
              <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line p-3">
                <span className="grid size-11 place-items-center rounded-xl bg-panel text-[#5b6b61]">
                  <Package className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold text-ink">{returnDetail.name}</p>
                  <p className="font-mono text-[10px] text-faint">
                    {returnDetail.sku} · SN {returnDetail.serial}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9.5px] text-faint">Qty retur</p>
                  <p className="text-[15px] font-semibold text-ink tabular-nums">{returnDetail.qty} pcs</p>
                </div>
              </div>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { label: 'Alasan retur', value: returnDetail.reason },
                  { label: 'Channel', value: returnDetail.channel },
                  { label: 'Order asal', value: returnDetail.order },
                ].map((row) => (
                  <div key={row.label} className="rounded-lg bg-panel px-2.5 py-2">
                    <p className="text-[9px] text-faint">{row.label}</p>
                    <p className="text-[10.5px] font-medium text-ink">{row.value}</p>
                  </div>
                ))}
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader
              title="Checklist inspeksi"
              subtitle="Wajib lengkap sebelum disposisi"
              action={<Badge tone="warning">2 temuan</Badge>}
            />
            <PanelBody className="space-y-1.5 pt-0">
              {returnDetail.checklist.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 rounded-lg border border-line px-3 py-2.5"
                >
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-full ${
                      item.pass ? 'bg-mint text-[#12703f]' : 'bg-[#fdecec] text-[#b42318]'
                    }`}
                  >
                    {item.pass ? <Check className="size-3" /> : <X className="size-3" />}
                  </span>
                  <span className={`flex-1 text-[11px] ${item.pass ? 'text-ink-soft' : 'font-medium text-[#b42318]'}`}>
                    {item.label}
                  </span>
                  <span className="text-[9.5px] text-faint">{item.pass ? 'Lulus' : 'Temuan'}</span>
                </div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Foto bukti" subtitle="Diambil saat inspeksi" action={<Badge tone="neutral">3 foto</Badge>} />
            <PanelBody className="grid grid-cols-3 gap-2 pt-0">
              {['Kemasan luar', 'Segel produk', 'Label serial'].map((label) => (
                <div key={label} className="overflow-hidden rounded-xl border border-line">
                  <div className="grid aspect-[4/3] place-items-center bg-[#f4f7f2] text-[#b3bfb7]">
                    <ImageIcon className="size-5" />
                  </div>
                  <p className="px-2 py-1.5 text-[9.5px] text-faint">{label}</p>
                </div>
              ))}
            </PanelBody>
          </Panel>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Disposisi" subtitle="Tentukan tujuan barang retur" />
            <PanelBody className="space-y-2 pt-0">
              {dispositions.map((item) => (
                <label
                  key={item.key}
                  className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-2.5 transition-colors ${
                    item.selected ? 'border-[#9fdcb4] bg-[#f4fbf6]' : 'border-line hover:border-line-strong'
                  }`}
                >
                  <span
                    className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border ${
                      item.selected ? 'border-[#16a34a] bg-[#16a34a] text-white' : 'border-line-strong bg-white'
                    }`}
                  >
                    {item.selected ? <Check className="size-2.5" /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold text-ink">{item.label}</span>
                    <span className="block text-[9.5px] text-faint">{item.hint}</span>
                  </span>
                </label>
              ))}
              <div>
                <label htmlFor="note" className="mb-1 block text-[10px] font-medium text-faint">
                  Catatan inspeksi
                </label>
                <textarea
                  id="note"
                  rows={2}
                  defaultValue="Kemasan luar penyok, produk utuh. Layak restock setelah relabel."
                  className="w-full rounded-xl border border-line bg-white px-3 py-2 text-[10.5px] text-ink focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
                />
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Dampak disposisi" subtitle="Stok & refund" />
            <PanelBody className="space-y-2 pt-0">
              {[
                { label: 'Stok Available', value: '+12 pcs' },
                { label: 'Lokasi tujuan', value: 'A-03-01-02' },
                { label: 'Refund OMS', value: 'Rp 1.188.000' },
                { label: 'SLA refund', value: '≤ 24 jam' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-line pb-1.5 last:border-0 last:pb-0">
                  <span className="text-[10px] text-faint">{row.label}</span>
                  <span className="text-[10.5px] font-medium text-ink">{row.value}</span>
                </div>
              ))}
              <button className={buttonStyles({ variant: 'primary', className: 'mt-1 w-full' })}>
                <RotateCcw className="size-3.5" />
                Konfirmasi & update stok
              </button>
            </PanelBody>
            <PanelFooter>
              <span>Notifikasi OMS otomatis</span>
              <Link href="/returns" className="font-medium text-[#12703f] hover:underline">
                Daftar retur
              </Link>
            </PanelFooter>
          </Panel>

          <div className="flex items-start gap-2.5 rounded-2xl border border-[#f6e3bd] bg-[#fef9ee] p-3.5">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-[#96600a]" />
            <div>
              <p className="text-[11px] font-semibold text-[#7a4d05]">Perlu verifikasi tambahan</p>
              <p className="mt-0.5 text-[10px] leading-relaxed text-[#96600a]">
                Dua item checklist tidak lulus. Disposisi restock memerlukan persetujuan supervisor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
