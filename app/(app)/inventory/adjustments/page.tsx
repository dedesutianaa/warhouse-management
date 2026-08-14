'use client'

import Link from 'next/link'
import { ArrowLeft, Check, Clock, Plus, ShieldCheck, X } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { adjustments } from '@/lib/data'
import { formatIDR } from '@/lib/format'

type Adjustment = (typeof adjustments)[number]

export default function AdjustmentsPage() {
  const columns: Column<Adjustment>[] = [
    {
      key: 'id',
      header: 'ID / Tanggal',
      sortValue: (row) => row.id,
      render: (row) => (
        <div>
          <p className="text-[11px] font-semibold text-ink">{row.id}</p>
          <p className="text-[10px] text-faint">{row.date}</p>
        </div>
      ),
    },
    {
      key: 'item',
      header: 'SKU / Item',
      sortValue: (row) => row.sku,
      render: (row) => (
        <div>
          <p className="text-[11px] font-medium text-ink">{row.name}</p>
          <p className="font-mono text-[9.5px] text-faint">{row.sku}</p>
        </div>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      sortValue: (row) => row.qty,
      render: (row) => (
        <span className={`text-[11px] font-semibold tabular-nums ${row.qty < 0 ? 'text-[#b42318]' : 'text-[#12703f]'}`}>
          {row.qty > 0 ? `+${row.qty}` : row.qty}
        </span>
      ),
    },
    {
      key: 'value',
      header: 'Nilai',
      sortValue: (row) => row.value,
      render: (row) => <span className="text-[10.5px] text-ink-soft tabular-nums">{formatIDR(row.value, true)}</span>,
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.reason}</span>,
    },
    {
      key: 'requester',
      header: 'Pemohon',
      render: (row) => (
        <div>
          <p className="text-[10.5px] text-ink">{row.requester}</p>
          <p className="text-[9.5px] text-faint">Approver: {row.approver}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inventori', 'Adjustment']}
        title="Stock Adjustment"
        description="Koreksi stok dengan reason code, lampiran, dan approval berjenjang berdasarkan nilai atau qty."
        actions={
          <>
            <Link href="/inventory" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Inventori
            </Link>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Buat adjustment
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Menunggu approval" value="2" hint="SLA approval 4 jam" icon={<Clock className="size-4" />} tone="amber" />
        <StatCard label="Disetujui hari ini" value="3" hint="semua tercatat" icon={<Check className="size-4" />} />
        <StatCard label="Nilai adjustment" value="Rp 1,2 jt" hint="bulan ini" icon={<ShieldCheck className="size-4" />} tone="blue" />
        <StatCard label="Rata-rata approval" value="42m" delta="12m" hint="lebih cepat" icon={<Clock className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Riwayat adjustment"
            subtitle="Semua koreksi stok dan status approval"
            action={<Badge tone="neutral">6 dokumen</Badge>}
          />
          <DataTable
            rows={adjustments}
            columns={columns}
            getRowKey={(row) => row.id}
            search={(row) => `${row.id} ${row.sku} ${row.name} ${row.reason} ${row.requester}`}
            searchPlaceholder="Cari ID, SKU, alasan…"
            filters={[
              {
                key: 'status',
                label: 'Semua status',
                options: ['Pending', 'Approved', 'Rejected'],
                match: (row, value) => row.status === value,
              },
            ]}
            pageSize={6}
            minWidth={760}
          />
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Approval menunggu" subtitle="Segregation of duties aktif" action={<Badge tone="warning">2</Badge>} />
            <PanelBody className="space-y-2.5 pt-0">
              {adjustments
                .filter((row) => row.status === 'Pending')
                .map((row) => (
                  <div key={row.id} className="rounded-xl border border-line p-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-semibold text-ink">{row.id}</p>
                        <p className="text-[10px] text-faint">
                          {row.name} · {row.qty} pcs
                        </p>
                      </div>
                      <span className="text-[10.5px] font-semibold text-ink tabular-nums">
                        {formatIDR(row.value, true)}
                      </span>
                    </div>
                    <p className="mt-1 text-[9.5px] text-faint">
                      {row.reason} · oleh {row.requester}
                    </p>
                    <div className="mt-2 flex gap-1.5">
                      <button className={buttonStyles({ variant: 'primary', size: 'sm', className: 'flex-1' })}>
                        <Check className="size-3" />
                        Setujui
                      </button>
                      <button className={buttonStyles({ variant: 'danger', size: 'sm' })}>
                        <X className="size-3" />
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              <p className="text-[9.5px] leading-relaxed text-faint">
                Pemohon tidak dapat menyetujui adjustment miliknya sendiri.
              </p>
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Kebijakan approval" subtitle="Berdasarkan nilai & qty" />
            <PanelBody className="space-y-2 pt-0">
              {[
                { tier: '≤ Rp 250 rb', approver: 'Supervisor', tone: 'success' as const },
                { tier: 'Rp 250 rb – 2 jt', approver: 'Warehouse Manager', tone: 'warning' as const },
                { tier: '> Rp 2 jt', approver: 'Manager + Finance', tone: 'danger' as const },
              ].map((rule) => (
                <div key={rule.tier} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-2">
                  <span className="text-[10.5px] text-ink-soft">{rule.tier}</span>
                  <Badge tone={rule.tone}>{rule.approver}</Badge>
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Semua adjustment masuk ledger</span>
              <Link href="/audit" className="font-medium text-[#12703f] hover:underline">
                Audit
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>
    </div>
  )
}
