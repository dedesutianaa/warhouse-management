import Link from 'next/link'
import { ChevronRight, Grid3x3, MapPin, Plus, Snowflake, Warehouse } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { buttonStyles } from '@/components/ui-kit/button'
import { locations } from '@/lib/data'

const mapCells = Array.from({ length: 80 }, (_, index) => {
  const base = [82, 64, 91, 48, 76, 88, 55, 34, 72, 96][index % 10]
  return Math.min(99, base + ((index * 7) % 9) - 4)
})

function cellTone(value: number) {
  if (value >= 90) return 'bg-[#dc2626]/80'
  if (value >= 75) return 'bg-[#d97706]/75'
  if (value >= 50) return 'bg-[#16a34a]/70'
  return 'bg-[#c9e9d4]'
}

export default function LocationsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Lokasi Gudang"
        description="Hierarki site, zona, aisle, rak, level, dan bin — lengkap dengan kapasitas dan restriksi."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Grid3x3 className="size-3.5" />
              Generator rentang
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Tambah lokasi
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total bin" value="1.400" hint="4 zona · 12 aisle" icon={<Warehouse className="size-4" />} />
        <StatCard label="Bin terpakai" value="1.004" hint="76% okupansi" icon={<MapPin className="size-4" />} tone="blue" />
        <StatCard label="Bin diblokir" value="12" hint="hold & maintenance" icon={<Snowflake className="size-4" />} tone="amber" />
        <StatCard label="Kapasitas terpakai" value="82%" delta="4%" hint="vs bulan lalu" icon={<Grid3x3 className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Daftar lokasi"
            subtitle="14 bin contoh · semua zona"
            action={<Badge tone="mint">1.400 bin</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['Kode bin', 'Zona', 'Tipe', 'Kapasitas', 'Status', 'Restriksi'].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {locations.map((location) => {
                  const pct = Math.round((location.used / location.capacity) * 100)
                  return (
                    <tr key={location.code} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                      <td className="px-4 py-2.5">
                        <span className="rounded-md bg-mint px-1.5 py-0.5 font-mono text-[10.5px] font-semibold text-[#12703f]">
                          {location.code}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-[10.5px] text-ink-soft">Zona {location.zone}</td>
                      <td className="px-4 py-2.5 text-[10.5px] text-ink-soft">{location.type}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex w-32 items-center gap-2">
                          <Progress value={pct} tone={pct >= 95 ? 'amber' : 'green'} className="h-1" />
                          <span className="text-[9.5px] text-faint tabular-nums">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <StatusBadge status={location.status} />
                      </td>
                      <td className="px-4 py-2.5 text-[10px] text-ink-soft">{location.restriction}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <PanelFooter>
            <span>Kapasitas dihitung dari berat, volume, dan pallet</span>
            <span>14 dari 1.400 bin</span>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Hierarki gudang" subtitle="WH-CKR-01 · Cikarang" />
            <PanelBody className="pt-0">
              <ul className="space-y-1 text-[10.5px]">
                <li className="flex items-center gap-1.5 font-semibold text-ink">
                  <Warehouse className="size-3.5 text-[#16a34a]" />
                  Gudang Cikarang
                </li>
                {[
                  { zone: 'Zona A · Fast moving', bins: 400, aisles: 'A-01 – A-04' },
                  { zone: 'Zona B · Ambient', bins: 400, aisles: 'B-01 – B-04' },
                  { zone: 'Zona C · Cool room', bins: 200, aisles: 'C-01 – C-02' },
                  { zone: 'Zona D · Bulk', bins: 400, aisles: 'D-01 – D-02' },
                ].map((zone) => (
                  <li key={zone.zone} className="ml-1.5 border-l border-line pl-3">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-ink-soft">{zone.zone}</span>
                      <span className="text-[9px] text-faint tabular-nums">{zone.bins} bin</span>
                    </div>
                    <div className="flex items-center gap-1 pb-1 text-[9px] text-faint">
                      <ChevronRight className="size-2.5" />
                      {zone.aisles} · rak 3 level
                    </div>
                  </li>
                ))}
              </ul>
            </PanelBody>
            <PanelFooter>
              <span>Site › Zona › Aisle › Rak › Level › Bin</span>
            </PanelFooter>
          </Panel>

          <Panel>
            <PanelHeader title="Generator rentang" subtitle="Buat bin massal" />
            <PanelBody className="space-y-2 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="from" className="mb-1 block text-[9.5px] text-faint">
                    Dari
                  </label>
                  <input
                    id="from"
                    defaultValue="A-01-01-01"
                    className="h-8 w-full rounded-lg border border-line bg-white px-2 font-mono text-[10px] text-ink focus:border-[#bcd6c2] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="to" className="mb-1 block text-[9.5px] text-faint">
                    Sampai
                  </label>
                  <input
                    id="to"
                    defaultValue="A-20-04-04"
                    className="h-8 w-full rounded-lg border border-line bg-white px-2 font-mono text-[10px] text-ink focus:border-[#bcd6c2] focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-panel px-2.5 py-2 text-[10px]">
                <span className="text-faint">Akan dibuat</span>
                <span className="font-semibold text-ink">320 bin</span>
              </div>
              <button className={buttonStyles({ variant: 'primary', className: 'w-full' })}>Generate bin</button>
            </PanelBody>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHeader
          title="Peta layout 2D"
          subtitle="Heatmap okupansi bin · Zona A"
          action={
            <div className="flex items-center gap-2.5 text-[9px] text-faint">
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-sm bg-[#c9e9d4]" /> &lt;50%
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-sm bg-[#16a34a]/70" /> 50–74%
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-sm bg-[#d97706]/75" /> 75–89%
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="size-2 rounded-sm bg-[#dc2626]/80" /> ≥90%
              </span>
            </div>
          }
        />
        <PanelBody className="pt-0">
          <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-20">
            {mapCells.map((value, index) => (
              <div
                key={index}
                title={`Bin ${String(index + 1).padStart(3, '0')} · ${value}% terpakai`}
                className={`aspect-square rounded-[3px] ${cellTone(value)} transition-transform hover:scale-110`}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-faint">
            <span>80 bin ditampilkan · klik bin untuk detail lokasi</span>
            <Link href="/inventory" className="font-medium text-[#12703f] hover:underline">
              Lihat stok per bin
            </Link>
          </div>
        </PanelBody>
      </Panel>
    </div>
  )
}
