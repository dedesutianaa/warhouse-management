export function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function formatIDR(value: number, compact = false) {
  if (compact) {
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.', ',')} M`
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1).replace('.', ',')} jt`
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)} rb`
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(iso: string, withTime = false) {
  const date = new Date(iso)
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  }).format(date)
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

export function percent(value: number, total: number) {
  if (!total) return 0
  return Math.round((value / total) * 100)
}
