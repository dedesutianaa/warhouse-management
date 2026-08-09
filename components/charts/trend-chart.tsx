'use client'

import {
  Area,
  AreaChart,
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

export function TrendChart({ data, height = 240 }: { data: Point[]; height?: number }) {
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 6, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="fillOutbound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0e3b2e" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#0e3b2e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="fillInbound" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ade80" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#4ade80" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="inbound"
            name="Inbound"
            stroke="#4ade80"
            strokeWidth={2}
            fill="url(#fillInbound)"
          />
          <Area
            type="monotone"
            dataKey="outbound"
            name="Outbound"
            stroke="#0e3b2e"
            strokeWidth={2}
            fill="url(#fillOutbound)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
