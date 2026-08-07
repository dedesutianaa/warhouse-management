import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type BadgeTone =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'brand'
  | 'violet'
  | 'mint'

const tones: Record<BadgeTone, string> = {
  success: 'bg-[#e8f5ec] text-[#12703f] ring-[#cdebd8]',
  warning: 'bg-[#fef6e7] text-[#96600a] ring-[#f6e3bd]',
  danger: 'bg-[#fdecec] text-[#b42318] ring-[#f7d2d0]',
  info: 'bg-[#eaf2fe] text-[#1d4ed8] ring-[#d3e2fb]',
  neutral: 'bg-[#f2f5f1] text-[#5b6b61] ring-[#e3e9e0]',
  brand: 'bg-brand text-white ring-brand',
  violet: 'bg-[#f1ecfe] text-[#6d28d9] ring-[#e2d8fb]',
  mint: 'bg-mint text-brand ring-mint-2',
}

const dotTones: Record<BadgeTone, string> = {
  success: 'bg-[#16a34a]',
  warning: 'bg-[#d97706]',
  danger: 'bg-[#dc2626]',
  info: 'bg-[#2563eb]',
  neutral: 'bg-[#94a39a]',
  brand: 'bg-white',
  violet: 'bg-[#7c3aed]',
  mint: 'bg-[#16a34a]',
}

export function Badge({
  children,
  tone = 'neutral',
  dot = false,
  className,
}: {
  children: ReactNode
  tone?: BadgeTone
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {dot ? <span className={cn('size-1.5 rounded-full', dotTones[tone])} /> : null}
      {children}
    </span>
  )
}

const statusToneMap: Record<string, BadgeTone> = {
  // outbound
  Draft: 'neutral',
  Created: 'neutral',
  Allocated: 'info',
  Backorder: 'warning',
  Short: 'warning',
  Released: 'info',
  Picking: 'violet',
  Picked: 'violet',
  Packing: 'warning',
  Packed: 'warning',
  Staged: 'mint',
  Shipped: 'success',
  Delivered: 'success',
  'On Hold': 'danger',
  Cancelled: 'danger',
  // inbound
  Menunggu: 'neutral',
  'Menunggu Dock': 'neutral',
  Receiving: 'info',
  'QC': 'violet',
  Putaway: 'warning',
  Selesai: 'success',
  Diterima: 'success',
  // inventory
  Available: 'success',
  Hold: 'warning',
  Quarantine: 'warning',
  Damaged: 'danger',
  Expired: 'danger',
  'In-Transit': 'violet',
  Blocked: 'danger',
  // tasks
  Tersedia: 'neutral',
  Berjalan: 'info',
  'Menunggu Review': 'warning',
  SelesaiTask: 'success',
  // generic
  Aktif: 'success',
  Nonaktif: 'neutral',
  Pending: 'warning',
  Approved: 'success',
  Rejected: 'danger',
  Sukses: 'success',
  Gagal: 'danger',
  Retry: 'warning',
  Terhubung: 'success',
  Terputus: 'danger',
  Normal: 'success',
  Rendah: 'info',
  Tinggi: 'warning',
  Kritis: 'danger',
  A: 'success',
  B: 'info',
  C: 'neutral',
}

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge tone={statusToneMap[status] ?? 'neutral'} dot className={className}>
      {status === 'SelesaiTask' ? 'Selesai' : status}
    </Badge>
  )
}
