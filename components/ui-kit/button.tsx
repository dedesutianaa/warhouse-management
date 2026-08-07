import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'mint' | 'danger' | 'dark'
type Size = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

const variants: Record<Variant, string> = {
  primary:
    'bg-brand text-white shadow-[0_1px_2px_rgba(14,59,46,0.28)] hover:bg-brand-2 active:bg-[#0a2f24]',
  secondary:
    'border border-line-strong bg-white text-ink hover:bg-panel hover:border-[#cbd8c7]',
  ghost: 'text-ink-soft hover:bg-panel hover:text-ink',
  mint: 'bg-mint text-brand hover:bg-mint-2',
  danger: 'bg-[#fdecec] text-[#b42318] hover:bg-[#fbdcdc]',
  dark: 'bg-[#0f241b] text-white hover:bg-[#1a3a2c]',
}

const sizes: Record<Size, string> = {
  sm: 'h-8 gap-1.5 rounded-lg px-2.5 text-[11.5px]',
  md: 'h-9 gap-1.5 rounded-xl px-3.5 text-[12.5px]',
  lg: 'h-10 gap-2 rounded-xl px-4 text-[13px]',
  icon: 'size-9 rounded-xl',
  'icon-sm': 'size-8 rounded-lg',
}

export function buttonStyles({
  variant = 'secondary',
  size = 'md',
  className,
}: {
  variant?: Variant
  size?: Size
  className?: string
} = {}) {
  return cn(
    'inline-flex shrink-0 items-center justify-center font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  ...props
}: ComponentProps<'button'> & { variant?: Variant; size?: Size }) {
  return <button className={buttonStyles({ variant, size, className })} {...props} />
}
