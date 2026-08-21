'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Package,
  Printer,
  ScanLine,
  Scale,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { Badge } from '@/components/ui-kit/badge'
import { buttonStyles } from '@/components/ui-kit/button'
import { packingOrder } from '@/lib/data'

export default function PackingPage() {
  const [verified, setVerified] = useState<string[]>(
    packingOrder.items.filter((item) => item.verified).map((item) => item.sku),
  )
  const [scan, setScan] = useState('')
  const [weight, setWeight] = useState(String(packingOrder.weight))
  const [message, setMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null)
  const [printed, setPrinted] = useState(false)

  const allVerified = verified.length === packingOrder.items.length
  const weightValue = Number(weight.replace(',', '.'))
  const weightOff = Number.isFinite(weightValue) && Math.abs(weightValue - packingOrder.weight) > 0.15

  function handleScan(event: React.FormEvent) {
    event.preventDefault()
    const code = scan.trim().toUpperCase()
    if (!code) return
    const item = packingOrder.items.find(
      (row) => row.sku.toUpperCase() === code || row.name.toUpperCase().includes(code),
    )
    if (!item) {
      setMessage({ tone: 'err', text: `Barcode "${code}" tidak cocok dengan order ini.` })
      return
    }
    if (verified.includes(item.sku)) {
      setMessage({ tone: 'err', text: `${item.sku} sudah diverifikasi sebelumnya.` })
      return
    }
    setVerified((prev) => [...prev, item.sku])
    setMessage({ tone: 'ok', text: `${item.name} terverifikasi.` })
    setScan('')
  }

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Outbound', 'Packing']}
        title="Packing Station"
        description="Verifikasi item, timbang paket, dan cetak label kurir otomatis."
        actions={
          <>
            <Link href="/outbound" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Outbound
            </Link>
            <span className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-line bg-white px-3 text-[11.5px] font-medium text-ink-soft">
              <span className="size-1.5 rounded-full bg-[#16a34a] live-dot" />
              Station 2 · Maya Sari
            </span>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 space-y-4 xl:col-span-7">
          <Panel>
            <PanelHeader
              title="Verifikasi item"
              subtitle={`${packingOrder.id} · ${packingOrder.channel}`}
              action={<Badge tone={allVerified ? 'success' : 'warning'} dot>{verified.length}/{packingOrder.items.length} item</Badge>}
            />
            <PanelBody className="space-y-3 pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-panel px-3 py-2.5">
                <div>
                  <p className="text-[11.5px] font-semibold text-ink">{packingOrder.customer}</p>
                  <p className="text-[10px] text-faint">{packingOrder.address}</p>
                </div>
                <Badge tone="neutral">{packingOrder.phone}</Badge>
              </div>

              <form onSubmit={handleScan} className="flex gap-2">
                <div className="relative flex-1">
                  <ScanLine className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#8a988f]" />
                  <input
                    value={scan}
                    onChange={(event) => setScan(event.target.value)}
                    placeholder="Scan barcode item lalu Enter…"
                    aria-label="Scan barcode item"
                    className="h-11 w-full rounded-xl border border-line bg-white pr-3 pl-10 font-mono text-[12px] text-ink placeholder:font-sans placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
                  />
                </div>
                <button type="submit" className={buttonStyles({ variant: 'primary', size: 'lg' })}>
                  Verifikasi
                </button>
              </form>
              <p className="text-[10px] text-faint">
                Coba scan <span className="font-mono font-semibold text-ink-soft">SKU-1042</span> atau{' '}
                <span className="font-mono font-semibold text-ink-soft">SKU-2087</span>.
              </p>

              {message ? (
                <div
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] ${
                    message.tone === 'ok'
                      ? 'bg-[#f4fbf6] text-[#12703f] ring-1 ring-[#cdebd8]'
                      : 'bg-[#fdf2f2] text-[#b42318] ring-1 ring-[#f7d2d0]'
                  }`}
                >
                  {message.tone === 'ok' ? <CheckCircle2 className="size-3.5" /> : <X className="size-3.5" />}
                  {message.text}
                </div>
              ) : null}

              <ul className="space-y-2">
                {packingOrder.items.map((item) => {
                  const done = verified.includes(item.sku)
                  return (
                    <li
                      key={item.sku}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                        done ? 'border-[#cdebd8] bg-[#f7fcf8]' : 'border-line bg-white'
                      }`}
                    >
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                          done ? 'bg-mint text-[#12703f]' : 'bg-panel text-[#8a988f]'
                        }`}
                      >
                        {done ? <Check className="size-4" /> : <Package className="size-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11.5px] font-semibold text-ink">{item.name}</p>
                        <p className="font-mono text-[10px] text-faint">{item.sku}</p>
                      </div>
                      <span className="text-[11px] font-medium text-ink-soft tabular-nums">×{item.qty}</span>
                      <Badge tone={done ? 'success' : 'neutral'}>{done ? 'Terverifikasi' : 'Menunggu'}</Badge>
                    </li>
                  )
                })}
              </ul>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label htmlFor="weight" className="mb-1 block text-[10px] font-medium text-faint">
                    Berat aktual (kg)
                  </label>
                  <div className="relative">
                    <Scale className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#8a988f]" />
                    <input
                      id="weight"
                      value={weight}
                      onChange={(event) => setWeight(event.target.value)}
                      inputMode="decimal"
                      className="h-9 w-full rounded-xl border border-line bg-white pr-3 pl-8.5 text-[11.5px] text-ink tabular-nums focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
                    />
                  </div>
                  <p className={`mt-1 text-[9.5px] ${weightOff ? 'text-[#b42318]' : 'text-faint'}`}>
                    Teoritis {packingOrder.weight} kg · toleransi ±0,15 kg
                  </p>
                </div>
                <div>
                  <label htmlFor="carton" className="mb-1 block text-[10px] font-medium text-faint">
                    Saran kemasan
                  </label>
                  <select
                    id="carton"
                    defaultValue={packingOrder.carton}
                    className="h-9 w-full rounded-xl border border-line bg-white px-3 text-[11.5px] text-ink focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
                  >
                    <option>{packingOrder.carton}</option>
                    <option>Kardus S · 20×15×10 cm</option>
                    <option>Kardus L · 40×30×20 cm</option>
                  </select>
                  <p className="mt-1 text-[9.5px] text-faint">Cartonization: 1 paket · 78% terisi</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 border-t border-line pt-3 sm:flex-row">
                <button
                  onClick={() => setPrinted(true)}
                  disabled={!allVerified}
                  className={buttonStyles({ variant: 'primary', className: 'flex-1' })}
                >
                  <Printer className="size-3.5" />
                  {printed ? 'Label tercetak' : 'Cetak label & packing list'}
                </button>
                <button className={buttonStyles({ variant: 'secondary' })}>Simpan draft</button>
              </div>
              {!allVerified ? (
                <p className="text-[10px] text-faint">
                  Label kurir hanya dapat dicetak setelah seluruh item terverifikasi.
                </p>
              ) : null}
            </PanelBody>
          </Panel>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Paket selesai', value: '42', hint: 'shift ini' },
              { label: 'Rata-rata waktu', value: '1m 48s', hint: 'per paket' },
              { label: 'Salah label', value: '0', hint: '7 hari' },
              { label: 'Berat vs teoritis', value: '99,1%', hint: 'sesuai' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-line bg-white p-3">
                <p className="text-[9.5px] text-faint">{stat.label}</p>
                <p className="mt-0.5 text-[16px] font-semibold text-ink tabular-nums">{stat.value}</p>
                <p className="text-[9px] text-faint">{stat.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 space-y-4 xl:col-span-5">
          <Panel>
            <PanelHeader
              title="Label pengiriman"
              subtitle="Preview AWB · cetak otomatis setelah verifikasi"
              action={<Badge tone={printed ? 'success' : 'neutral'}>{printed ? 'Tercetak' : 'Preview'}</Badge>}
            />
            <PanelBody className="pt-0">
              <div className="overflow-hidden rounded-xl border border-line">
                <div className="flex items-center justify-between border-b border-line bg-[#fafbf9] px-3 py-2">
                  <span className="text-[13px] font-bold tracking-tight text-ink">{packingOrder.carrier}</span>
                  <span className="text-[9px] font-medium text-faint">{packingOrder.service}</span>
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[8.5px] tracking-[0.1em] text-faint uppercase">Penerima</p>
                      <p className="text-[11px] font-semibold text-ink">{packingOrder.customer}</p>
                      <p className="mt-0.5 max-w-[190px] text-[9px] leading-snug text-ink-soft">
                        {packingOrder.address}
                      </p>
                      <p className="mt-0.5 text-[9px] text-faint">{packingOrder.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8.5px] tracking-[0.1em] text-faint uppercase">Berat</p>
                      <p className="text-[11px] font-semibold text-ink tabular-nums">{weight || '—'} kg</p>
                      <p className="mt-1 text-[8.5px] text-faint">1 paket</p>
                    </div>
                  </div>

                  <div className="my-3 flex h-12 items-end gap-[2px] overflow-hidden" aria-hidden="true">
                    {[3, 1, 2, 1, 4, 1, 2, 3, 1, 2, 1, 3, 2, 1, 4, 1, 2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 4, 1, 2, 1, 3, 2, 1, 2].map(
                      (width, index) => (
                        <span
                          key={index}
                          className="h-full bg-[#0f241b]"
                          style={{ width: `${width}px`, opacity: index % 7 === 0 ? 0.55 : 1 }}
                        />
                      ),
                    )}
                  </div>
                  <p className="text-center font-mono text-[10px] tracking-[0.18em] text-ink">
                    {packingOrder.awb}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-dashed border-line pt-2">
                    <div>
                      <p className="text-[8px] tracking-[0.1em] text-faint uppercase">Pengirim</p>
                      <p className="text-[9.5px] font-medium text-ink">PT Sinar Retail · WH-CKR-01</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] tracking-[0.1em] text-faint uppercase">Order</p>
                      <p className="font-mono text-[9px] text-ink">{packingOrder.id}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[9.5px] text-faint">
                <ShieldCheck className="size-3.5 text-[#16a34a]" />
                AWB dibuat via API kurir · resi tersimpan otomatis
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Packing list" subtitle="Dokumen dalam paket" action={<Badge tone="neutral">2 item</Badge>} />
            <PanelBody className="pt-0">
              <ul className="space-y-2">
                {packingOrder.items.map((item) => (
                  <li key={item.sku} className="flex items-center justify-between gap-2 border-b border-line pb-2 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-[10.5px] font-medium text-ink">{item.name}</p>
                      <p className="font-mono text-[9px] text-faint">{item.sku}</p>
                    </div>
                    <span className="text-[10.5px] text-ink-soft tabular-nums">×{item.qty}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded-xl bg-panel p-2.5">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-faint">Total item</span>
                  <span className="font-semibold text-ink">2 pcs</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-faint">Kemasan</span>
                  <span className="font-medium text-ink">Kardus M</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-faint">Insert promo</span>
                  <span className="font-medium text-ink">1 brosur</span>
                </div>
              </div>
            </PanelBody>
            <PanelFooter>
              <span className="inline-flex items-center gap-1">
                <Truck className="size-3" />
                Pickup JNE 13:00
              </span>
              <Link href="/outbound/shipping" className="font-medium text-[#12703f] hover:underline">
                Manifest
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>
    </div>
  )
}
