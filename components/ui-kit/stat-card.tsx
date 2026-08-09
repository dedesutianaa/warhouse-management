import type { ReactNode } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconTones = {
  mint: 'bg-mint text-[#12703f]',
  blue: 'bg-[#eaf2fe] text-[#1d4ed8]',
  amber: 'bg-[#fef6e7] text-[#b45309]',
  violet: 'bg-[#f1ecfe] text-[#6d28d9]',
  rose: 'bg-[#fdecec] text-[#b42318]',
  slate: 'bg-[#f2f5f1] text-[#5b6b61]',
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaTone = 'up',
  hint,
  icon,
  tone = 'mint',
  className,
  footer,
  spark,
}: {
  label: string
  value: ReactNode
  unit?: string
  delta?: string
  deltaTone?: 'up' | 'down' | 'flat'
  hint?: string
  icon?: ReactNode
  tone?: keyof typeof iconTones
  className?: string
  footer?: ReactNode
  spark?: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex flex-col rounded-2xl border border-line bg-surface p-4',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[11.5px] font-medium text-faint">{label}</span>
        {icon ? (
          <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg', iconTones[tone])}>
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex items-end gap-1.5">
        <span className="text-[24px] leading-none font-semibold tracking-tight text-ink tabular-nums">
          {value}
        </span>
        {unit ? <span className="pb-0.5 text-[11px] text-faint">{unit}</span> : null}
      </div>
      {delta || hint ? (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          {delta ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium',
                deltaTone === 'up' && 'bg-[#e8f5ec] text-[#12703f]',
                deltaTone === 'down' && 'bg-[#fdecec] text-[#b42318]',
                deltaTone === 'flat' && 'bg-[#f2f5f1] text-[#5b6b61]',
              )}
            >
              {deltaTone === 'up' ? <ArrowUpRight className="size-3" /> : null}
              {deltaTone === 'down' ? <ArrowDownRight className="size-3" /> : null}
              {delta}
            </span>
          ) : null}
          {hint ? <span className="text-faint">{hint}</span> : null}
        </div>
      ) : null}
      {spark ? <div className="mt-auto pt-3">{spark}</div> : null}
      {footer ? <div className={spark ? 'mt-1' : 'mt-3'}>{footer}</div> : null}
    </div>
  )
}
