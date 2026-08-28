'use client'

import { AlertTriangle, Download, Lock, ScrollText, ShieldAlert, UserCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge } from '@/components/ui-kit/badge'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { auditLogs } from '@/lib/data'

type AuditRow = (typeof auditLogs)[number]

export default function AuditPage() {
  const columns: Column<AuditRow>[] = [
    {
      key: 'time',
      header: 'Waktu',
      sortValue: (row) => row.time,
      render: (row) => <span className="text-[10.5px] whitespace-nowrap text-ink-soft">{row.time}</span>,
    },
    {
      key: 'actor',
      header: 'Aktor',
      sortValue: (row) => row.actor,
      render: (row) => <span className="text-[11px] font-medium text-ink">{row.actor}</span>,
    },
    {
      key: 'action',
      header: 'Aksi',
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.action}</span>,
    },
    {
      key: 'entity',
      header: 'Entitas',
      render: (row) => <span className="font-mono text-[10px] text-ink">{row.entity}</span>,
    },
    {
      key: 'detail',
      header: 'Detail',
      render: (row) => <span className="text-[10px] text-ink-soft">{row.detail}</span>,
    },
    {
      key: 'ip',
      header: 'IP',
      render: (row) => <span className="font-mono text-[9.5px] text-faint">{row.ip}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        title="Audit Trail"
        description="Catatan lengkap siapa, kapan, apa, dan nilai sebelum-sesudah — tidak dapat diubah dan dapat diekspor."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Download className="size-3.5" />
              Ekspor
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <ScrollText className="size-3.5" />
              Filter lanjutan
            </button>
          </>
        }
      />

      <div className="flex items-start gap-3 rounded-2xl border border-[#cdebd8] bg-[#f4fbf6] p-3.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-mint text-[#12703f]">
          <Lock className="size-4" />
        </span>
        <div>
          <p className="text-[11.5px] font-semibold text-[#0f5c36]">Audit trail immutable</p>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#3d6b52]">
            Setiap perubahan penting tercatat permanen dengan nilai sebelum dan sesudah. Retensi dapat dikonfigurasi
            sesuai kebijakan UU PDP.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Event hari ini" value="1.284" delta="6,2%" hint="vs kemarin" icon={<ScrollText className="size-4" />} />
        <StatCard label="Perubahan master" value="12" hint="item & lokasi" icon={<UserCheck className="size-4" />} tone="blue" />
        <StatCard label="Approval" value="6" hint="2 menunggu" icon={<ShieldAlert className="size-4" />} tone="violet" />
        <StatCard label="Akses ditolak" value="2" hint="perlu review" icon={<AlertTriangle className="size-4" />} tone="amber" />
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Log audit"
          subtitle="10 event terakhir · semua modul"
          action={<Badge tone="neutral">Immutable</Badge>}
        />
        <DataTable
          rows={auditLogs}
          columns={columns}
          getRowKey={(row) => row.id}
          search={(row) => `${row.actor} ${row.action} ${row.entity} ${row.detail}`}
          searchPlaceholder="Cari aktor, entitas, aksi…"
          filters={[
            {
              key: 'actor',
              label: 'Semua aktor',
              options: ['Andi Pratama', 'Rina Marlina', 'Bayu Saputra', 'Sari Wulandari', 'Doni Setiawan', 'Sistem'],
              match: (row, value) => row.actor === value,
            },
          ]}
          pageSize={8}
          minWidth={900}
        />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Aktivitas mencurigakan" subtitle="Deteksi anomali perilaku" action={<Badge tone="warning">2 flag</Badge>} />
          <PanelBody className="space-y-2 pt-0">
            {[
              { title: 'Adjustment berulang', detail: '3 adjustment oleh akun yang sama dalam 24 jam.', tone: 'warning' as const },
              { title: 'Akses di luar shift', detail: 'Login back-office pukul 02:14 di luar jam operasional.', tone: 'danger' as const },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-line p-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-ink">{item.title}</p>
                  <Badge tone={item.tone} dot>
                    Flag
                  </Badge>
                </div>
                <p className="mt-0.5 text-[10px] text-faint">{item.detail}</p>
              </div>
            ))}
          </PanelBody>
          <PanelFooter>
            <span>Review oleh security admin</span>
            <span>2 terbuka</span>
          </PanelFooter>
        </Panel>

        <Panel>
          <PanelHeader title="Retensi & kepatuhan" subtitle="Kebijakan penyimpanan data" />
          <PanelBody className="space-y-2 pt-0">
            {[
              { label: 'Log transaksi', value: '7 tahun' },
              { label: 'Log akses', value: '2 tahun' },
              { label: 'Data pribadi penerima', value: 'Masked · 90 hari' },
              { label: 'Ekspor audit', value: 'CSV / PDF' },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between border-b border-line pb-1.5 last:border-0 last:pb-0">
                <span className="text-[10px] text-faint">{row.label}</span>
                <span className="text-[10.5px] font-medium text-ink">{row.value}</span>
              </div>
            ))}
          </PanelBody>
          <PanelFooter>
            <span>Sesuai UU PDP No. 27/2022</span>
            <span>Dapat dikonfigurasi</span>
          </PanelFooter>
        </Panel>
      </div>
    </div>
  )
}
