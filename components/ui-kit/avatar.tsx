import { cn } from '@/lib/utils'
import { initials } from '@/lib/format'

const palettes = [
  'bg-[#e8f5ec] text-[#12703f]',
  'bg-[#eaf2fe] text-[#1d4ed8]',
  'bg-[#f1ecfe] text-[#6d28d9]',
  'bg-[#fef6e7] text-[#96600a]',
  'bg-[#fdecec] text-[#b42318]',
  'bg-[#e6f4f1] text-[#0f766e]',
]

const sizes = {
  xs: 'size-6 text-[9px]',
  sm: 'size-7 text-[10px]',
  md: 'size-8 text-[11px]',
  lg: 'size-10 text-[12px]',
  xl: 'size-12 text-[14px]',
}

export function Avatar({
  name,
  size = 'md',
  className,
  ring = false,
}: {
  name: string
  size?: keyof typeof sizes
  className?: string
  ring?: boolean
}) {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return (
    <span
      title={name}
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-semibold tracking-wide',
        palettes[hash % palettes.length],
        sizes[size],
        ring && 'ring-2 ring-white',
        className,
      )}
    >
      {initials(name)}
    </span>
  )
}
