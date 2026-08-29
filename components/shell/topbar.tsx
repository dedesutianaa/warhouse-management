'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  ChevronDown,
  Clock3,
  Menu,
  PackageCheck,
  Search,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { findPageMeta } from '@/lib/nav'
import { Avatar } from '@/components/ui-kit/avatar'

const notifications = [
  {
    id: 'n1',
    icon: AlertTriangle,
    tone: 'bg-[#fdecec] text-[#dc2626]',
    title: 'SLA berisiko: SO-2026-118396',
    body: 'Order On Hold melewati cut-off Ninja Xpress 12 menit lalu.',
    time: '2 mnt lalu',
  },
  {
    id: 'n2',
    icon: ShieldAlert,
    tone: 'bg-[#fdf3e3] text-[#b45309]',
    title: '2 adjustment menunggu approval',
    body: 'Nilai Rp 492 rb · SLA approval tersisa 4 jam.',
    time: '18 mnt lalu',
  },
  {
    id: 'n3',
    icon: PackageCheck,
    tone: 'bg-mint text-brand',
    title: 'GRN-2026-004179 terkirim ke ERP',
    body: '42 line dari PT Sumber Pangan Nusantara berhasil disinkronkan.',
    time: '36 mnt lalu',
  },
  {
    id: 'n4',
    icon: Clock3,
    tone: 'bg-[#eef2ff] text-[#4f46e5]',
    title: 'Wave WAVE-1122-04 belum ditugaskan',
    body: '24 order · cut-off 15:00 · butuh picker zona C.',
    time: '1 jam lalu',
  },
]

export function Topbar({ onMenu }: { onMenu: () => void }) {
  const pathname = usePathname()
  const meta = findPageMeta(pathname)
  const [notifOpen, setNotifOpen] = useState(false)
  const [unread, setUnread] = useState(notifications.length)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!notifOpen) return
    function onPointerDown(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setNotifOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [notifOpen])

  return (
    <header className="sticky top-0 z-30 flex h-15 shrink-0 items-center gap-3 border-b border-line bg-white/85 px-4 backdrop-blur-md lg:px-6">
      <button
        onClick={onMenu}
        aria-label="Buka menu"
        className="grid size-8 place-items-center rounded-lg border border-line text-ink-soft lg:hidden"
      >
        <Menu className="size-4" />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-[9.5px] font-medium tracking-[0.1em] text-[#a3afa7] uppercase">
          <span>{meta.section}</span>
          <span className="text-[#cbd5cd]">/</span>
          <span className="text-[#7d8b82]">{meta.title}</span>
        </div>
        <h2 className="truncate text-[13px] font-semibold text-ink">{meta.title}</h2>
      </div>

      <div className="relative hidden w-56 md:block xl:w-64">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#9aa79f]" />
        <input
          type="search"
          placeholder="Cari order, SKU, lokasi…"
          aria-label="Pencarian global"
          className="h-8.5 w-full rounded-xl border border-line bg-[#f6f8f4] pr-12 pl-8.5 text-[11.5px] text-ink placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:bg-white focus:ring-2 focus:ring-accent/15 focus:outline-none"
        />
        <kbd className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border border-line bg-white px-1.5 py-0.5 font-mono text-[9px] text-faint">
          Ctrl K
        </kbd>
      </div>

      <div className="hidden items-center gap-1.5 rounded-xl border border-line bg-white px-2.5 py-1.5 xl:flex">
        <span className="size-1.5 rounded-full bg-[#16a34a] live-dot" />
        <span className="text-[10.5px] font-medium text-ink-soft">Shift 1 · 08:00–16:00</span>
      </div>

      <Link
        href="/mobile"
        className="hidden h-8.5 items-center gap-1.5 rounded-xl bg-mint px-2.5 text-[11px] font-semibold text-brand transition-colors hover:bg-mint-2 sm:flex"
      >
        <Sparkles className="size-3.5" />
        Scan cepat
      </Link>

      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen((open) => !open)}
          aria-label={`Notifikasi, ${unread} belum dibaca`}
          aria-haspopup="dialog"
          aria-expanded={notifOpen}
          className="relative grid size-8.5 place-items-center rounded-xl border border-line bg-white text-ink-soft transition-colors hover:bg-panel"
        >
          <Bell className="size-4" />
          {unread > 0 ? (
            <span className="absolute top-1.5 right-1.5 grid size-3.5 place-items-center rounded-full bg-[#dc2626] text-[8px] font-bold text-white ring-2 ring-white">
              {unread}
            </span>
          ) : null}
        </button>

        {notifOpen ? (
          <div
            role="dialog"
            aria-label="Notifikasi"
            className="absolute top-11 right-0 z-50 w-80 rounded-2xl border border-line bg-white p-2 shadow-[0_18px_50px_-12px_rgba(15,61,46,0.25)]"
          >
            <div className="flex items-center justify-between px-2 py-1.5">
              <div className="flex items-center gap-2">
                <p className="text-[12px] font-semibold text-ink">Notifikasi</p>
                <span className="rounded-full bg-mint px-1.5 py-0.5 text-[9px] font-semibold text-brand">
                  {unread} baru
                </span>
              </div>
              <button
                onClick={() => setUnread(0)}
                className="flex items-center gap-1 text-[10px] font-medium text-ink-soft transition-colors hover:text-brand"
              >
                <CheckCheck className="size-3" />
                Tandai dibaca
              </button>
            </div>

            <ul className="mt-1 space-y-0.5">
              {notifications.map((item, index) => {
                const Icon = item.icon
                return (
                  <li key={item.id}>
                    <button className="flex w-full items-start gap-2.5 rounded-xl px-2 py-2 text-left transition-colors hover:bg-panel">
                      <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg ${item.tone}`}>
                        <Icon className="size-3.5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-[11px] font-semibold text-ink">{item.title}</span>
                          {index < unread ? <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#dc2626]" /> : null}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-relaxed text-ink-soft">{item.body}</span>
                        <span className="mt-1 block text-[9px] text-faint">{item.time}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            <Link
              href="/tasks"
              onClick={() => setNotifOpen(false)}
              className="mt-1 block rounded-xl border-t border-line px-2 py-2 text-center text-[10.5px] font-semibold text-brand transition-colors hover:bg-panel"
            >
              Lihat semua notifikasi
            </Link>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-2 border-l border-line pl-2.5">
        <Avatar name="Andi Pratama" size="md" />
        <div className="hidden leading-tight lg:block">
          <p className="text-[11.5px] font-semibold text-ink">Andi Pratama</p>
          <p className="text-[9.5px] text-faint">Warehouse Manager</p>
        </div>
        <ChevronDown className="hidden size-3.5 text-[#9aa79f] lg:block" />
      </div>
    </header>
  )
}
