'use client'

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

export type DonutSegment = {
  label: string
  value: number
  color: string
  hint?: string
}

export function CapacityDonut({
  segments,
  centerValue,
  centerLabel,
  size = 168,
}: {
  segments: DonutSegment[]
  centerValue: string
  centerLabel: string
  size?: number
}) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              innerRadius="68%"
              outerRadius="94%"
              paddingAngle={2}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {segments.map((segment) => (
                <Cell key={segment.label} fill={segment.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[22px] leading-none font-semibold tracking-tight text-ink tabular-nums">
            {centerValue}
          </span>
          <span className="mt-1 text-[9.5px] font-medium tracking-wide text-faint uppercase">{centerLabel}</span>
        </div>
      </div>
      <ul className="w-full space-y-2">
        {segments.map((segment) => (
          <li key={segment.label} className="flex items-center gap-2 text-[11px]">
            <span className="size-2 shrink-0 rounded-full" style={{ background: segment.color }} />
            <span className="flex-1 truncate text-ink-soft">{segment.label}</span>
            <span className="font-semibold text-ink tabular-nums">{segment.value}%</span>
            {segment.hint ? (
              <span className="hidden w-10 text-right text-[10px] text-faint 2xl:inline">{segment.hint}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
