'use client'

import { useMemo, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EmptyState } from './empty-state'
import { FilterSelect, SearchField } from './toolbar'

export type Column<T> = {
  key: string
  header: string
  className?: string
  headClassName?: string
  render: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
}

export type DataTableColumn<T> = Column<T>

export type FilterDef<T> = {
  key: string
  label: string
  options: string[]
  match: (row: T, value: string) => boolean
}

export function DataTable<T>({
  rows,
  columns,
  getRowKey,
  search,
  searchPlaceholder = 'Cari…',
  filters,
  pageSize = 8,
  toolbar,
  rowHref,
  emptyTitle = 'Belum ada data',
  emptyDescription,
  minWidth = 760,
  footerNote,
}: {
  rows: T[]
  columns: Column<T>[]
  getRowKey: (row: T) => string
  search?: (row: T) => string
  searchPlaceholder?: string
  filters?: FilterDef<T>[]
  pageSize?: number
  toolbar?: ReactNode
  rowHref?: (row: T) => string
  emptyTitle?: string
  emptyDescription?: string
  minWidth?: number
  footerNote?: ReactNode
}) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<Record<string, string>>({})
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' } | null>(null)

  const filtered = useMemo(() => {
    let result = rows
    if (query.trim() && search) {
      const q = query.trim().toLowerCase()
      result = result.filter((row) => search(row).toLowerCase().includes(q))
    }
    for (const filter of filters ?? []) {
      const value = active[filter.key]
      if (value) result = result.filter((row) => filter.match(row, value))
    }
    if (sort) {
      const column = columns.find((item) => item.key === sort.key)
      if (column?.sortValue) {
        const getValue = column.sortValue
        result = [...result].sort((a, b) => {
          const av = getValue(a)
          const bv = getValue(b)
          if (av < bv) return sort.dir === 'asc' ? -1 : 1
          if (av > bv) return sort.dir === 'asc' ? 1 : -1
          return 0
        })
      }
    }
    return result
  }, [rows, query, active, sort, columns, search, filters])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount - 1)
  const start = currentPage * pageSize
  const visible = filtered.slice(start, start + pageSize)

  return (
    <div>
      <div className="flex flex-col gap-2 px-5 pb-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          {search ? (
            <SearchField
              value={query}
              onChange={(value) => {
                setQuery(value)
                setPage(0)
              }}
              placeholder={searchPlaceholder}
              className="w-full sm:w-60"
            />
          ) : null}
          {filters?.map((filter) => (
            <FilterSelect
              key={filter.key}
              label={filter.label}
              options={filter.options}
              value={active[filter.key] ?? ''}
              onChange={(value) => {
                setActive((prev) => ({ ...prev, [filter.key]: value }))
                setPage(0)
              }}
              className="w-full sm:w-40"
            />
          ))}
        </div>
        {toolbar ? <div className="flex items-center gap-2">{toolbar}</div> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left" style={{ minWidth }}>
          <thead>
            <tr className="border-y border-line bg-[#fafbf9]">
              {columns.map((column) => {
                const isSorted = sort?.key === column.key
                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={cn(
                      'px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] whitespace-nowrap text-[#8a988f] uppercase',
                      column.headClassName,
                    )}
                  >
                    {column.sortValue ? (
                      <button
                        onClick={() =>
                          setSort((prev) =>
                            prev?.key === column.key
                              ? { key: column.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
                              : { key: column.key, dir: 'asc' },
                          )
                        }
                        className="inline-flex items-center gap-1 transition-colors hover:text-ink"
                      >
                        {column.header}
                        {isSorted ? (
                          sort?.dir === 'asc' ? (
                            <ArrowUp className="size-3" />
                          ) : (
                            <ArrowDown className="size-3" />
                          )
                        ) : null}
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr
                key={getRowKey(row)}
                onClick={rowHref ? () => router.push(rowHref(row)) : undefined}
                className={cn(
                  'border-b border-line/80 transition-colors last:border-0',
                  rowHref && 'cursor-pointer hover:bg-[#fafcf9]',
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn('px-4 py-3 align-middle text-[12px] text-ink-soft', column.className)}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          icon={<Inbox className="size-5" />}
          title={emptyTitle}
          description={emptyDescription ?? 'Coba ubah kata kunci atau filter yang dipakai.'}
        />
      ) : null}

      <div className="flex flex-col gap-2 border-t border-line px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-faint">
          {footerNote ?? (
            <>
              Menampilkan{' '}
              <span className="font-medium text-ink-soft">
                {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + pageSize, filtered.length)}
              </span>{' '}
              dari <span className="font-medium text-ink-soft">{filtered.length}</span> data
            </>
          )}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            aria-label="Halaman sebelumnya"
            className="grid size-7 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:bg-panel disabled:opacity-40"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="px-2 text-[11px] font-medium text-ink-soft tabular-nums">
            {currentPage + 1} / {pageCount}
          </span>
          <button
            onClick={() => setPage(Math.min(pageCount - 1, currentPage + 1))}
            disabled={currentPage >= pageCount - 1}
            aria-label="Halaman berikutnya"
            className="grid size-7 place-items-center rounded-lg border border-line text-ink-soft transition-colors hover:bg-panel disabled:opacity-40"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
