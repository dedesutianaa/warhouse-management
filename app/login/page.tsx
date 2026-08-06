'use client'

import { Suspense } from 'react'
import { LoginForm } from './login-form'

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas flex items-center justify-center px-4">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}