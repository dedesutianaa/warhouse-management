import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      {icon ? (
        <div className="mb-3 grid size-11 place-items-center rounded-2xl bg-panel text-[#8a988f]">{icon}</div>
      ) : null}
      <p className="text-[13px] font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-sm text-[11.5px] text-faint">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
