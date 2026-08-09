import { cn } from '@/lib/utils'

export function MiniSpark({
  data,
  color = '#16a34a',
  className,
}: {
  data: number[]
  color?: string
  className?: string
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const points = data
    .map((value, index) => {
      const x = (index / Math.max(1, data.length - 1)) * 100
      const y = 30 - ((value - min) / range) * 26
      return `${x.toFixed(2)},${y.toFixed(2)}`
    })
    .join(' ')

  return (
    <svg
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn('h-8 w-full', className)}
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
