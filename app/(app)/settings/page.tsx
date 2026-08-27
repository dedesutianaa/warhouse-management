'use client'

import { useState } from 'react'
import { Check, Save, Settings2, SlidersHorizontal, Sparkles } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { Badge } from '@/components/ui-kit/badge'
import { Tabs } from '@/components/ui-kit/tabs'
import { buttonStyles } from '@/components/ui-kit/button'
import { cn } from '@/lib/utils'

const tabs = [
  { value: 'umum', label: 'Umum' },
  { value: 'operasional', label: 'Operasional' },
  { value: 'dokumen', label: 'Dokumen' },
  { value: 'notifikasi', label: 'Notifikasi' },
]

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean
  onChange: (value: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-line py-2.5 last:border-0 last:pb-0">
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-ink">{label}</p>
        {description ? <p className="mt-0.5 text-[9.5px] leading-relaxed text-faint">{description}</p> : null}
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-[#16a34a]' : 'bg-[#dfe6dc]',
        )}
      >
        <span
          className={cn(
            'absolute top-0.5 size-4 rounded-full bg-white shadow-sm transition-transform',
            checked ? 'translate-x-4.5' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  )
}

function Field({
  label,
  defaultValue,
  hint,
  className,
}: {
  label: string
  defaultValue: string
  hint?: string
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-[10px] font-medium text-faint">{label}</label>
      <input
        defaultValue={defaultValue}
        className="h-9 w-full rounded-xl border border-line bg-white px-3 text-[11.5px] text-ink focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
      />
      {hint ? <p className="mt-1 text-[9px] text-faint">{hint}</p> : null}
    </div>
  )
}

export default function SettingsPage() {
  const [tab, setTab] = useState('umum')
  const [negativeStock, setNegativeStock] = useState(false)
  const [blindReceiving, setBlindReceiving] = useState(true)
  const [autoAllocate, setAutoAllocate] = useState(true)
  const [slaAlert, setSlaAlert] = useState(true)
  const [approvalAlert, setApprovalAlert] = useState(true)
  const [lowStockAlert, setLowStockAlert] = useState(true)
  const [integrationAlert, setIntegrationAlert] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(false)
  const [crossDock, setCrossDock] = useState(false)
  const [vas, setVas] = useState(false)
  const [yard, setYard] = useState(false)
  const [billing, setBilling] = useState(false)

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pengaturan"
        description="Konfigurasi per gudang: strategi alokasi, aturan putaway, cut-off, dokumen, dan notifikasi."
        actions={
          <button className={buttonStyles({ variant: 'primary' })}>
            <Save className="size-3.5" />
            Simpan perubahan
          </button>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 space-y-4 xl:col-span-8">
          <Tabs items={tabs} value={tab} onChange={setTab} className="w-full sm:w-fit" />

          {tab === 'umum' ? (
            <Panel>
              <PanelHeader title="Profil gudang" subtitle="WH-CKR-01 · Cikarang" icon={<Settings2 className="size-3.5 text-[#16a34a]" />} />
              <PanelBody className="grid grid-cols-1 gap-3 pt-0 sm:grid-cols-2">
                <Field label="Nama gudang" defaultValue="Gudang Cikarang" />
                <Field label="Kode gudang" defaultValue="WH-CKR-01" />
                <Field label="Zona waktu" defaultValue="WIB (UTC+7)" />
                <Field label="Mata uang" defaultValue="IDR — Rupiah" />
                <Field label="Bahasa default" defaultValue="Bahasa Indonesia" />
                <Field label="Format tanggal" defaultValue="DD MMM YYYY" />
                <Field label="Alamat" defaultValue="Kawasan Industri Jababeka, Cikarang" className="sm:col-span-2" />
                <Field label="Kontak operasional" defaultValue="+62 21 8934 2210" />
                <Field label="Email operasional" defaultValue="ops.cikarang@gudangku.id" />
              </PanelBody>
              <PanelFooter>
                <span>Perubahan tercatat di audit trail</span>
                <span>Terakhir diubah 22 Nov 08:58</span>
              </PanelFooter>
            </Panel>
          ) : null}

          {tab === 'operasional' ? (
            <>
              <Panel>
                <PanelHeader title="Alokasi & putaway" subtitle="Aturan default gudang" icon={<SlidersHorizontal className="size-3.5 text-[#16a34a]" />} />
                <PanelBody className="space-y-3 pt-0">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label htmlFor="strategy" className="mb-1 block text-[10px] font-medium text-faint">
                        Strategi alokasi
                      </label>
                      <select
                        id="strategy"
                        defaultValue="FEFO"
                        className="h-9 w-full rounded-xl border border-line bg-white px-3 text-[11.5px] text-ink focus:border-[#bcd6c2] focus:outline-none"
                      >
                        <option>FEFO — First Expired First Out</option>
                        <option>FIFO — First In First Out</option>
                        <option>LIFO — Last In First Out</option>
                      </select>
                    </div>
                    <Field label="Toleransi over-receipt" defaultValue="2%" hint="Di atas nilai ini perlu approval" />
                    <Field label="Minimum sisa shelf life" defaultValue="70%" hint="Saat receiving & pengiriman" />
                    <Field label="Toleransi selisih cycle count" defaultValue="1%" hint="Di atas ini recount otomatis" />
                  </div>
                  <div className="pt-1">
                    <Toggle
                      checked={negativeStock}
                      onChange={setNegativeStock}
                      label="Izinkan stok negatif"
                      description="Hanya untuk gudang dengan alasan bisnis eksplisit."
                    />
                    <Toggle
                      checked={blindReceiving}
                      onChange={setBlindReceiving}
                      label="Blind receiving"
                      description="Sembunyikan qty ekspektasi dari operator receiving."
                    />
                    <Toggle
                      checked={autoAllocate}
                      onChange={setAutoAllocate}
                      label="Auto-alokasi order"
                      description="Alokasikan stok otomatis saat order masuk dari channel."
                    />
                  </div>
                </PanelBody>
              </Panel>

              <Panel>
                <PanelHeader title="Cut-off kurir" subtitle="Batas waktu serah terima harian" />
                <PanelBody className="space-y-2 pt-0">
                  {[
                    { carrier: 'J&T Express', time: '11:30' },
                    { carrier: 'JNE Express', time: '13:00' },
                    { carrier: 'SiCepat Ekspres', time: '14:30' },
                    { carrier: 'Anteraja', time: '15:00' },
                  ].map((row) => (
                    <div key={row.carrier} className="flex items-center justify-between rounded-lg border border-line px-3 py-2">
                      <span className="text-[10.5px] text-ink-soft">{row.carrier}</span>
                      <input
                        defaultValue={row.time}
                        aria-label={`Cut-off ${row.carrier}`}
                        className="h-7 w-20 rounded-md border border-line bg-white px-2 text-center font-mono text-[10.5px] text-ink focus:border-[#bcd6c2] focus:outline-none"
                      />
                    </div>
                  ))}
                </PanelBody>
                <PanelFooter>
                  <span>Alert otomatis 60 menit sebelum cut-off</span>
                  <span>4 kurir</span>
                </PanelFooter>
              </Panel>
            </>
          ) : null}

          {tab === 'dokumen' ? (
            <Panel>
              <PanelHeader title="Penomoran & template dokumen" subtitle="Format otomatis per jenis dokumen" />
              <PanelBody className="grid grid-cols-1 gap-3 pt-0 sm:grid-cols-2">
                <Field label="Prefix PO" defaultValue="PO-{YYYY}-{SEQ:6}" />
                <Field label="Prefix GRN" defaultValue="GRN-{YYYY}-{SEQ:6}" />
                <Field label="Prefix Order" defaultValue="SO-{YYYY}-{SEQ:6}" />
                <Field label="Prefix Transfer" defaultValue="TRF-{YYYY}-{SEQ:4}" />
                <Field label="Prefix RMA" defaultValue="RMA-{YYYY}-{SEQ:4}" />
                <Field label="Prefix LPN" defaultValue="LPN-{SEQ:5}" />
                <div className="sm:col-span-2">
                  <label htmlFor="label" className="mb-1 block text-[10px] font-medium text-faint">
                    Template label default
                  </label>
                  <select
                    id="label"
                    defaultValue="ZPL · Label 100×150 mm"
                    className="h-9 w-full rounded-xl border border-line bg-white px-3 text-[11.5px] text-ink focus:border-[#bcd6c2] focus:outline-none"
                  >
                    <option>ZPL · Label 100×150 mm</option>
                    <option>PDF · AWB 100×150 mm</option>
                    <option>TSC · Label bin 50×30 mm</option>
                  </select>
                </div>
                <div className="sm:col-span-2 rounded-xl bg-panel p-3">
                  <p className="text-[10px] font-medium text-ink">Preview penomoran</p>
                  <p className="mt-1 font-mono text-[11px] text-ink-soft">PO-2026-004183 · GRN-2026-004183 · SO-2026-118403</p>
                </div>
              </PanelBody>
              <PanelFooter>
                <span>Placeholder: {'{YYYY} {MM} {SEQ} {WH}'}</span>
                <span>Template dapat dikustomisasi</span>
              </PanelFooter>
            </Panel>
          ) : null}

          {tab === 'notifikasi' ? (
            <Panel>
              <PanelHeader title="Preferensi notifikasi" subtitle="In-app, email, dan push mobile" />
              <PanelBody className="pt-0">
                <Toggle checked={slaAlert} onChange={setSlaAlert} label="SLA at risk" description="Alert 60 menit sebelum cut-off, eskalasi ke supervisor." />
                <Toggle checked={approvalAlert} onChange={setApprovalAlert} label="Approval pending" description="Adjustment, override, dan perubahan master data." />
                <Toggle checked={lowStockAlert} onChange={setLowStockAlert} label="Stok minimum" description="Saat pick face menyentuh batas minimum." />
                <Toggle checked={integrationAlert} onChange={setIntegrationAlert} label="Integrasi gagal" description="Webhook gagal atau konektor terputus." />
                <Toggle checked={dailyDigest} onChange={setDailyDigest} label="Ringkasan harian" description="Email ringkasan KPI setiap pukul 07:00 WIB." />
              </PanelBody>
              <PanelFooter>
                <span>Preferensi per pengguna & per peran</span>
                <span>5 aturan</span>
              </PanelFooter>
            </Panel>
          ) : null}
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Konfigurasi aktif" subtitle="Ringkasan gudang" action={<Badge tone="success" dot>Aktif</Badge>} />
            <PanelBody className="space-y-2 pt-0">
              {[
                { label: 'Strategi alokasi', value: 'FEFO' },
                { label: 'Zona waktu', value: 'WIB' },
                { label: 'Mata uang', value: 'IDR' },
                { label: 'Cut-off terdekat', value: '11:30' },
                { label: 'Toleransi selisih', value: '1%' },
                { label: 'Blind receiving', value: blindReceiving ? 'Aktif' : 'Nonaktif' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-line pb-1.5 last:border-0 last:pb-0">
                  <span className="text-[10px] text-faint">{row.label}</span>
                  <span className="text-[10.5px] font-medium text-ink">{row.value}</span>
                </div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Feature flags" subtitle="Aktifkan modul lanjutan" icon={<Sparkles className="size-3.5 text-[#16a34a]" />} />
            <PanelBody className="pt-0">
              <Toggle checked={crossDock} onChange={setCrossDock} label="Cross-docking" description="Fase 2 · flow-through inbound → outbound." />
              <Toggle checked={vas} onChange={setVas} label="Value-added services" description="Fase 2 · kitting, repack, relabel." />
              <Toggle checked={yard} onChange={setYard} label="Yard & dock" description="Fase 2 · appointment & antrean kendaraan." />
              <Toggle checked={billing} onChange={setBilling} label="Billing 3PL" description="Fase 2 · rate card & invoice klien." />
            </PanelBody>
            <PanelFooter>
              <span>Perubahan butuh konfirmasi</span>
              <span>4 flag</span>
            </PanelFooter>
          </Panel>

          <div className="rounded-2xl border border-line bg-white p-3.5">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-lg bg-mint text-[#12703f]">
                <Check className="size-3.5" />
              </span>
              <p className="text-[11px] font-semibold text-ink">Konfigurasi tersimpan</p>
            </div>
            <p className="mt-1.5 text-[10px] leading-relaxed text-faint">
              Semua perubahan tercatat di audit trail dan disinkronkan ke perangkat RF dalam 60 detik.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
