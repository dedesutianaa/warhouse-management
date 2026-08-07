'use client'

import { ChevronDown, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SearchField({
  value,
  onChange,
  placeholder = 'Cari…',
  className,
  shortcut,
}: {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  shortcut?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#9aa79f]" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-xl border border-line bg-white pr-3 pl-8.5 text-[12px] text-ink placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
      />
      {shortcut ? (
        <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-line bg-panel px-1.5 py-0.5 font-mono text-[9.5px] text-faint">
          {shortcut}
        </kbd>
      ) : null}
    </div>
  )
}

export function FilterSelect({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 w-full appearance-none rounded-xl border border-line bg-white pr-8 pl-3 text-[12px] font-medium text-ink-soft focus:border-[#bcd6c2] focus:ring-2 focus:ring-accent/15 focus:outline-none"
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-3.5 -translate-y-1/2 text-[#9aa79f]" />
    </div>
  )
}

export function Toolbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between', className)}>
      {children}
    </div>
  )
}
