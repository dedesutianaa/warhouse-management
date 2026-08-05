'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Package, Truck, AlertTriangle, Users, Clock, Warehouse } from 'lucide-react'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Panel, PanelHeader, PanelBody } from '@/components/ui-kit/panel'
import { Progress } from '@/components/ui-kit/progress'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { ThroughputChart } from '@/components/charts/throughput-chart'
import { TrendChart } from '@/components/charts/trend-chart'
import { CapacityDonut } from '@/components/charts/capacity-donut'
import { ZoneBars } from '@/components/ui-kit/zone-bars'
import { formatIDR, formatNumber } from '@/lib/format'

interface DashboardData {
  kpis: {
    inboundToday: number
    outboundToday: number
    slaCompliance: number
    inventoryAccuracy: number
    activeTasks: number
    lowStockAlerts: number
  }
  slaRisks: Array<{
    id: string
    stage: string
    carrier: string
    left: string
    tone: 'danger' | 'warning' | 'neutral'
    customer: string
  }>
  throughput: Array<{ label: string; inbound: number; outbound: number }>
  weeklyTrend: Array<{ label: string; inbound: number; outbound: number }>
  capacityZones: Array<{ label: string; value: number; color: string; hint: string }>
  zoneOccupancy: Array<{ label: string; used: number; capacity: number; hint: string }>
  lowStock: Array<{ sku: string; name: string; available: number; min: number; location: string }>
  recentActivity: Array<{ id: string; actor: string; action: string; target: string; time: string; tone: 'success' | 'info' | 'warning' | 'danger' | 'neutral' }>
}

export function DashboardContent() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/v1/dashboard')
        if (res.ok) {
          const json = await res.json()
          setData(json.data)
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-soft">
        Failed to load dashboard data
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        <StatCard
          label="Inbound hari ini"
          value={data.kpis.inboundToday}
          unit="lines"
          hint="+12% dari kemarin"
          icon={<Truck className="size-4" />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          label="Outbound hari ini"
          value={data.kpis.outboundToday}
          unit="lines"
          hint="+8% dari kemarin"
          icon={<Package className="size-4" />}
          trend={{ value: 8, positive: true }}
          tone="blue"
        />
        <StatCard
          label="Kepatuhan SLA"
          value={`${data.kpis.slaCompliance}%`}
          hint="Target ≥ 97%"
          icon={<TrendingUp className="size-4" />}
          trend={{ value: data.kpis.slaCompliance - 97, positive: data.kpis.slaCompliance >= 97 }}
          tone="green"
        />
        <StatCard
          label="Akurasi Inventori"
          value={`${data.kpis.inventoryAccuracy}%`}
          hint="Target ≥ 98.5%"
          icon={<Warehouse className="size-4" />}
          trend={{ value: data.kpis.inventoryAccuracy - 98.5, positive: data.kpis.inventoryAccuracy >= 98.5 }}
          tone="violet"
        />
        <StatCard
          label="Task aktif"
          value={data.kpis.activeTasks}
          unit="task"
          hint={data.slaRisks.length > 0 ? `${data.slaRisks.length} SLA berisiko` : 'Semua normal'}
          icon={<Users className="size-4" />}
          tone="amber"
        />
        <StatCard
          label="Stok minimum"
          value={data.kpis.lowStockAlerts}
          unit="SKU"
          hint="Perlu replenishment"
          icon={<AlertTriangle className="size-4" />}
          tone="red"
        />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-7 space-y-4">
          <Panel className="overflow-hidden">
            <PanelHeader
              title="Throughput harian"
              subtitle="Inbound vs Outbound per jam"
              action={
                <select className="h-7 rounded-lg border border-line bg-white px-2 text-[11px] text-ink">
                  <option>Hari ini</option>
                  <option>7 hari</option>
                  <option>30 hari</option>
                </select>
              }
            />
            <PanelBody className="pt-0 h-[300px]">
              <ThroughputChart data={data.throughput} />
            </PanelBody>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader
              title="Tren mingguan"
              subtitle="Volume inbound & outbound 7 hari terakhir"
            />
            <PanelBody className="pt-0 h-[280px]">
              <TrendChart data={data.weeklyTrend} />
            </PanelBody>
          </Panel>
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <Panel className="overflow-hidden">
            <PanelHeader title="Okupansi zona" subtitle="Utilisasi ruang per zona" />
            <PanelBody className="pt-0 space-y-3">
              <CapacityDonut zones={data.capacityZones} />
              <div className="space-y-2">
                {data.zoneOccupancy.map((zone) => (
                  <ZoneBars
                    key={zone.label}
                    label={zone.label}
                    used={zone.used}
                    capacity={zone.capacity}
                    hint={zone.hint}
                  />
                ))}
              </div>
            </PanelBody>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="SLA berisiko" subtitle="Order yang mendekati cut-off" />
            <PanelBody className="pt-0 space-y-2">
              {data.slaRisks.length === 0 ? (
                <div className="text-center py-6 text-ink-soft">Tidak ada SLA berisiko</div>
              ) : (
                data.slaRisks.map((risk) => (
                  <div key={risk.id} className="flex items-center gap-3 p-3 rounded-xl border border-line bg-white">
                    <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                      risk.tone === 'danger' ? 'bg-[#fdecec] text-[#dc2626]' :
                      risk.tone === 'warning' ? 'bg-[#fdf3e3] text-[#b45309]' :
                      'bg-[#eef2ff] text-[#4f46e5]'
                    }`}>
                      <AlertTriangle className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-ink truncate">{risk.id}</p>
                      <p className="text-[10px] text-ink-soft">{risk.customer} · {risk.carrier}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold tabular-nums text-ink">{risk.stage}</p>
                      <p className={`text-[10px] font-medium ${
                        risk.tone === 'danger' ? 'text-[#dc2626]' :
                        risk.tone === 'warning' ? 'text-[#b45309]' : 'text-[#4f46e5]'
                      }`}>{risk.left}</p>
                    </div>
                  </div>
                ))
              )}
            </PanelBody>
          </Panel>

          <Panel className="overflow-hidden">
            <PanelHeader title="Stok minimum" subtitle="SKU yang perlu segera di-replenish" />
            <PanelBody className="pt-0 space-y-2">
              {data.lowStock.length === 0 ? (
                <div className="text-center py-6 text-ink-soft">Tidak ada stok minimum</div>
              ) : (
                data.lowStock.map((item) => (
                  <div key={item.sku} className="flex items-center justify-between p-2.5 rounded-lg border border-line bg-white">
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold text-ink truncate">{item.name}</p>
                      <p className="text-[10px] text-ink-soft">{item.sku} · {item.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-semibold text-[#dc2626] tabular-nums">{item.available}</p>
                      <p className="text-[10px] text-ink-soft">Min: {item.min}</p>
                    </div>
                  </div>
                ))
              )}
            </PanelBody>
          </Panel>
        </div>
      </div>

      <Panel className="overflow-hidden">
        <PanelHeader title="Aktivitas terbaru" subtitle="Log aktivitas gudang real-time" />
        <PanelBody className="pt-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['Waktu', 'Aktor', 'Aksi', 'Target', 'Status'].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentActivity.map((activity) => (
                  <tr key={activity.id} className="border-b border-line/80 last:border-0">
                    <td className="px-4 py-2.5 text-[10px] text-faint">{activity.time}</td>
                    <td className="px-4 py-2.5 text-[11px] font-medium text-ink">{activity.actor}</td>
                    <td className="px-4 py-2.5 text-[11px] text-ink">{activity.action}</td>
                    <td className="px-4 py-2.5 text-[10px] text-ink-soft font-mono">{activity.target}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={activity.tone === 'success' ? 'success' : activity.tone === 'warning' ? 'warning' : activity.tone === 'danger' ? 'danger' : 'info'} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelBody>
      </Panel>
    </div>
  )
}