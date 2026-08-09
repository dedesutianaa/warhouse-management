import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  breadcrumb,
  actions,
  className,
  children,
}: {
  title: ReactNode
  description?: ReactNode
  breadcrumb?: string[]
  actions?: ReactNode
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          {breadcrumb?.length ? (
            <nav aria-label="Breadcrumb" className="mb-1.5 flex items-center gap-1 text-[11px] text-faint">
              {breadcrumb.map((crumb, index) => (
                <span key={crumb} className="flex items-center gap-1">
                  {index > 0 ? <ChevronRight className="size-3 text-[#b3bfb7]" /> : null}
                  <span className={index === breadcrumb.length - 1 ? 'text-ink-soft' : ''}>{crumb}</span>
                </span>
              ))}
            </nav>
          ) : null}
          <h1 className="text-[22px] leading-tight font-semibold tracking-tight text-ink">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-faint">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
      {children}
    </div>
  )
}
