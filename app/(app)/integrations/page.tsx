import Link from 'next/link'
import {
  Activity,
  Database,
  Plug,
  Plus,
  Printer,
  RefreshCw,
  ShoppingBag,
  Truck,
  Webhook,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { buttonStyles } from '@/components/ui-kit/button'
import { integrationLogs, integrations } from '@/lib/data'

const typeIcon = {
  ERP: Database,
  Marketplace: ShoppingBag,
  Kurir: Truck,
  Perangkat: Printer,
}

export default function IntegrationsPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Integrasi"
        description="Monitor konektor ERP, marketplace, kurir, dan perangkat — lengkap dengan retry dan dead-letter queue."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <RefreshCw className="size-3.5" />
              Cek kesehatan
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Tambah konektor
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Konektor aktif" value="7/8" hint="1 terputus" icon={<Plug className="size-4" />} tone="amber" />
        <StatCard label="Pesan hari ini" value="24.812" delta="6,4%" hint="vs kemarin" icon={<Activity className="size-4" />} tone="blue" />
        <StatCard label="Error rate" value="0,08%" delta="0,02%" deltaTone="down" hint="24 jam" icon={<Webhook className="size-4" />} tone="violet" />
        <StatCard label="Latency p95" value="420 ms" hint="target < 500 ms" icon={<RefreshCw className="size-4" />} />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 xl:col-span-8">
          <PanelHeader
            title="Konektor"
            subtitle="Sinkronisasi master data, order, stok, dan pengiriman"
            action={<Badge tone="mint">8 konektor</Badge>}
          />
          <PanelBody className="grid grid-cols-1 gap-2.5 pt-0 sm:grid-cols-2">
            {integrations.map((connector) => {
              const Icon = typeIcon[connector.type as keyof typeof typeIcon] ?? Plug
              return (
                <div key={connector.name} className="rounded-xl border border-line p-3 transition-colors hover:border-line-strong">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-lg bg-panel text-[#5b6b61]">
                        <Icon className="size-4" />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-ink">{connector.name}</p>
                        <p className="text-[9.5px] text-faint">{connector.type}</p>
                      </div>
                    </div>
                    <StatusBadge status={connector.status} />
                  </div>
                  <div className="mt-2.5 grid grid-cols-3 gap-1.5 text-center">
                    <div className="rounded-lg bg-panel py-1.5">
                      <p className="text-[8.5px] text-faint">Pesan</p>
                      <p className="text-[10.5px] font-semibold text-ink tabular-nums">
                        {connector.messages.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="rounded-lg bg-panel py-1.5">
                      <p className="text-[8.5px] text-faint">Error</p>
                      <p className={`text-[10.5px] font-semibold tabular-nums ${connector.errors > 0 ? 'text-[#b42318]' : 'text-[#12703f]'}`}>
                        {connector.errors}
                      </p>
                    </div>
                    <div className="rounded-lg bg-panel py-1.5">
                      <p className="text-[8.5px] text-faint">Sync</p>
                      <p className="text-[9.5px] font-medium text-ink">{connector.lastSync}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </PanelBody>
          <PanelFooter>
            <span>Retry otomatis 5× dengan backoff</span>
            <span>Dead-letter queue aktif</span>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Kesehatan integrasi" subtitle="24 jam terakhir" action={<Badge tone="success" dot>Sehat</Badge>} />
            <PanelBody className="space-y-3 pt-0">
              {[
                { label: 'Uptime konektor', value: '99,94%', pct: 99 },
                { label: 'Pesan sukses', value: '99,92%', pct: 99 },
                { label: 'Webhook terkirim', value: '98,7%', pct: 98 },
                { label: 'DLQ kosong', value: '100%', pct: 100 },
              ].map((metric) => (
                <div key={metric.label}>
                  <div className="mb-1 flex items-center justify-between text-[10.5px]">
                    <span className="text-ink-soft">{metric.label}</span>
                    <span className="font-semibold text-ink tabular-nums">{metric.value}</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#eef2ec]">
                    <div className="h-full rounded-full bg-[#16a34a]" style={{ width: `${metric.pct}%` }} />
                  </div>
                </div>
              ))}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Webhook events" subtitle="Event yang dipublikasikan" />
            <PanelBody className="space-y-1.5 pt-0">
              {[
                'order.allocated',
                'receipt.completed',
                'shipment.confirmed',
                'stock.adjusted',
                'task.completed',
              ].map((event) => (
                <div key={event} className="flex items-center justify-between rounded-lg bg-panel px-2.5 py-1.5">
                  <span className="font-mono text-[9.5px] text-ink-soft">{event}</span>
                  <span className="size-1.5 rounded-full bg-[#16a34a]" />
                </div>
              ))}
            </PanelBody>
            <PanelFooter>
              <span>Signature HMAC-SHA256</span>
              <Link href="/settings" className="font-medium text-[#12703f] hover:underline">
                Atur
              </Link>
            </PanelFooter>
          </Panel>
        </div>
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader
          title="Log pesan"
          subtitle="8 pesan terakhir · semua konektor"
          action={<Badge tone="warning">1 gagal · 1 retry</Badge>}
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-y border-line bg-[#fafbf9]">
                {['Waktu', 'Sumber', 'Event', 'Detail', 'Latency', 'Status'].map((head) => (
                  <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {integrationLogs.map((log) => (
                <tr key={log.id} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                  <td className="px-4 py-2.5 font-mono text-[10px] text-ink-soft">{log.time}</td>
                  <td className="px-4 py-2.5 text-[10.5px] font-medium text-ink">{log.source}</td>
                  <td className="px-4 py-2.5 font-mono text-[9.5px] text-ink-soft">{log.event}</td>
                  <td className="px-4 py-2.5 text-[10px] text-ink-soft">{log.detail}</td>
                  <td className="px-4 py-2.5 text-[10px] text-ink-soft tabular-nums">{log.latency}</td>
                  <td className="px-4 py-2.5">
                    <StatusBadge status={log.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PanelFooter>
          <span>Log disimpan 30 hari</span>
          <span>Retry manual tersedia</span>
        </PanelFooter>
      </Panel>
    </div>
  )
}
