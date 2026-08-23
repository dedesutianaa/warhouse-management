import { Info, Plus, Tags } from 'lucide-react'
import { PageHeader } from '@/components/ui-kit/page-header'
import { Panel, PanelBody, PanelFooter, PanelHeader } from '@/components/ui-kit/panel'
import { StatCard } from '@/components/ui-kit/stat-card'
import { Badge, StatusBadge } from '@/components/ui-kit/badge'
import { Progress } from '@/components/ui-kit/progress'
import { buttonStyles } from '@/components/ui-kit/button'
import { reasonCodes } from '@/lib/data'

const categories = ['Adjustment', 'Inbound', 'Outbound', 'Retur', 'Inventori']

export default function ReasonCodesPage() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Reason Code"
        description="Kode alasan standar untuk adjustment, selisih, retur, hold, dan short pick."
        actions={
          <button className={buttonStyles({ variant: 'primary' })}>
            <Plus className="size-3.5" />
            Tambah reason
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total reason code" value="12" hint="5 kategori" icon={<Tags className="size-4" />} />
        <StatCard label="Paling sering" value="PICK-SHORT" hint="56 penggunaan" icon={<Tags className="size-4" />} tone="amber" />
        <StatCard label="Kategori" value="5" hint="inbound → retur" icon={<Tags className="size-4" />} tone="blue" />
        <StatCard label="Status aktif" value="12/12" hint="semua tersedia" icon={<Tags className="size-4" />} tone="violet" />
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Panel className="col-span-12 overflow-hidden xl:col-span-8">
          <PanelHeader
            title="Daftar reason code"
            subtitle="Dipakai di mobile, web, dan API"
            action={<Badge tone="mint">12 aktif</Badge>}
          />
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-y border-line bg-[#fafbf9]">
                  {['Kode', 'Label', 'Kategori', 'Penggunaan 30 hari', 'Status'].map((head) => (
                    <th key={head} className="px-4 py-2.5 text-[10px] font-semibold tracking-[0.08em] text-[#8a988f] uppercase">
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reasonCodes.map((code) => (
                  <tr key={code.code} className="border-b border-line/80 last:border-0 hover:bg-[#fafcf9]">
                    <td className="px-4 py-2.5">
                      <span className="rounded-md bg-panel px-1.5 py-0.5 font-mono text-[10px] font-semibold text-ink">
                        {code.code}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] text-ink-soft">{code.label}</td>
                    <td className="px-4 py-2.5">
                      <Badge tone="neutral">{code.category}</Badge>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex w-36 items-center gap-2">
                        <Progress value={(code.usage / 60) * 100} tone="green" className="h-1" />
                        <span className="text-[9.5px] text-faint tabular-nums">{code.usage}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <StatusBadge status={code.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PanelFooter>
            <span>Reason code wajib untuk adjustment & hold</span>
            <span>Dapat diekspor</span>
          </PanelFooter>
        </Panel>

        <div className="col-span-12 space-y-4 xl:col-span-4">
          <Panel>
            <PanelHeader title="Distribusi kategori" subtitle="Penggunaan 30 hari" />
            <PanelBody className="space-y-3 pt-0">
              {categories.map((category) => {
                const total = reasonCodes
                  .filter((code) => code.category === category)
                  .reduce((sum, code) => sum + code.usage, 0)
                return (
                  <div key={category}>
                    <div className="mb-1 flex items-center justify-between text-[10.5px]">
                      <span className="text-ink-soft">{category}</span>
                      <span className="font-semibold text-ink tabular-nums">{total}</span>
                    </div>
                    <Progress value={(total / 120) * 100} tone="green" />
                  </div>
                )
              })}
            </PanelBody>
          </Panel>

          <Panel>
            <PanelHeader title="Panduan penggunaan" subtitle="Konsistensi data" icon={<Info className="size-3.5 text-[#16a34a]" />} />
            <PanelBody className="space-y-2 pt-0">
              {[
                'Gunakan satu kode untuk satu jenis kejadian agar laporan selisih akurat.',
                'Reason code tidak dapat dihapus jika sudah dipakai transaksi — nonaktifkan saja.',
                'Kode khusus hazmat & cold chain wajib disertai foto bukti.',
              ].map((tip) => (
                <p key={tip} className="rounded-lg bg-panel px-2.5 py-2 text-[10px] leading-relaxed text-ink-soft">
                  {tip}
                </p>
              ))}
            </PanelBody>
          </Panel>
        </div>
      </div>
    </div>
  )
}
