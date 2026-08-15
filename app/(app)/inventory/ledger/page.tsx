'use client'

import Link from 'next/link'
import { ArrowLeft, ArrowRight, Download, Lock, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, type BadgeTone } from '@/components/ui-kit/badge'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { ledger } from '@/lib/data'

type LedgerRow = (typeof ledger)[number]

const typeTone: Record<string, BadgeTone> = {
  Receipt: 'success',
  Allocation: 'info',
  Pick: 'violet',
  Adjustment: 'warning',
  Move: 'neutral',
  'Transfer Out': 'info',
  'Ship Confirm': 'success',
  Count: 'warning',
  Return: 'violet',
}

export default function LedgerPage() {
  const columns: Column<LedgerRow>[] = [
    {
      key: 'time',
      header: 'Waktu',
      sortValue: (row) => row.time,
      render: (row) => <span className="text-[10.5px] whitespace-nowrap text-ink-soft">{row.time}</span>,
    },
    {
      key: 'doc',
      header: 'Dokumen',
      render: (row) => <span className="font-mono text-[10px] text-ink">{row.doc}</span>,
    },
    {
      key: 'type',
      header: 'Tipe',
      render: (row) => <Badge tone={typeTone[row.type] ?? 'neutral'}>{row.type}</Badge>,
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
      key: 'movement',
      header: 'Dari → Ke',
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-mono text-[9.5px] text-ink-soft">
          {row.from}
          <ArrowRight className="size-2.5 text-[#b3bfb7]" />
          {row.to}
        </span>
      ),
    },
    {
      key: 'qty',
      header: 'Qty',
      sortValue: (row) => row.qty,
      render: (row) => (
        <span
          className={`text-[11px] font-semibold tabular-nums ${row.qty < 0 ? 'text-[#b42318]' : 'text-[#12703f]'}`}
        >
          {row.qty > 0 ? `+${row.qty}` : row.qty}
        </span>
      ),
    },
    {
      key: 'balance',
      header: 'Sebelum → Sesudah',
      render: (row) => (
        <span className="text-[10.5px] text-ink-soft tabular-nums">
          {row.before} → <span className="font-semibold text-ink">{row.after}</span>
        </span>
      ),
    },
    {
      key: 'user',
      header: 'Pengguna',
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.user}</span>,
    },
  ]

  return (
    <div className="space-y-4">
      <PageHeader
        breadcrumb={['Inventori', 'Ledger']}
        title="Stock Ledger"
        description="Catatan pergerakan stok yang tidak dapat diubah — setiap transaksi menyimpan waktu, pengguna, dokumen, dan saldo."
        actions={
          <>
            <Link href="/inventory" className={buttonStyles({ variant: 'ghost' })}>
              <ArrowLeft className="size-3.5" />
              Inventori
            </Link>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Download className="size-3.5" />
              Ekspor CSV
            </button>
          </>
        }
      />

      <div className="flex items-start gap-3 rounded-2xl border border-[#cdebd8] bg-[#f4fbf6] p-3.5">
        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-mint text-[#12703f]">
          <Lock className="size-4" />
        </span>
        <div>
          <p className="text-[11.5px] font-semibold text-[#0f5c36]">Ledger bersifat immutable</p>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-[#3d6b52]">
            Tidak ada perubahan langsung pada kuantitas stok. Koreksi dilakukan lewat transaksi baru dengan reason
            code dan approval, sehingga jejak audit tetap utuh.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Transaksi hari ini" value="1.842" delta="6,2%" hint="vs kemarin" icon={<ShieldCheck className="size-4" />} />
        <StatCard label="Receipt" value="12" hint="GRN terkirim ke ERP" icon={<ArrowRight className="size-4" />} tone="blue" />
        <StatCard label="Adjustment" value="6" hint="2 menunggu approval" icon={<Lock className="size-4" />} tone="amber" />
        <StatCard label="Transfer" value="3" hint="2 in-transit" icon={<ArrowRight className="size-4" />} tone="violet" />
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Riwayat pergerakan stok"
          subtitle="10 transaksi terakhir · semua gudang"
          action={<Badge tone="neutral">Immutable</Badge>}
        />
        <DataTable
          rows={ledger}
          columns={columns}
          getRowKey={(row) => row.id}
          search={(row) => `${row.id} ${row.doc} ${row.sku} ${row.name} ${row.user} ${row.type}`}
          searchPlaceholder="Cari dokumen, SKU, pengguna…"
          filters={[
            {
              key: 'type',
              label: 'Semua tipe',
              options: ['Receipt', 'Allocation', 'Pick', 'Adjustment', 'Move', 'Transfer Out', 'Ship Confirm', 'Count', 'Return'],
              match: (row, value) => row.type === value,
            },
          ]}
          pageSize={8}
          minWidth={1040}
        />
      </Panel>
    </div>
  )
}
