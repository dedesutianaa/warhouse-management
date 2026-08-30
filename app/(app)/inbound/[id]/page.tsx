import Link from 'next/link'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  FileText,
  MapPin,
  Printer,
  ScanLine,
  Truck,
  User,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { Stepper } from '@/components/ui-kit/stepper'
import { buttonStyles } from '@/components/ui-kit/button'
import { inboundLines, inboundShipments } from '@/lib/data'
import { formatNumber } from '@/lib/format'

export default async function InboundDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const shipment = inboundShipments.find((row) => row.id === id) ?? inboundShipments[0]

  const steps = [
    { label: 'Gate-in', hint: '08:52', state: 'done' as const },
    { label: 'Unloading', hint: '09:34', state: 'done' as const },
    { label: 'Receiving', hint: 'Berjalan', state: 'current' as const },
    { label: 'QC', hint: 'Menunggu', state: 'todo' as const },
    { label: 'Putaway', hint: 'Menunggu', state: 'todo' as const },
    { label: 'Selesai', hint: '—', state: 'todo' as const },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inbound', 'Penerimaan']}
        title={shipment.id}
        description={`${shipment.supplier} · ${shipment.po} · ${shipment.dock}`}
        actions={
          <>
            <Link href="/inbound" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Kembali
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Printer className="size-3.5" />
              Cetak GRN
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <ScanLine className="size-3.5" />
              Lanjutkan receiving
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
              title="Baris penerimaan"
              subtitle={`${inboundLines.length} line · ${formatNumber(
                inboundLines.reduce((sum, line) => sum + line.received, 0),
              )} dari ${formatNumber(inboundLines.reduce((sum, line) => sum + line.expected, 0))} pcs diterima`}
              action={<StatusBadge status={shipment.status} />}
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-y border-line bg-[#fafbf9]">
                    {['SKU / Item', 'Ekspektasi', 'Diterima', 'Lot', 'Kedaluwarsa', 'Status'].map((head) => (
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
                  {inboundLines.map((line) => (
                    <tr key={line.sku} className="border-b border-line/80 last:border-0">
                      <td className="px-4 py-3">
                        <p className="text-[11.5px] font-semibold text-ink">{line.name}</p>
                        <p className="font-mono text-[10px] text-faint">{line.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-[11px] text-ink-soft tabular-nums">
                        {formatNumber(line.expected)}
                      </td>
                      <td className="px-4 py-3 text-[11px] font-medium text-ink tabular-nums">
                        {formatNumber(line.received)}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10.5px] text-ink-soft">{line.lot}</td>
                      <td className="px-4 py-3 text-[11px] text-ink-soft">{line.expiry}</td>
                      <td className="px-4 py-3">
                        <Badge
                          tone={
                            line.status === 'Sesuai' ? 'success' : line.status.startsWith('Short') ? 'warning' : 'info'
                          }
                          dot
                        >
                          {line.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <PanelFooter>
              <span>Total diterima {formatNumber(inboundLines.reduce((sum, line) => sum + line.received, 0))} pcs</span>
              <span>Selisih 12 pcs · toleransi 2%</span>
            </PanelFooter>
          </Panel>

          <div className="flex items-start gap-3 rounded-2xl border border-[#f6e3bd] bg-[#fef9ee] p-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#fbeccd] text-[#96600a]">
              <AlertTriangle className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-semibold text-[#7a4d05]">Selisih penerimaan perlu approval</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#96600a]">
                SKU-5108 diterima 228 dari 240 pcs (short 12 pcs, 5% di atas toleransi 2%). Tambahkan reason code
                dan foto bukti sebelum menutup PO.
              </p>
            </div>
            <button className={buttonStyles({ variant: 'secondary', size: 'sm' })}>Tinjau selisih</button>
          </div>

          <Panel>
            <PanelHeader title="Dokumen & lampiran" subtitle="Tersimpan otomatis pada GRN" />
            <PanelBody className="grid grid-cols-1 gap-2 pt-0 sm:grid-cols-3">
              {[
                { name: 'Surat Jalan 004182.pdf', meta: '248 KB · 09:41' },
                { name: 'Packing List.xlsx', meta: '96 KB · 09:42' },
                { name: 'Foto selisih SKU-5108.jpg', meta: '1,2 MB · 09:44' },
              ].map((file) => (
                <div key={file.name} className="flex items-center gap-2.5 rounded-xl border border-line p-2.5">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-panel text-[#5b6b61]">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-ink">{file.name}</p>
                    <p className="text-[9.5px] text-faint">{file.meta}</p>
                  </div>
                </div>
              ))}
            </PanelBody>
          </Panel>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Ringkasan penerimaan" subtitle="Data dokumen & operator" />
            <PanelBody className="space-y-2.5 pt-0">
              {[
                { icon: Truck, label: 'Supplier', value: shipment.supplier },
                { icon: FileText, label: 'Nomor PO', value: shipment.po },
                { icon: MapPin, label: 'Dock', value: `${shipment.dock} · B 1148 TRC` },
                { icon: User, label: 'Operator', value: shipment.operator },
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
              <div className="rounded-xl bg-panel p-2.5">
                <div className="mb-1.5 flex items-center justify-between text-[10px]">
                  <span className="text-faint">Progres receiving</span>
                  <span className="font-semibold text-ink tabular-nums">{shipment.progress}%</span>
                </div>
                <Progress value={shipment.progress} tone="dark" />
                <p className="mt-1.5 text-[9.5px] text-faint">LPN dibuat otomatis: 4 pallet · 2 tote</p>
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader
              title="Saran putaway"
              subtitle="Berdasarkan zona, kapasitas, dan FEFO"
              action={<Badge tone="mint">3 lokasi</Badge>}
            />
            <PanelBody className="space-y-2 pt-0">
              {[
                { lpn: 'LPN-88214', loc: 'A-01-02-03', reason: 'Konsolidasi lot · FEFO', pct: 82 },
                { lpn: 'LPN-88215', loc: 'A-02-01-01', reason: 'Fast moving · pick face', pct: 100 },
                { lpn: 'LPN-88216', loc: 'B-01-03-02', reason: 'Kapasitas & kelas B', pct: 76 },
              ].map((item) => (
                <div key={item.lpn} className="rounded-xl border border-line p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10.5px] font-semibold text-ink">{item.lpn}</span>
                    <span className="rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#12703f]">
                      {item.loc}
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-faint">{item.reason}</p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <Progress value={item.pct} tone={item.pct >= 95 ? 'amber' : 'green'} className="h-1" />
                    <span className="text-[9px] text-faint tabular-nums">{item.pct}%</span>
                  </div>
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Override wajib reason code</span>
              <Link href="/inbound/putaway" className="font-medium text-[#12703f] hover:underline">
                Buka queue
              </Link>
            </PanelFooter>
          </Panel>

          <Panel>
            <PanelHeader title="Aktivitas dokumen" subtitle="Audit trail penerimaan" />
            <PanelBody className="pt-0">
              <ol className="space-y-2.5">
                {[
                  { text: 'Gate-in kendaraan B 1148 TRC', time: '08:52', done: true },
                  { text: 'Unloading 4 pallet selesai', time: '09:34', done: true },
                  { text: 'Receiving 840 pcs · 3 line', time: '09:41', done: true },
                  { text: 'Selisih SKU-5108 dilaporkan', time: '09:44', done: false },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-2">
                    <CheckCircle2
                      className={`mt-0.5 size-3.5 shrink-0 ${item.done ? 'text-[#16a34a]' : 'text-[#d97706]'}`}
                    />
                    <p className="flex-1 text-[10.5px] text-ink-soft">{item.text}</p>
                    <span className="text-[9.5px] text-faint">{item.time}</span>
                  </li>
                ))}
              </ol>
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  )
}
