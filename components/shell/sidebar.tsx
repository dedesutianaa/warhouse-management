'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ArrowUpRight,
  ChevronDown,
  HelpCircle,
  MapPin,
  Settings,
  Warehouse,
  X,
} from 'lucide-react'
import { navGroups } from '@/lib/nav'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui-kit/avatar'

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname()

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          'fixed inset-0 z-40 bg-[#0f241b]/30 backdrop-blur-[2px] transition-opacity lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[254px] shrink-0 flex-col border-r border-line bg-[#fbfcfa] transition-transform duration-300 lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-white shadow-[0_4px_12px_-4px_rgba(14,59,46,0.6)]">
              <Warehouse className="size-[18px]" strokeWidth={1.8} />
            </span>
            <span className="leading-none">
              <span className="block text-[14px] font-semibold tracking-[0.02em] text-ink">GUDANGKU</span>
              <span className="mt-1 block text-[9.5px] font-medium tracking-[0.16em] text-[#9aa79f] uppercase">
                Warehouse OS
              </span>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Tutup menu"
            className="grid size-8 place-items-center rounded-lg text-faint hover:bg-panel lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="px-3 pb-3">
          <button className="flex w-full items-center gap-2.5 rounded-xl border border-line bg-white px-2.5 py-2 text-left transition-colors hover:border-line-strong">
            <span className="grid size-7 place-items-center rounded-lg bg-mint text-[#12703f]">
              <MapPin className="size-3.5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[11.5px] font-semibold text-ink">Gudang Cikarang</span>
              <span className="block text-[9.5px] text-faint">WH-CKR-01 · Zona A–D</span>
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-[#9aa79f]" />
          </button>
        </div>

        <nav aria-label="Navigasi utama" className="thin-scrollbar flex-1 overflow-y-auto px-3 pb-3">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-4">
              <p className="mb-1.5 px-2.5 text-[9.5px] font-semibold tracking-[0.14em] text-[#a3afa7] uppercase">
                {group.title}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    item.href === '/'
                      ? pathname === '/'
                      : pathname === item.href || pathname.startsWith(`${item.href}/`)
                  const Icon = item.icon
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'group flex h-8.5 items-center gap-2.5 rounded-lg px-2.5 text-[12px] transition-colors',
                          active
                            ? 'bg-mint font-semibold text-brand'
                            : 'font-medium text-[#5b6b61] hover:bg-[#f1f5ef] hover:text-ink',
                        )}
                      >
                        <Icon
                          className={cn(
                            'size-[15px] shrink-0',
                            active ? 'text-[#16a34a]' : 'text-[#8a988f] group-hover:text-[#5b6b61]',
                          )}
                          strokeWidth={1.9}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge ? (
                          <span
                            className={cn(
                              'rounded-md px-1.5 py-px text-[9.5px] font-semibold tabular-nums',
                              active ? 'bg-white/80 text-[#12703f]' : 'bg-[#eef2ec] text-[#7d8b82]',
                            )}
                          >
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="px-3 pb-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b3a2c] via-[#0f4634] to-[#14563c] p-3.5 text-white">
            <div className="pointer-events-none absolute -top-8 -right-6 size-24 rounded-full bg-[#4ade80]/15 blur-xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-4 size-20 rounded-full bg-[#4ade80]/10 blur-lg" />
            <div className="relative">
              <span className="grid size-7 place-items-center rounded-lg bg-white/10 ring-1 ring-white/15">
                <HelpCircle className="size-3.5" />
              </span>
              <p className="mt-2.5 text-[12px] font-semibold">Butuh bantuan?</p>
              <p className="mt-0.5 text-[10.5px] leading-relaxed text-white/65">
                Panduan operator, shortcut scan, dan kontak support shift.
              </p>
              <button className="mt-2.5 inline-flex h-7 items-center gap-1 rounded-lg bg-[#d9f5e2] px-2.5 text-[10.5px] font-semibold text-[#0b3a2c] transition-colors hover:bg-white">
                Buka panduan
                <ArrowUpRight className="size-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 border-t border-line px-3.5 py-3">
          <Avatar name="Andi Pratama" size="md" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11.5px] font-semibold text-ink">Andi Pratama</p>
            <p className="truncate text-[9.5px] text-faint">Supervisor · Shift 1</p>
          </div>
          <Link
            href="/settings"
            aria-label="Pengaturan akun"
            className="grid size-7 place-items-center rounded-lg text-[#8a988f] transition-colors hover:bg-panel hover:text-ink"
          >
            <Settings className="size-3.5" />
          </Link>
        </div>
      </aside>
    </>
  )
}
