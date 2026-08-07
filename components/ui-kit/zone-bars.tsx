'use client'

import { cn } from '@/lib/utils'

interface ZoneBarsProps {
  label: string
  used: number
  capacity: number
  hint?: string
  className?: string
}

export function ZoneBars({ label, used, capacity, hint, className }: ZoneBarsProps) {
  const percentage = capacity > 0 ? Math.min(100, Math.round((used / capacity) * 100)) : 0
  const isHigh = percentage >= 85
  const isMedium = percentage >= 70

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between">
        <span className="text-[10.5px] font-medium text-ink truncate pr-2">{label}</span>
        <span className="text-[10px] font-mono tabular-nums text-ink-soft">
          {used} / {capacity}
        </span>
      </div>
      <div className="h-2 bg-line rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300',
            isHigh ? 'bg-[#dc2626]' : isMedium ? 'bg-[#b45309]' : 'bg-[#16a34a]'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {hint && (
        <p className="text-[9px] text-faint">{hint} · {percentage}% terpakai</p>
      )}
    </div>
  )
}