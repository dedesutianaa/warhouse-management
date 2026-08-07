'use client'

import { cn } from '@/lib/utils'

export type TabItem = {
  value: string
  label: string
  count?: number
}

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'no-scrollbar flex w-full items-center gap-1 overflow-x-auto rounded-xl bg-[#f1f5ef] p-1 sm:w-auto',
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              'inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors',
              active
                ? 'bg-white text-ink shadow-[0_1px_2px_rgba(15,36,27,0.08)]'
                : 'text-[#6b7a71] hover:text-ink',
            )}
          >
            {item.label}
            {typeof item.count === 'number' ? (
              <span
                className={cn(
                  'rounded-md px-1.5 py-px text-[10px] font-semibold tabular-nums',
                  active ? 'bg-mint text-[#12703f]' : 'bg-white/70 text-[#7d8b82]',
                )}
              >
                {item.count}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

export function Segmented({
  items,
  value,
  onChange,
  className,
}: {
  items: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex items-center rounded-lg border border-line bg-white p-0.5', className)}>
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            'rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors',
            item.value === value ? 'bg-mint text-brand' : 'text-faint hover:text-ink',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
