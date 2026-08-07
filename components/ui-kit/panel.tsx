import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Panel({ className, ...props }: ComponentProps<'section'>) {
  return (
    <section
      className={cn('rounded-2xl border border-line bg-surface', className)}
      {...props}
    />
  )
}

export function PanelHeader({
  title,
  subtitle,
  action,
  icon,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-3 px-5 pt-4 pb-3', className)}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="truncate text-[13.5px] font-semibold text-ink">{title}</h2>
        </div>
        {subtitle ? <p className="mt-0.5 text-[11.5px] text-faint">{subtitle}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center gap-1.5">{action}</div> : null}
    </div>
  )
}

export function PanelBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('px-5 pb-5', className)} {...props} />
}

export function PanelFooter({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-t border-line px-5 py-3 text-[11.5px] text-faint',
        className,
      )}
      {...props}
    />
  )
}
