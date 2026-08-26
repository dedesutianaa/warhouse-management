'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  ScanSearch,
  Sparkles,
  Timer,
  Users,
} from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge } from '@/components/ui-kit/badge'
import { Avatar } from '@/components/ui-kit/avatar'
import { buttonStyles } from '@/components/ui-kit/button'
import { tasks } from '@/lib/data'
import { cn } from '@/lib/utils'

const columns = [
  { key: 'Tersedia', label: 'Tersedia', dot: 'bg-[#94a39a]' },
  { key: 'Berjalan', label: 'Berjalan', dot: 'bg-[#2563eb]' },
  { key: 'Menunggu Review', label: 'Menunggu Review', dot: 'bg-[#d97706]' },
  { key: 'Selesai', label: 'Selesai', dot: 'bg-[#16a34a]' },
]

const typeStyles: Record<string, { icon: typeof Package; className: string }> = {
  Putaway: { icon: Boxes, className: 'bg-mint text-[#12703f]' },
  Pick: { icon: Package, className: 'bg-[#f1ecfe] text-[#6d28d9]' },
  Replenish: { icon: RefreshCw, className: 'bg-[#eaf2fe] text-[#1d4ed8]' },
  Count: { icon: ScanSearch, className: 'bg-[#fef6e7] text-[#96600a]' },
  Move: { icon: ArrowRight, className: 'bg-[#f2f5f1] text-[#5b6b61]' },
  Pack: { icon: ClipboardList, className: 'bg-[#e6f4f1] text-[#0f766e]' },
  QC: { icon: Sparkles, className: 'bg-[#fdecec] text-[#b42318]' },
}

const filters = ['Semua', 'Putaway', 'Pick', 'Replenish', 'Count', 'Move', 'Pack', 'QC']

export default function TasksPage() {
  const [filter, setFilter] = useState('Semua')

  const visible = useMemo(
    () => (filter === 'Semua' ? tasks : tasks.filter((task) => task.type === filter)),
    [filter],
  )

  return (
    <div className="space-y-4">
      <PageHeader
        title="Task Board"
        description="Mesin tugas terpusat: putaway, pick, replenish, move, count, pack, dan QC dalam satu papan."
        actions={
          <>
            <button className={buttonStyles({ variant: 'secondary' })}>
              <Users className="size-3.5" />
              Auto-assign
            </button>
            <button className={buttonStyles({ variant: 'primary' })}>
              <Plus className="size-3.5" />
              Buat task
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Task terbuka" value="18" hint="6 belum ditugaskan" icon={<ClipboardList className="size-4" />} />
        <StatCard label="Berjalan" value="8" hint="5 operator aktif" icon={<Timer className="size-4" />} tone="blue" />
        <StatCard label="Terlambat" value="3" hint="perlu eskalasi" icon={<Timer className="size-4" />} tone="rose" />
        <StatCard label="Selesai hari ini" value="42" delta="12%" hint="vs kemarin" icon={<Sparkles className="size-4" />} tone="violet" />
      </div>

      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
        {filters.map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors',
              filter === item
                ? 'border-brand bg-brand text-white'
                : 'border-line bg-white text-ink-soft hover:border-line-strong',
            )}
          >
            {item}
          </button>
        ))}
        <span className="ml-auto hidden shrink-0 text-[10.5px] text-faint sm:block">
          {visible.length} task ditampilkan
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => {
          const items = visible.filter((task) => task.status === column.key)
          return (
            <div key={column.key} className="flex flex-col rounded-2xl border border-line bg-[#f4f7f2] p-2.5">
              <div className="mb-2 flex items-center gap-2 px-1">
                <span className={cn('size-1.5 rounded-full', column.dot)} />
                <span className="text-[11px] font-semibold text-ink">{column.label}</span>
                <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[9.5px] font-semibold text-faint tabular-nums">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((task) => {
                  const style = typeStyles[task.type] ?? typeStyles.Move
                  const Icon = style.icon
                  return (
                    <article
                      key={task.id}
                      className="rounded-xl border border-line bg-white p-2.5 transition-shadow hover:shadow-[0_6px_18px_-12px_rgba(15,36,27,0.35)]"
                    >
                      <div className="flex items-center gap-2">
                        <span className={cn('grid size-6 place-items-center rounded-md', style.className)}>
                          <Icon className="size-3.5" />
                        </span>
                        <span className="text-[9.5px] font-semibold tracking-wide text-faint uppercase">
                          {task.type}
                        </span>
                        <span className="ml-auto font-mono text-[9px] text-[#a3afa7]">{task.id}</span>
                      </div>
                      <p className="mt-2 text-[11px] leading-snug font-semibold text-ink">{task.title}</p>
                      <p className="mt-1 flex items-center gap-1 text-[9.5px] text-faint">
                        <MapPin className="size-2.5" />
                        {task.location}
                      </p>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <Badge
                          tone={task.priority === 'Tinggi' ? 'danger' : task.priority === 'Normal' ? 'info' : 'neutral'}
                          dot
                        >
                          {task.priority}
                        </Badge>
                        <span className="inline-flex items-center gap-1 text-[9px] text-faint">
                          <Timer className="size-2.5" />
                          {task.sla}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 border-t border-line pt-2">
                        {task.assignee === 'Belum ditugaskan' ? (
                          <span className="text-[9px] text-faint italic">Belum ditugaskan</span>
                        ) : (
                          <>
                            <Avatar name={task.assignee} size="xs" />
                            <span className="truncate text-[9.5px] text-ink-soft">{task.assignee}</span>
                          </>
                        )}
                      </div>
                    </article>
                  )
                })}
                {items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-line-strong px-3 py-6 text-center text-[10px] text-faint">
                    Tidak ada task
                  </div>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      <Panel>
        <PanelHeader title="Ringkasan per zona" subtitle="Beban kerja aktif" />
        <PanelBody className="grid grid-cols-2 gap-2.5 pt-0 sm:grid-cols-4">
          {[
            { zone: 'Zona A', tasks: 7, operators: 3 },
            { zone: 'Zona B', tasks: 5, operators: 2 },
            { zone: 'Zona C', tasks: 2, operators: 1 },
            { zone: 'Dock & Pack', tasks: 4, operators: 2 },
          ].map((item) => (
            <div key={item.zone} className="rounded-xl border border-line p-2.5">
              <p className="text-[10px] text-faint">{item.zone}</p>
              <p className="text-[15px] font-semibold text-ink tabular-nums">{item.tasks} task</p>
              <p className="text-[9px] text-faint">{item.operators} operator</p>
            </div>
          ))}
        </PanelBody>
      </Panel>
    </div>
  )
}
