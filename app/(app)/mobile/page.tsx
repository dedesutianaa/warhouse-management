import {
  BatteryFull,
  Boxes,
  Check,
  ChevronLeft,
  ClipboardList,
  Download,
  Home,
  Languages,
  ListChecks,
  MapPin,
  Package,
  Printer,
  ScanLine,
  Settings,
  Signal,
  Smartphone,
  Sun,
  Vibrate,
  Volume2,
  Wifi,
  WifiOff,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui-kit/panel'
import { Badge } from '@/components/ui-kit/badge'
import { buttonStyles } from '@/components/ui-kit/button'

function PhoneFrame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative w-[236px] rounded-[34px] border-[7px] border-[#0f241b] bg-[#0f241b] shadow-[0_24px_50px_-30px_rgba(15,36,27,0.6)]">
        <div className="absolute top-1.5 left-1/2 z-20 h-1.5 w-14 -translate-x-1/2 rounded-full bg-[#0f241b]" />
        <div className="relative h-[410px] overflow-hidden rounded-[27px] bg-[#f4f7f2]">
          <div className="flex items-center justify-between px-3 pt-2 pb-1 text-[8px] font-medium text-ink-soft">
            <span>09:41</span>
            <span className="flex items-center gap-1">
              <Signal className="size-2.5" />
              <Wifi className="size-2.5" />
              <BatteryFull className="size-3" />
            </span>
          </div>
          {children}
        </div>
      </div>
      <span className="text-[10.5px] font-medium text-faint">{label}</span>
    </div>
  )
}

export default function MobilePage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Mobile RF"
        description="Aplikasi Android untuk handheld dan smartphone: scan-first, tombol besar, dan mode offline terbatas."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Download className="size-3.5" />
              Unduh APK
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Smartphone className="size-3.5" />
              Panduan operator
            </button>
          </>
        }
      />

      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3a2c] via-[#0f4634] to-[#14563c] p-5 text-white">
        <div className="pointer-events-none absolute -top-16 -right-10 size-56 rounded-full bg-[#4ade80]/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <Badge tone="mint">Android 10+ · handheld & smartphone</Badge>
            <h2 className="mt-2.5 text-[20px] leading-tight font-semibold tracking-tight">
              Satu layar, satu tugas. Operator selalu tahu langkah berikutnya.
            </h2>
            <p className="mt-1.5 text-[11.5px] leading-relaxed text-white/65">
              Alur terpandu untuk receiving, putaway, picking, move, count, dan pack dengan validasi scan di setiap
              langkah. Umpan balik suara, getar, dan warna untuk sukses atau error.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Scan 1D/2D & GS1', 'Mode offline', 'Tombol besar', 'ID / EN', 'Cetak label Bluetooth'].map((chip) => (
                <span key={chip} className="rounded-full bg-white/10 px-2.5 py-1 text-[9.5px] ring-1 ring-white/15">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[360px]">
            {[
              { label: 'Scan p95', value: '< 1 dtk' },
              { label: 'Onboarding', value: '≤ 3 hari' },
              { label: 'Scan adoption', value: '92%' },
              { label: 'Offline queue', value: '500 tx' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-white/8 p-2.5 ring-1 ring-white/10">
                <p className="text-[8.5px] text-white/50">{stat.label}</p>
                <p className="mt-0.5 text-[12px] font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Panel>
        <PanelHeader
          title="Preview layar operator"
          subtitle="Tiga alur utama: task, receiving, dan picking"
          action={<Badge tone="neutral">RF-014</Badge>}
        />
        <PanelBody className="flex flex-wrap justify-center gap-5 pt-1 pb-6">
            <PhoneFrame label="Home · daftar tugas">
              <div className="px-3">
                <div className="rounded-xl bg-brand p-2.5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[8px] text-white/55">Selamat pagi</p>
                      <p className="text-[11px] font-semibold">Sari Wulandari</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[7.5px] ring-1 ring-white/15">
                      Shift 1
                    </span>
                  </div>
                  <div className="mt-2 rounded-lg bg-white/10 p-2 ring-1 ring-white/10">
                    <p className="text-[7.5px] text-white/55">Task berikutnya</p>
                    <p className="text-[9.5px] font-semibold">Putaway LPN-88214</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[7.5px] text-white/65">
                      <MapPin className="size-2" />
                      A-01-02-03 · 240 pcs
                    </p>
                    <button className="mt-1.5 h-6 w-full rounded-md bg-[#d9f5e2] text-[8px] font-semibold text-[#0b3a2c]">
                      Mulai task
                    </button>
                  </div>
                </div>
                <div className="mt-2 space-y-1.5">
                  {[
                    { icon: Boxes, title: 'Putaway · LPN-88215', meta: 'A-02-01-01 · 180 pcs', tone: 'bg-mint text-[#12703f]' },
                    { icon: Package, title: 'Pick · WAVE-1122-01', meta: '3 line · Tote T-04', tone: 'bg-[#f1ecfe] text-[#6d28d9]' },
                    { icon: ClipboardList, title: 'Count · Zona A', meta: '48 bin · blind count', tone: 'bg-[#fef6e7] text-[#96600a]' },
                  ].map((task) => (
                    <div key={task.title} className="flex items-center gap-2 rounded-lg border border-line bg-white p-2">
                      <span className={`grid size-6 place-items-center rounded-md ${task.tone}`}>
                        <task.icon className="size-3" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[8.5px] font-semibold text-ink">{task.title}</p>
                        <p className="text-[7px] text-faint">{task.meta}</p>
                      </div>
                      <span className="text-[7px] font-medium text-[#12703f]">Buka</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center justify-between rounded-lg bg-white px-2 py-1.5 ring-1 ring-line">
                  {[Home, ListChecks, ScanLine, Settings].map((Icon, index) => (
                    <span
                      key={index}
                      className={`grid size-6 place-items-center rounded-md ${
                        index === 0 ? 'bg-mint text-[#12703f]' : 'text-[#9aa79f]'
                      }`}
                    >
                      <Icon className="size-3" />
                    </span>
                  ))}
                </div>
              </div>
            </PhoneFrame>

            <PhoneFrame label="Receiving · scan item">
              <div className="px-3">
                <div className="flex items-center gap-1.5">
                  <ChevronLeft className="size-3 text-ink-soft" />
                  <div>
                    <p className="text-[9px] font-semibold text-ink">Receiving</p>
                    <p className="text-[7px] text-faint">PO-2026-004182 · Dock 2</p>
                  </div>
                  <span className="ml-auto rounded-full bg-mint px-1.5 py-0.5 text-[7px] font-semibold text-[#12703f]">
                    70%
                  </span>
                </div>
                <div className="mt-2 grid place-items-center rounded-xl border-2 border-dashed border-[#9fdcb4] bg-white py-4">
                  <ScanLine className="size-6 text-[#16a34a]" />
                  <p className="mt-1 text-[8px] font-semibold text-ink">Scan barcode item</p>
                  <p className="text-[7px] text-faint">Arahkan kamera atau gunakan trigger</p>
                </div>
                <div className="mt-2 rounded-xl border border-line bg-white p-2">
                  <p className="text-[8.5px] font-semibold text-ink">Kopi Arabika Gayo 250g</p>
                  <p className="font-mono text-[7px] text-faint">SKU-1042 · LOT-2611-A</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    <div className="rounded-md bg-panel p-1.5">
                      <p className="text-[6.5px] text-faint">Ekspektasi</p>
                      <p className="text-[9px] font-semibold text-ink">480</p>
                    </div>
                    <div className="rounded-md bg-mint p-1.5">
                      <p className="text-[6.5px] text-[#12703f]">Diterima</p>
                      <p className="text-[9px] font-semibold text-[#12703f]">240</p>
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between rounded-md border border-line px-1.5 py-1">
                    <span className="text-[7px] text-faint">Qty</span>
                    <span className="text-[9px] font-semibold text-ink">240</span>
                  </div>
                </div>
                <button className="mt-2 h-8 w-full rounded-lg bg-brand text-[8.5px] font-semibold text-white">
                  Konfirmasi 240 pcs
                </button>
                <div className="mt-1.5 flex items-center justify-center gap-1.5 rounded-md bg-mint px-2 py-1 text-[7px] font-medium text-[#12703f]">
                  <Check className="size-2.5" />
                  Sukses · getar + bunyi
                </div>
              </div>
            </PhoneFrame>

            <PhoneFrame label="Picking · rute terpandu">
              <div className="px-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-semibold text-ink">Picking</p>
                    <p className="text-[7px] text-faint">WAVE-1122-01 · J&amp;T</p>
                  </div>
                  <span className="rounded-full bg-[#f1ecfe] px-1.5 py-0.5 text-[7px] font-semibold text-[#6d28d9]">
                    2/7
                  </span>
                </div>
                <div className="mt-2 rounded-xl bg-brand p-2.5 text-white">
                  <p className="text-[7px] tracking-[0.1em] text-white/55 uppercase">Lokasi saat ini</p>
                  <p className="mt-0.5 font-mono text-[16px] font-semibold">A-02-01-01</p>
                  <p className="text-[7px] text-white/60">Zona A · Rak 02 · Level 01</p>
                  <button className="mt-1.5 flex h-6 w-full items-center justify-center gap-1 rounded-md bg-white/15 text-[7.5px] font-semibold ring-1 ring-white/20">
                    <ScanLine className="size-2.5" />
                    Scan lokasi
                  </button>
                </div>
                <div className="mt-2 rounded-xl border border-line bg-white p-2">
                  <p className="text-[8.5px] font-semibold text-ink">Teh Hijau Melati 20 Bag</p>
                  <p className="font-mono text-[7px] text-faint">SKU-2087 · LOT-2611-B</p>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[7px] text-faint">Ambil</span>
                    <span className="text-[11px] font-semibold text-ink">3 pcs</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between rounded-md bg-panel px-1.5 py-1">
                    <span className="text-[7px] text-faint">Tote</span>
                    <span className="font-mono text-[7.5px] font-semibold text-ink">T-04</span>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center gap-1 rounded-md bg-[#fef9ee] px-2 py-1 text-[7px] text-[#96600a]">
                  <MapPin className="size-2.5" />
                  Berikutnya A-02-01-04 · 16 m
                </div>
                <button className="mt-2 h-8 w-full rounded-lg bg-brand text-[8.5px] font-semibold text-white">
                  Konfirmasi pick
                </button>
              </div>
            </PhoneFrame>
        </PanelBody>
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-8">
          <PanelHeader title="Fitur lapangan" subtitle="Dirancang untuk lingkungan gudang" />
          <PanelBody className="grid grid-cols-1 gap-2 pt-0 sm:grid-cols-2">
              {[
                { icon: ScanLine, title: 'Scan-first', detail: 'Setiap langkah dimulai dengan scan, bukan mengetik.' },
                { icon: WifiOff, title: 'Offline terbatas', detail: 'Antrean transaksi lokal & sinkronisasi otomatis.' },
                { icon: Vibrate, title: 'Umpan balik jelas', detail: 'Suara, getar, dan warna untuk sukses atau error.' },
                { icon: Printer, title: 'Cetak dari mobile', detail: 'Printer Bluetooth / jaringan, template ZPL.' },
                { icon: Languages, title: 'Dwi bahasa', detail: 'Bahasa Indonesia dan Inggris, format lokal.' },
                { icon: Sun, title: 'Kontras tinggi', detail: 'Tombol besar, satu tangan, mode terang/gelap.' },
              ].map((feature) => (
                <div key={feature.title} className="flex items-start gap-2.5 rounded-xl border border-line p-2.5">
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-mint text-[#12703f]">
                    <feature.icon className="size-3.5" />
                  </span>
                  <div>
                    <p className="text-[10.5px] font-semibold text-ink">{feature.title}</p>
                    <p className="mt-0.5 text-[9.5px] leading-relaxed text-faint">{feature.detail}</p>
                  </div>
                </div>
              ))}
          </PanelBody>
        </Panel>

        <Panel className="lg:col-span-4">
          <PanelHeader title="Perangkat teruji" subtitle="Kompatibilitas hardware" />
            <PanelBody className="space-y-2 pt-0">
              {[
                { name: 'Zebra TC22 / TC27', type: 'Handheld · Android 13' },
                { name: 'Honeywell EDA52', type: 'Handheld · Android 12' },
                { name: 'Smartphone 4–6 inci', type: 'Kamera · Android 10+' },
                { name: 'Zebra ZD421 · ZPL', type: 'Printer label' },
              ].map((device) => (
                <div key={device.name} className="flex items-center justify-between rounded-lg bg-panel px-2.5 py-2">
                  <div>
                    <p className="text-[10px] font-medium text-ink">{device.name}</p>
                    <p className="text-[8.5px] text-faint">{device.type}</p>
                  </div>
                  <Badge tone="success">Teruji</Badge>
                </div>
              ))}
          </PanelBody>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Volume2, title: 'Voice & wearable', detail: 'Fase 3 · voice picking dan ring scanner.' },
          { icon: ScanLine, title: 'Pick-to-light', detail: 'Fase 3 · integrasi lampu rak dan AR.' },
          { icon: Wifi, title: 'Sinkronisasi', detail: 'Konflik diselesaikan dengan timestamp server.' },
          { icon: Smartphone, title: 'MDM ready', detail: 'Distribusi APK otomatis & update terkontrol.' },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-line bg-white p-3.5">
            <span className="grid size-8 place-items-center rounded-lg bg-panel text-[#5b6b61]">
              <item.icon className="size-4" />
            </span>
            <p className="mt-2 text-[11px] font-semibold text-ink">{item.title}</p>
            <p className="mt-0.5 text-[10px] leading-relaxed text-faint">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
