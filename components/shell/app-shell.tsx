'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <div className="min-h-screen bg-canvas lg:h-screen lg:p-3">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col overflow-hidden bg-white lg:h-full lg:min-h-0 lg:flex-row lg:rounded-[26px] lg:border lg:border-[#dfe5dc] lg:shadow-[0_30px_80px_-50px_rgba(15,36,27,0.45)]">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col bg-panel lg:min-h-0">
          <Topbar onMenu={() => setOpen(true)} />
          <main className="flex-1 px-4 py-5 lg:min-h-0 lg:overflow-y-auto lg:px-6 lg:py-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
