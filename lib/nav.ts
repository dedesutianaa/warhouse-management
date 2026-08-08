import {
  BarChart3,
  Boxes,
  Building2,
  ClipboardList,
  Database,
  Gauge,
  LayoutDashboard,
  MapPin,
  PackageCheck,
  PackageOpen,
  Plug,
  ScrollText,
  Settings,
  ShieldCheck,
  Smartphone,
  Tags,
  Undo2,
  Users,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

export type NavGroup = {
  title: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: 'Operasional',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Inbound', href: '/inbound', icon: PackageOpen, badge: '3' },
      { label: 'Outbound', href: '/outbound', icon: PackageCheck, badge: '12' },
      { label: 'Inventori', href: '/inventory', icon: Boxes },
      { label: 'Retur', href: '/returns', icon: Undo2, badge: '2' },
      { label: 'Task Board', href: '/tasks', icon: ClipboardList, badge: '8' },
      { label: 'Tenaga Kerja', href: '/labor', icon: Gauge },
    ],
  },
  {
    title: 'Data & Aturan',
    items: [
      { label: 'Master Item', href: '/master/items', icon: Database },
      { label: 'Lokasi Gudang', href: '/master/locations', icon: MapPin },
      { label: 'Partner', href: '/master/partners', icon: Users },
      { label: 'Reason Code', href: '/master/reason-codes', icon: Tags },
    ],
  },
  {
    title: 'Insight',
    items: [
      { label: 'Laporan', href: '/reports', icon: BarChart3 },
      { label: 'Integrasi', href: '/integrations', icon: Plug },
      { label: 'Mobile RF', href: '/mobile', icon: Smartphone },
      { label: 'Portal Klien', href: '/portal', icon: Building2 },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { label: 'Pengguna & Peran', href: '/users', icon: ShieldCheck },
      { label: 'Audit Trail', href: '/audit', icon: ScrollText },
      { label: 'Pengaturan', href: '/settings', icon: Settings },
    ],
  },
]

const extraTitles: Record<string, string> = {
  '/inbound/putaway': 'Putaway Terarah',
  '/inbound/qc': 'QC Inbound',
  '/outbound/waves': 'Wave Planning',
  '/outbound/picking': 'Picking & Sortir',
  '/outbound/packing': 'Packing Station',
  '/outbound/shipping': 'Shipping & Manifest',
  '/inventory/ledger': 'Stock Ledger',
  '/inventory/cycle-count': 'Cycle Count',
  '/inventory/adjustments': 'Stock Adjustment',
  '/inventory/transfers': 'Transfer Gudang',
  '/inventory/expiry': 'Kedaluwarsa',
  '/inventory/replenishment': 'Replenishment',
}

export function findPageMeta(pathname: string): { title: string; section: string } {
  if (extraTitles[pathname]) {
    const section = pathname.split('/')[1]
    return { title: extraTitles[pathname], section: sectionLabel(section) }
  }

  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.href === pathname) {
        return { title: item.label, section: group.title }
      }
    }
  }

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length > 1) {
    const parent = `/${segments[0]}`
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.href === parent) {
          return { title: `${item.label} · Detail`, section: group.title }
        }
      }
    }
  }

  return { title: 'Dashboard', section: 'Operasional' }
}

function sectionLabel(segment: string) {
  const map: Record<string, string> = {
    inbound: 'Inbound',
    outbound: 'Outbound',
    inventory: 'Inventori',
    returns: 'Retur',
    master: 'Data & Aturan',
  }
  return map[segment] ?? 'Operasional'
}
