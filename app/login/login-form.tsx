'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Warehouse, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'
import { buttonStyles } from '@/components/ui-kit/button'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const error = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pin, setPin] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [mode, setMode] = useState<'password' | 'pin'>('password')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError('')

    try {
      const result = await signIn('credentials', {
        email,
        password: mode === 'password' ? password : pin,
        pin: mode === 'pin' ? pin : undefined,
        redirect: false,
      })

      if (result?.error) {
        setLoginError('Email/PIN atau kata sandi salah')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setLoginError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <span className="grid size-10 place-items-center rounded-xl bg-brand text-white shadow-[0_4px_12px_-4px_rgba(14,59,46,0.6)]">
              <Warehouse className="size-5" strokeWidth={1.8} />
            </span>
            <span className="leading-none text-left">
              <span className="block text-[18px] font-semibold tracking-[0.02em] text-ink">GUDANGKU</span>
              <span className="mt-1 block text-[10px] font-medium tracking-[0.16em] text-[#9aa79f] uppercase">Warehouse OS</span>
            </span>
          </Link>
          <h1 className="text-[22px] font-semibold text-ink">Masuk ke akun Anda</h1>
          <p className="mt-2 text-[13px] text-ink-soft">Gunakan kredensial atau PIN untuk akses mobile</p>
        </div>

        <div className="bg-white rounded-2xl border border-line p-6 shadow-sm">
          {(error || loginError) && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-[#fdecec] p-3 text-[#dc2626] text-[12px]" role="alert">
              <AlertCircle className="size-4 shrink-0" />
              <span>{error === 'CredentialsSignin' ? 'Email atau kata sandi salah' : loginError}</span>
            </div>
          )}

          <div className="mb-4 flex gap-2" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'password'}
              onClick={() => setMode('password')}
              className={cn(
                'flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors',
                mode === 'password'
                  ? 'bg-mint text-brand'
                  : 'text-ink-soft hover:bg-[#f1f5ef]'
              )}
            >
              Kata Sandi
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'pin'}
              onClick={() => setMode('pin')}
              className={cn(
                'flex-1 py-2 rounded-lg text-[13px] font-medium transition-colors',
                mode === 'pin'
                  ? 'bg-mint text-brand'
                  : 'text-ink-soft hover:bg-[#f1f5ef]'
              )}
            >
              PIN (Mobile)
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-[12px] font-medium text-ink mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9aa79f]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="andi.pratama@gudangku.id"
                  className="h-10 w-full rounded-xl border border-line bg-[#f6f8f4] pr-4 pl-10 text-[13px] text-ink placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:bg-white focus:ring-2 focus:ring-accent/15 focus:outline-none"
                />
              </div>
            </div>

            {mode === 'password' ? (
              <div>
                <label htmlFor="password" className="block text-[12px] font-medium text-ink mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9aa79f]" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="h-10 w-full rounded-xl border border-line bg-[#f6f8f4] pr-12 pl-10 text-[13px] text-ink placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:bg-white focus:ring-2 focus:ring-accent/15 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#9aa79f] hover:text-ink"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label htmlFor="pin" className="block text-[12px] font-medium text-ink mb-1.5">
                  PIN 6 Digit
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#9aa79f]" />
                  <input
                    id="pin"
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Masukkan PIN"
                    className="h-10 w-full rounded-xl border border-line bg-[#f6f8f4] pr-4 pl-10 text-[13px] text-ink placeholder:text-[#9aa79f] focus:border-[#bcd6c2] focus:bg-white focus:ring-2 focus:ring-accent/15 focus:outline-none tracking-widest text-center"
                  />
                </div>
                <p className="mt-1 text-[11px] text-ink-soft">Gunakan PIN untuk login cepat di perangkat mobile</p>
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="size-4 rounded border-line text-brand focus:ring-accent"
                />
                <span className="text-[12px] text-ink-soft">Ingat saya</span>
              </label>
              <a href="/forgot-password" className="text-[12px] font-medium text-brand hover:underline">
                Lupa kata sandi?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={buttonStyles({ variant: 'primary', className: 'w-full' })}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin size-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Masuk...
                </span>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-line">
            <p className="text-center text-[11px] text-ink-soft">
              Butuh bantuan? <a href="/support" className="font-medium text-brand hover:underline">Hubungi support</a>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] text-faint">
          Versi 1.0.0 &copy; 2026 GUDANGKU. Hak cipta dilindungi.
        </p>
      </div>
    </div>
  )
}