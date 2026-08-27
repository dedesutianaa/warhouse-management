'use client'

import { Check, KeyRound, Lock, Minus, ShieldCheck, UserPlus, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Avatar } from '@/components/ui-kit/avatar'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { roles, users } from '@/lib/data'

type User = (typeof users)[number]

const matrix = [
  { module: 'Inbound', manager: true, supervisor: true, operator: true, auditor: false },
  { module: 'Outbound', manager: true, supervisor: true, operator: true, auditor: false },
  { module: 'Inventori', manager: true, supervisor: true, operator: false, auditor: false },
  { module: 'Master data', manager: true, supervisor: false, operator: false, auditor: false },
  { module: 'Laporan', manager: true, supervisor: true, operator: false, auditor: true },
  { module: 'Admin & audit', manager: true, supervisor: false, operator: false, auditor: true },
]

export default function UsersPage() {
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Pengguna',
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar name={row.name} size="sm" />
          <div>
            <p className="text-[11px] font-semibold text-ink">{row.name}</p>
            <p className="text-[9.5px] text-faint">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Peran',
      sortValue: (row) => row.role,
      render: (row) => <Badge tone={row.role === 'Warehouse Manager' ? 'brand' : row.role === 'Klien 3PL' ? 'violet' : 'neutral'}>{row.role}</Badge>,
    },
    {
      key: 'warehouse',
      header: 'Akses gudang',
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.warehouse}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: 'lastActive',
      header: 'Terakhir aktif',
      render: (row) => <span className="text-[10px] text-ink-soft">{row.lastActive}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pengguna & Peran"
        description="RBAC granular, akses per gudang/klien, MFA, dan kebijakan sesi."
        actions={
          <button className={buttonStyles({ variant: 'primary' })}>
            <UserPlus className="size-3.5" />
            Undang pengguna
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Pengguna aktif" value="54" hint="dari 58 akun" icon={<Users className="size-4" />} />
        <StatCard label="Peran" value="6" hint="termasuk klien 3PL" icon={<ShieldCheck className="size-4" />} tone="blue" />
        <StatCard label="MFA aktif" value="48" hint="back-office wajib" icon={<KeyRound className="size-4" />} tone="violet" />
        <StatCard label="Akses gudang" value="2" hint="Cikarang & Surabaya" icon={<Lock className="size-4" />} tone="amber" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Daftar pengguna"
            subtitle="8 akun contoh · semua peran"
            action={<Badge tone="mint">54 aktif</Badge>}
          />
          <DataTable
            rows={users}
            columns={columns}
            getRowKey={(row) => row.email}
            search={(row) => `${row.name} ${row.email} ${row.role} ${row.warehouse}`}
            searchPlaceholder="Cari nama, email, peran…"
            filters={[
              {
                key: 'role',
                label: 'Semua peran',
                options: ['Warehouse Manager', 'Supervisor', 'Operator', 'Inventory Controller', 'Packer', 'Klien 3PL'],
                match: (row, value) => row.role === value,
              },
              {
                key: 'status',
                label: 'Semua status',
                options: ['Aktif', 'Nonaktif'],
                match: (row, value) => row.status === value,
              },
            ]}
            pageSize={8}
            minWidth={700}
          />
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Peran & cakupan" subtitle="Peran bawaan + kustom" action={<Badge tone="neutral">6</Badge>} />
            <PanelBody className="space-y-2 pt-0">
              {roles.map((role) => (
                <div key={role.name} className="rounded-lg border border-line px-2.5 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-semibold text-ink">{role.name}</span>
                    <span className="text-[9.5px] text-faint tabular-nums">{role.users} user</span>
                  </div>
                  <p className="mt-0.5 text-[9px] text-faint">
                    {role.scope} · {role.permissions}
                  </p>
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Peran kustom mendukung izin granular</span>
              <button className="font-medium text-[#12703f] hover:underline">Kelola</button>
            </PanelFooter>
          </Panel>

          <Panel>
            <PanelHeader title="Kebijakan keamanan" subtitle="Berlaku untuk semua pengguna" />
            <PanelBody className="space-y-2 pt-0">
              {[
                { label: 'MFA back-office', value: 'Wajib', tone: 'success' as const },
                { label: 'Session timeout', value: '30 menit', tone: 'info' as const },
                { label: 'Lockout', value: '5 percobaan', tone: 'warning' as const },
                { label: 'IP allowlist', value: 'Aktif', tone: 'success' as const },
              ].map((policy) => (
                <div key={policy.label} className="flex items-center justify-between border-b border-line pb-1.5 last:border-0 last:pb-0">
                  <span className="text-[10px] text-faint">{policy.label}</span>
                  <Badge tone={policy.tone}>{policy.value}</Badge>
                </div>
              ))}
            </PanelBody>
          </Panel>
        </div>
      </div>

      <Panel>
        <PanelHeader title="Matriks izin" subtitle="Ringkasan akses per modul" action={<Badge tone="neutral">RBAC</Badge>} />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-y border-line bg-[#fafbf9]">
                <th className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">Modul</th>
                {['Manager', 'Supervisor', 'Operator', 'Auditor'].map((role) => (
                  <th key={role} className="px-4 py-2.5 text-center text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                    {role}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.module} className="border-b border-line/80 last:border-0">
                  <td className="px-4 py-2.5 text-[10.5px] font-medium text-ink">{row.module}</td>
                  {[row.manager, row.supervisor, row.operator, row.auditor].map((allowed, index) => (
                    <td key={index} className="px-4 py-2.5 text-center">
                      {allowed ? (
                        <span className="inline-grid size-5 place-items-center rounded-full bg-mint text-[#12703f]">
                          <Check className="size-3" />
                        </span>
                      ) : (
                        <span className="inline-grid size-5 place-items-center rounded-full bg-panel text-[#b3bfb7]">
                          <Minus className="size-3" />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PanelFooter>
          <span>Segregation of duties: pembuat ≠ penyetuju</span>
          <span>Audit trail aktif</span>
        </PanelFooter>
      </Panel>
    </div>
  )
}
