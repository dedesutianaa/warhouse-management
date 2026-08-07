import { cn } from '@/lib/utils'

const tones = {
  green: 'bg-[#16a34a]',
  dark: 'bg-brand',
  amber: 'bg-[#d97706]',
  rose: 'bg-[#dc2626]',
  blue: 'bg-[#2563eb]',
  violet: 'bg-[#7c3aed]',
}

export function Progress({
  value,
  tone = 'green',
  className,
  trackClassName,
}: {
  value: number
  tone?: keyof typeof tones
  className?: string
  trackClassName?: string
}) {
  const clamped = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ec]', trackClassName, className)}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-500', tones[tone])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  )
}
