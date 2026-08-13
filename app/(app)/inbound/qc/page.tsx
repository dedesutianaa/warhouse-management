import Link from 'next/link'
import {
  ArrowLeft,
  Camera,
  Check,
  ClipboardCheck,
  ImageIcon,
  ShieldAlert,
  ShieldCheck,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { buttonStyles } from '@/components/ui-kit/button'
import { qcInspections } from '@/lib/data'

const checklist = [
  { label: 'Kemasan luar utuh & tidak penyok', pass: true },
  { label: 'Label & barcode terbaca', pass: true },
  { label: 'Jumlah sesuai sampel', pass: true },
  { label: 'Suhu produk sesuai spesifikasi', pass: true },
  { label: 'Sisa shelf life ≥ 70%', pass: false },
  { label: 'Tidak ada tanda kontaminasi', pass: true },
]

export default function QcPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inbound', 'QC']}
        title="QC Inbound"
        description="Rencana sampling, checklist pemeriksaan, foto bukti, dan disposisi hasil inspeksi."
        actions={
          <>
            <Link href="/inbound" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Inbound
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>Rencana sampling</button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <ClipboardCheck className="size-3.5" />
              Mulai inspeksi
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Inspeksi hari ini" value="5" hint="2 masih berjalan" icon={<ClipboardCheck className="size-4" />} />
        <StatCard label="Lulus inspeksi" value="141" unit="unit" delta="96,6%" hint="dari 146 sampel" icon={<ShieldCheck className="size-4" />} tone="blue" />
        <StatCard label="Gagal / hold" value="5" unit="unit" hint="perlu disposisi" icon={<ShieldAlert className="size-4" />} tone="amber" />
        <StatCard label="Rata-rata QC" value="18m" delta="4m" hint="lebih cepat" icon={<Camera className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-7">
          <PanelHeader
            title="Antrean inspeksi"
            subtitle="Berdasarkan kedatangan dan prioritas supplier"
            action={<Badge tone="mint">5 dokumen</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['ID / PO', 'Supplier', 'Sampel', 'Hasil', 'Inspector', 'Status'].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {qcInspections.map((row) => (
                  <tr key={row.id} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-semibold whitespace-nowrap text-ink">{row.id}</p>
                      <p className="text-[10px] whitespace-nowrap text-faint">{row.po}</p>
                    </td>
                    <td className="px-4 py-3 text-[10.5px] text-ink-soft">{row.supplier}</td>
                    <td className="px-4 py-3 text-[11px] text-ink-soft tabular-nums">{row.sample}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-medium text-[#12703f] tabular-nums">{row.passed} lulus</span>
                      {row.failed > 0 ? (
                        <span className="ml-1.5 text-[11px] font-medium text-[#b42318] tabular-nums">
                          {row.failed} gagal
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-[10.5px] text-ink-soft">{row.inspector}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={row.status === 'Berjalan' ? 'Receiving' : row.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelFooter>
            <span>Sampling AQL 2.5 · level inspeksi II</span>
            <span>Foto bukti wajib untuk hasil gagal</span>
          </PanelFooter>
        </Panel>

        <Panel className="col-span-12 xl:col-span-5">
          <PanelHeader
            title="Checklist inspeksi"
            subtitle="QC-2026-0141 · PO-2026-004182"
            action={<Badge tone="warning" dot>3 temuan</Badge>}
          />
          <PanelBody className="space-y-3 pt-0">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Sampel', value: '40' },
                { label: 'Lulus', value: '37' },
                { label: 'Gagal', value: '3' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl bg-panel p-2.5 text-center">
                  <p className="text-[9.5px] text-faint">{item.label}</p>
                  <p className="text-[16px] font-semibold text-ink tabular-nums">{item.value}</p>
                </div>
              ))}
            </div>

            <ul className="space-y-1.5">
              {checklist.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-[10.5px]"
                >
                  <span
                    className={`grid size-4 shrink-0 place-items-center rounded-full ${
                      item.pass ? 'bg-mint text-[#12703f]' : 'bg-[#fdecec] text-[#b42318]'
                    }`}
                  >
                    {item.pass ? <Check className="size-2.5" /> : <X className="size-2.5" />}
                  </span>
                  <span className={item.pass ? 'text-ink-soft' : 'font-medium text-[#b42318]'}>{item.label}</span>
                </li>
              ))}
            </ul>

            <div>
              <p className="mb-1.5 text-[9.5px] font-medium tracking-[0.1em] text-faint uppercase">Foto bukti</p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="grid aspect-square place-items-center rounded-xl border border-dashed border-line-strong bg-[#fafcf9] text-[#b3bfb7]"
                  >
                    <ImageIcon className="size-4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className={buttonStyles({ variant: 'primary', className: 'flex-1' })}>Luluskan</button>
              <button className={buttonStyles({ variant: 'secondary' })}>Hold</button>
              <button className={buttonStyles({ variant: 'danger' })}>Tolak</button>
            </div>
          </PanelBody>
        </Panel>
      </div>

      <Panel>
        <PanelHeader title="Scorecard supplier" subtitle="Akurasi pengiriman, kualitas, dan ketepatan waktu" />
        <PanelBody className="grid grid-cols-1 gap-2.5 pt-0 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { name: 'PT Sumber Pangan', accuracy: 98.4, quality: 99.1, ontime: 96 },
            { name: 'CV Aroma Nusantara', accuracy: 97.2, quality: 98.6, ontime: 94 },
            { name: 'PT Kosmetika Prima', accuracy: 99.1, quality: 99.4, ontime: 98 },
            { name: 'PT Distribusi Sehat', accuracy: 95.8, quality: 97.2, ontime: 91 },
          ].map((supplier) => (
            <div key={supplier.name} className="rounded-xl border border-line p-3">
              <p className="text-[11px] font-semibold text-ink">{supplier.name}</p>
              <div className="mt-2 space-y-1.5">
                {[
                  { label: 'Akurasi', value: supplier.accuracy },
                  { label: 'Kualitas', value: supplier.quality },
                  { label: 'On-time', value: supplier.ontime },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center gap-2 text-[9.5px]">
                    <span className="w-12 text-faint">{metric.label}</span>
                    <span className="h-1 flex-1 overflow-hidden rounded-full bg-[#eef2ec]">
                      <span
                        className="block h-full rounded-full bg-[#16a34a]"
                        style={{ width: `${metric.value}%` }}
                      />
                    </span>
                    <span className="w-8 text-right font-medium text-ink tabular-nums">{metric.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </PanelBody>
      </Panel>
    </div>
  )
}
