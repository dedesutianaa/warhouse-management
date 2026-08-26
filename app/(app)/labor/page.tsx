import Link from 'next/link'
import { Award, Download, Gauge, Timer, TrendingUp, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { Avatar } from '@/components/ui-kit/avatar'
import { buttonStyles } from '@/components/ui-kit/button'
import { labor } from '@/lib/data'

const hourly = [
  { hour: '08', value: 42 },
  { hour: '09', value: 68 },
  { hour: '10', value: 84 },
  { hour: '11', value: 96 },
  { hour: '12', value: 58 },
  { hour: '13', value: 72 },
  { hour: '14', value: 100 },
  { hour: '15', value: 88 },
]

export default function LaborPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Tenaga Kerja"
        description="Produktivitas, akurasi, idle time, dan perencanaan headcount per shift."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Download className="size-3.5" />
              Ekspor
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Users className="size-3.5" />
              Labor planning
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Operator aktif" value="24" hint="Shift 1 · 3 zona" icon={<Users className="size-4" />} />
        <StatCard label="Lines per jam" value="186" delta="8,4%" hint="vs kemarin" icon={<TrendingUp className="size-4" />} tone="blue" />
        <StatCard label="Akurasi" value="99,4%" delta="0,3%" hint="30 hari" icon={<Gauge className="size-4" />} tone="violet" />
        <StatCard label="Idle time" value="9%" delta="2%" deltaTone="down" hint="lebih baik" icon={<Timer className="size-4" />} tone="amber" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Produktivitas operator"
            subtitle="Shift 1 · 22 November 2026"
            action={<Badge tone="mint">7 operator</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['Operator', 'Peran', 'Lines', 'Unit', 'Akurasi', 'Idle', 'Zona'].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {labor.map((person) => (
                  <tr key={person.name} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Avatar name={person.name} size="sm" />
                        <div>
                          <p className="text-[11px] font-semibold text-ink">{person.name}</p>
                          <p className="text-[9.5px] text-faint">{person.shift}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[10.5px] text-ink-soft">{person.role}</td>
                    <td className="px-4 py-2.5 text-[11px] font-medium text-ink tabular-nums">{person.lines}</td>
                    <td className="px-4 py-2.5 text-[11px] text-ink-soft tabular-nums">{person.units}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex w-24 items-center gap-2">
                        <Progress value={person.accuracy} tone="green" className="h-1" />
                        <span className="text-[9.5px] text-ink-soft tabular-nums">{person.accuracy}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[10.5px] text-ink-soft tabular-nums">{person.idle}%</td>
                    <td className="px-4 py-2.5">
                      <span className="rounded-md bg-panel px-1.5 py-0.5 font-mono text-[9.5px] text-ink-soft">
                        {person.zone}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelFooter>
            <span>Target lines/jam: 160</span>
            <span>Idle time dihitung dari jeda task</span>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Throughput per jam" subtitle="Line diselesaikan" action={<Badge tone="neutral">Shift 1</Badge>} />
            <PanelBody className="pt-0">
              <div className="flex h-32 items-end gap-2">
                {hourly.map((item) => (
                  <div key={item.hour} className="flex flex-1 flex-col items-center gap-1.5">
                    <div className="flex h-24 w-full items-end">
                      <div
                        className={`w-full rounded-t-md ${item.value === 100 ? 'bg-brand' : 'bg-[#c9e9d4]'}`}
                        style={{ height: `${item.value}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-faint">{item.hour}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-line pt-3">
                <div>
                  <p className="text-[9.5px] text-faint">Peak</p>
                  <p className="text-[12px] font-semibold text-ink">14:00 · 100 line</p>
                </div>
                <div>
                  <p className="text-[9.5px] text-faint">Rata-rata</p>
                  <p className="text-[12px] font-semibold text-ink">76 line/jam</p>
                </div>
              </div>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Kebutuhan headcount" subtitle="Prediksi dari backlog & cut-off" />
            <PanelBody className="space-y-2.5 pt-0">
              {[
                { shift: 'Shift 1 · 08–16', need: 24, available: 24 },
                { shift: 'Shift 2 · 16–24', need: 18, available: 14 },
                { shift: 'Shift 3 · 00–08', need: 8, available: 8 },
              ].map((row) => (
                <div key={row.shift}>
                  <div className="mb-1 flex items-center justify-between text-[10px]">
                    <span className="text-ink-soft">{row.shift}</span>
                    <span className={`font-semibold tabular-nums ${row.available < row.need ? 'text-[#b42318]' : 'text-ink'}`}>
                      {row.available}/{row.need}
                    </span>
                  </div>
                  <Progress
                    value={(row.available / row.need) * 100}
                    tone={row.available < row.need ? 'rose' : 'green'}
                  />
                </div>
              ))}
              <p className="text-[9.5px] leading-relaxed text-faint">
                Shift 2 kekurangan 4 operator — pertimbangkan overtime atau reassign.
              </p>
            </PanelBody>
            <PanelFooter>
              <span>Berdasarkan 1.284 order</span>
              <Link href="/tasks" className="font-medium text-[#12703f] hover:underline">
                Task board
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHeader title="Skill & sertifikasi" subtitle="Syarat untuk task tertentu" icon={<Award className="size-3.5 text-[#16a34a]" />} />
        <PanelBody className="grid grid-cols-1 gap-2.5 pt-0 sm:grid-cols-3">
          {[
            { skill: 'Forklift', certified: 8, total: 24, tone: 'success' as const },
            { skill: 'Hazmat handling', certified: 4, total: 24, tone: 'warning' as const },
            { skill: 'Cold chain', certified: 6, total: 24, tone: 'info' as const },
          ].map((item) => (
            <div key={item.skill} className="rounded-xl border border-line p-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-ink">{item.skill}</p>
                <Badge tone={item.tone}>{item.certified} tersertifikasi</Badge>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Progress value={(item.certified / item.total) * 100} tone="green" />
                <span className="text-[9.5px] text-faint tabular-nums">{item.certified}/{item.total}</span>
              </div>
            </div>
          ))}
        </PanelBody>
      </Panel>
    </div>
  )
}
