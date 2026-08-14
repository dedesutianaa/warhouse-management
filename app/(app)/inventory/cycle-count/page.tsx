import Link from 'next/link'
import {
  ArrowLeft,
  CalendarClock,
  ClipboardList,
  EyeOff,
  Plus,
  ScanSearch,
  Sparkles,
  Target,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { buttonStyles } from '@/components/ui-kit/button'
import { cycleCounts } from '@/lib/data'

export default function CycleCountPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inventori', 'Cycle Count']}
        title="Cycle Count"
        description="Penghitungan stok terjadwal berbasis klasifikasi ABC, event-driven, dan ad hoc — tanpa menutup gudang."
        actions={
          <>
            <Link href="/inventory" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Inventori
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <CalendarClock className="size-3.5" />
              Jadwalkan
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Mulai hitung
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Count berjalan" value="1" hint="Zona A · 48 bin" icon={<ClipboardList className="size-4" />} />
        <StatCard label="Lokasi dihitung" value="48" hint="62% selesai" icon={<ScanSearch className="size-4" />} tone="blue" />
        <StatCard label="Selisih ditemukan" value="2" hint="perlu recount" icon={<Target className="size-4" />} tone="amber" />
        <StatCard label="Akurasi stok" value="99,2%" delta="0,6%" hint="30 hari" icon={<Sparkles className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Daftar cycle count"
            subtitle="Terjadwal, event-driven, dan ad hoc"
            action={<Badge tone="mint">5 dokumen</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['ID / Scope', 'Tipe', 'Lokasi', 'Progres', 'Selisih', 'Status', 'Jatuh tempo'].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cycleCounts.map((count) => (
                  <tr key={count.id} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-semibold whitespace-nowrap text-ink">{count.id}</p>
                      <p className="text-[10px] text-faint">{count.scope}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={count.type === 'Terjadwal' ? 'info' : count.type === 'Ad hoc' ? 'neutral' : 'violet'}>
                        {count.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-[11px] text-ink-soft tabular-nums">{count.locations}</td>
                    <td className="px-4 py-3">
                      <div className="flex w-28 items-center gap-2">
                        <Progress value={count.progress} tone={count.progress === 100 ? 'green' : 'dark'} />
                        <span className="text-[9.5px] text-faint tabular-nums">{count.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[11px] font-semibold tabular-nums ${
                          count.variance > 0 ? 'text-[#b42318]' : 'text-[#12703f]'
                        }`}
                      >
                        {count.variance > 0 ? `−${count.variance}` : '0'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={count.status} />
                    </td>
                    <td className="px-4 py-3 text-[10.5px] text-ink-soft">{count.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelFooter>
            <span>Blind count aktif · recount otomatis di luar toleransi</span>
            <span>Freeze lokasi saat dihitung</span>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader
              title="Count aktif"
              subtitle="CC-2026-0078 · Zona A"
              action={<Badge tone="info" dot>Berjalan</Badge>}
            />
            <PanelBody className="space-y-3 pt-0">
              <div className="rounded-xl border border-line bg-[#fafcf9] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9.5px] text-faint">Lokasi saat ini</p>
                    <p className="font-mono text-[15px] font-semibold text-ink">A-01-02-03</p>
                  </div>
                  <Badge tone="neutral">
                    <EyeOff className="mr-0.5 size-2.5" />
                    Blind
                  </Badge>
                </div>
                <p className="mt-1 text-[10px] text-faint">Kopi Arabika Gayo 250g · LOT-2611-A</p>
              </div>

              <div>
                <label htmlFor="count" className="mb-1 block text-[10px] font-medium text-faint">
                  Qty hasil hitung
                </label>
                <input
                  id="count"
                  placeholder="Masukkan qty fisik…"
                  inputMode="numeric"
                  className="h-10 w-full rounded-xl border border-line bg-white px-3 text-[12px] text-ink tabular-nums placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-panel p-2.5">
                  <p className="text-[9.5px] text-faint">Bin selesai</p>
                  <p className="text-[15px] font-semibold text-ink tabular-nums">30/48</p>
                </div>
                <div className="rounded-xl bg-panel p-2.5">
                  <p className="text-[9.5px] text-faint">Selisih</p>
                  <p className="text-[15px] font-semibold text-[#b42318] tabular-nums">2</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#f6e3bd] bg-[#fef9ee] p-2.5 text-[10px] leading-relaxed text-[#96600a]">
                Selisih melewati toleransi 1% → recount otomatis dibuat untuk bin B-03-02-01.
              </div>

              <div className="flex gap-2">
                <button className={buttonStyles({ variant: 'primary', className: 'flex-1' })}>Simpan hitungan</button>
                <button className={buttonStyles({ variant: 'secondary' })}>Recount</button>
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Jadwal klasifikasi ABC" subtitle="Coverage minimal per kelas" />
            <PanelBody className="space-y-3 pt-0">
              {[
                { label: 'Kelas A · fast moving', coverage: 100, target: '1× per bulan' },
                { label: 'Kelas B · medium', coverage: 72, target: '1× per kuartal' },
                { label: 'Kelas C · slow moving', coverage: 38, target: '1× per semester' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-[10.5px]">
                    <span className="text-ink-soft">{item.label}</span>
                    <span className="font-semibold text-ink tabular-nums">{item.coverage}%</span>
                  </div>
                  <Progress value={item.coverage} tone={item.coverage >= 100 ? 'green' : 'amber'} />
                  <p className="mt-0.5 text-[9px] text-faint">{item.target}</p>
                </div>
              ))}
            </PanelBody>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHeader
          title="Rekomendasi SKU berisiko"
          subtitle="Berdasarkan riwayat selisih dan pergerakan"
          icon={<Sparkles className="size-3.5 text-[#16a34a]" />}
        />
        <PanelBody className="grid grid-cols-1 gap-2.5 pt-0 sm:grid-cols-3">
          {[
            { sku: 'SKU-4520', name: 'Serum Vitamin C 30ml', reason: '3 selisih dalam 30 hari', score: 92 },
            { sku: 'SKU-7412', name: 'Masker Wajah Aloe 10pcs', reason: 'Pergerakan tinggi · lot kecil', score: 84 },
            { sku: 'SKU-8890', name: 'Beras Organik 5kg', reason: 'Selisih berat saat terima', score: 76 },
          ].map((item) => (
            <div key={item.sku} className="rounded-xl border border-line p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold text-ink">{item.name}</p>
                  <p className="font-mono text-[9.5px] text-faint">{item.sku}</p>
                </div>
                <Badge tone="warning">{item.score}</Badge>
              </div>
              <p className="mt-1.5 text-[10px] text-ink-soft">{item.reason}</p>
              <button className={buttonStyles({ variant: 'secondary', size: 'sm', className: 'mt-2 w-full' })}>
                Tambah ke count
              </button>
            </div>
          ))}
        </PanelBody>
      </Panel>
    </div>
  )
}
