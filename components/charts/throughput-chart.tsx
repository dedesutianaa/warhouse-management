'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Point = { label: string; inbound: number; outbound: number }

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ name?: string; value?: number; color?: string }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-line bg-white px-3 py-2 shadow-[0_10px_30px_-12px_rgba(15,36,27,0.25)]">
      <p className="mb-1.5 text-[10px] font-semibold tracking-wide text-faint uppercase">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-[11px]">
          <span className="size-1.5 rounded-full" style={{ background: entry.color }} />
          <span className="text-faint">{entry.name}</span>
          <span className="ml-auto font-semibold text-ink tabular-nums">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function ThroughputChart({ data, height = 220 }: { data: Point[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 4, left: 0, bottom: 0 }} barGap={3}>
          <CartesianGrid vertical={false} stroke="#eef2ec" strokeDasharray="3 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: '#9aa79f' }}
            dy={6}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: '#9aa79f' }}
            width={44}
            tickFormatter={(value: number) => (value >= 1000 ? `${value / 1000}k` : `${value}`)}
          />
          <Tooltip cursor={{ fill: '#f4f8f2' }} content={<ChartTooltip />} />
          <Bar dataKey="inbound" name="Inbound" fill="#c9e9d4" radius={[3, 3, 0, 0]} maxBarSize={11} />
          <Bar dataKey="outbound" name="Outbound" fill="#0e3b2e" radius={[3, 3, 0, 0]} maxBarSize={11} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
