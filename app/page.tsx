'use client'

import { Suspense } from 'react'
import { DashboardContent } from './dashboard-content'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  )
}