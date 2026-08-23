import Link from 'next/link'
import type { ServicePromise } from '@/lib/delivery/types'
import StatusBadge from '@/components/portal/delivery/StatusBadge'

type Props = {
  promises: ServicePromise[]
  schoolId?: string
  schoolName?: string
  groupFilter?: number | 'all'
  onSelect?: (promise: ServicePromise) => void
  emptyMessage?: string
}

export default function DeliveryPromiseLedger({
  promises,
  schoolId,
  schoolName,
  groupFilter = 'all',
  onSelect,
  emptyMessage,
}: Props) {
  const filtered =
    groupFilter === 'all'
      ? promises
      : promises.filter(p => p.service_group === groupFilter)

  const sorted = [...filtered].sort(
    (a, b) => a.service_group - b.service_group || a.title.localeCompare(b.title)
  )

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-5 py-8 text-center">
        <p className="font-jost text-sm text-gray-600">
          {emptyMessage ??
            'No promises on the ledger yet. Use “Activate full Group” below or create one service at a time.'}
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-[#2D1654]/15 bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-[#F8F4EF]/60 px-4 py-3">
        <div>
          <p className="font-jost text-sm font-semibold text-[#2D1654]">
            {sorted.length} promise{sorted.length === 1 ? '' : 's'} on the ledger
            {schoolName ? ` · ${schoolName}` : ''}
            {groupFilter !== 'all' ? ` · Group ${groupFilter}` : ''}
          </p>
          <p className="font-jost text-xs text-gray-500 mt-0.5">
            These are the live records you track — status, owner, evidence, and reviews live on the school board.
          </p>
        </div>
        {schoolId && (
          <Link
            href={`/team/delivery/schools/${schoolId}`}
            className="rounded-lg bg-[#2D1654] px-4 py-2 text-sm font-jost font-semibold text-white hover:bg-[#4C2585]"
          >
            Open school board →
          </Link>
        )}
      </div>
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr className="font-jost text-[10px] uppercase tracking-wider text-gray-400">
            <th className="px-4 py-2.5">Promise</th>
            <th className="px-4 py-2.5">Group</th>
            <th className="px-4 py-2.5">Status</th>
            <th className="px-4 py-2.5">Owner</th>
            <th className="px-4 py-2.5">Next review</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(p => (
            <tr
              key={p.id}
              className={`border-b border-gray-50 ${onSelect ? 'cursor-pointer hover:bg-[#F8F4EF]/50' : ''}`}
              onClick={() => onSelect?.(p)}
            >
              <td className="px-4 py-3 font-jost text-sm text-[#2D1654]">{p.title}</td>
              <td className="px-4 py-3 font-jost text-xs text-gray-500">G{p.service_group}</td>
              <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              <td className="px-4 py-3 font-jost text-sm text-gray-600">{p.owner_name ?? '—'}</td>
              <td className="px-4 py-3 font-jost text-sm text-gray-600">
                {p.next_review_at ? new Date(p.next_review_at).toLocaleDateString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
