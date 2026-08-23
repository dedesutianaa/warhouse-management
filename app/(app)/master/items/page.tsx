'use client'

import { Barcode, Database, Download, FileSpreadsheet, Plus, Upload } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { DataTable, type Column } from '@/components/ui-kit/data-table'
import { buttonStyles } from '@/components/ui-kit/button'
import { items } from '@/lib/data'
import { formatNumber } from '@/lib/format'

type Item = (typeof items)[number]

export default function MasterItemsPage() {
  const columns: Column<Item>[] = [
    {
      key: 'sku',
      header: 'SKU / Item',
      sortValue: (row) => row.sku,
      render: (row) => (
        <div>
          <p className="text-[11.5px] font-semibold text-ink">{row.name}</p>
          <p className="font-mono text-[10px] text-faint">{row.sku}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Kategori',
      sortValue: (row) => row.category,
      render: (row) => <span className="text-[10.5px] text-ink-soft">{row.category}</span>,
    },
    {
      key: 'uom',
      header: 'UoM',
      render: (row) => <span className="rounded-md bg-panel px-1.5 py-0.5 text-[9.5px] text-ink-soft">{row.uom}</span>,
    },
    {
      key: 'stock',
      header: 'Stok',
      sortValue: (row) => row.stock,
      render: (row) => <span className="text-[11px] font-medium text-ink tabular-nums">{formatNumber(row.stock)}</span>,
    },
    {
      key: 'control',
      header: 'Kontrol inventori',
      render: (row) => (
        <Badge tone={row.control.includes('Serial') ? 'violet' : row.control.includes('Expiry') ? 'info' : 'neutral'}>
          {row.control}
        </Badge>
      ),
    },
    {
      key: 'abc',
      header: 'ABC',
      render: (row) => <StatusBadge status={row.abc} />,
    },
    {
      key: 'barcode',
      header: 'Barcode',
      render: (row) => (
        <span className="inline-flex items-center gap-1 font-mono text-[9.5px] text-ink-soft">
          <Barcode className="size-3 text-[#8a988f]" />
          {row.barcode}
        </span>
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
        title="Master Item"
        description="SKU, multi-UoM, barcode, atribut lot/serial, dan aturan inventori per item."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Upload className="size-3.5" />
              Impor CSV/XLSX
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Tambah item
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total item" value="4.812" delta="86" hint="baru bulan ini" icon={<Database className="size-4" />} />
        <StatCard label="Item aktif" value="4.690" hint="97,5% dari total" icon={<Barcode className="size-4" />} tone="blue" />
        <StatCard label="Kontrol lot/serial" value="1.842" hint="38% item" icon={<FileSpreadsheet className="size-4" />} tone="violet" />
        <StatCard label="Tanpa barcode" value="12" hint="perlu dilengkapi" icon={<Barcode className="size-4" />} tone="amber" />
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Katalog item"
          subtitle="12 item contoh · 4.812 SKU aktif"
          action={
            <button className={buttonStyles({ variant: 'ghost', size: 'sm' })}>
              <Download className="size-3.5" />
              Ekspor
            </button>
          }
        />
        <DataTable
          rows={items}
          columns={columns}
          getRowKey={(row) => row.sku}
          search={(row) => `${row.sku} ${row.name} ${row.category} ${row.barcode}`}
          searchPlaceholder="Cari SKU, nama, barcode…"
          filters={[
            {
              key: 'category',
              label: 'Semua kategori',
              options: ['Makanan & Minuman', 'Kosmetik', 'Perawatan Tubuh', 'Sembako'],
              match: (row, value) => row.category === value,
            },
            {
              key: 'control',
              label: 'Semua kontrol',
              options: ['Lot + Expiry', 'Lot + Serial', 'Lot'],
              match: (row, value) => row.control === value,
            },
            {
              key: 'status',
              label: 'Semua status',
              options: ['Aktif', 'Nonaktif'],
              match: (row, value) => row.status === value,
            },
          ]}
          pageSize={8}
          minWidth={980}
        />
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Impor massal" subtitle="CSV/XLSX dengan validasi baris" />
          <PanelBody className="pt-0">
            <div className="grid place-items-center rounded-xl border border-dashed border-line-strong bg-[#fafcf9] px-4 py-7 text-center">
              <span className="grid size-10 place-items-center rounded-xl bg-mint text-[#12703f]">
                <Upload className="size-4" />
              </span>
              <p className="mt-2 text-[11.5px] font-semibold text-ink">Tarik file ke sini atau pilih file</p>
              <p className="mt-0.5 text-[10px] text-faint">Maks. 10 MB · template item_master_v3.xlsx</p>
              <div className="mt-2.5 flex gap-2">
                <button className={buttonStyles({ variant: 'secondary', size: 'sm' })}>Unduh template</button>
                <button className={buttonStyles({ variant: 'primary', size: 'sm' })}>Pilih file</button>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              {[
                { file: 'item_import_2211.xlsx', result: '248 baris sukses', tone: 'success' as const },
                { file: 'item_import_2011.xlsx', result: '3 baris gagal · barcode duplikat', tone: 'warning' as const },
              ].map((log) => (
                <div key={log.file} className="flex items-center justify-between rounded-lg border border-line px-2.5 py-2">
                  <span className="font-mono text-[10px] text-ink-soft">{log.file}</span>
                  <Badge tone={log.tone}>{log.result}</Badge>
                </div>
              ))}
            </div>
          </PanelBody>
        </Panel>

        <Panel>
          <PanelHeader title="Atribut wajib" subtitle="Validasi saat impor" />
          <PanelBody className="space-y-2 pt-0">
            {['Kode SKU unik', 'Nama & kategori', 'UoM dasar + konversi', 'Minimal 1 barcode', 'Atribut lot/expiry bila berlaku'].map(
              (rule) => (
                <div key={rule} className="flex items-center gap-2 rounded-lg bg-panel px-2.5 py-2 text-[10.5px] text-ink-soft">
                  <span className="size-1.5 rounded-full bg-[#16a34a]" />
                  {rule}
                </div>
              ),
            )}
          </PanelBody>
          <PanelFooter>
            <span>Log error dapat diunduh</span>
            <span>v3</span>
          </PanelFooter>
        </Panel>
      </div>
    </div>
  )
}
