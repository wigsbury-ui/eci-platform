'use client'

import type { ServicePromise } from '@/lib/delivery/types'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import { ChevronRight } from 'lucide-react'

const QUICK_STATUSES: Array<{
  status: ServicePromise['status']
  label: string
  active: string
  idle: string
}> = [
  {
    status: 'green',
    label: 'On track',
    active: 'bg-emerald-600 text-white border-emerald-600',
    idle: 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50',
  },
  {
    status: 'amber',
    label: 'At risk',
    active: 'bg-amber-500 text-white border-amber-500',
    idle: 'bg-white text-amber-900 border-amber-200 hover:bg-amber-50',
  },
  {
    status: 'red',
    label: 'Off track',
    active: 'bg-red-600 text-white border-red-600',
    idle: 'bg-white text-red-800 border-red-200 hover:bg-red-50',
  },
]

type Props = {
  promise: ServicePromise
  groupLabel?: string
  onOpen: () => void
  onStatusChange: (status: ServicePromise['status']) => void
  statusSaving?: boolean
}

function formatReviewDate(iso: string | null) {
  if (!iso) return null
  try {
    return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function DeliveryCommitmentCard({
  promise,
  groupLabel,
  onOpen,
  onStatusChange,
  statusSaving,
}: Props) {
  const reviewDate = formatReviewDate(promise.next_review_at)
  const overdue =
    promise.next_review_at &&
    promise.next_review_at < new Date().toISOString().slice(0, 10) &&
    promise.status !== 'green' &&
    promise.status !== 'over_delivered'

  return (
    <article
      className={`rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        promise.status === 'red'
          ? 'border-red-200 ring-1 ring-red-100'
          : promise.status === 'amber'
            ? 'border-amber-200'
            : 'border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {groupLabel && (
            <p className="font-jost text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              {groupLabel}
            </p>
          )}
          <h3 className="font-cormorant text-xl text-[#2D1654] leading-tight">{promise.title}</h3>
        </div>
        <StatusBadge status={promise.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {QUICK_STATUSES.map(opt => (
          <button
            key={opt.status}
            type="button"
            disabled={statusSaving}
            onClick={() => onStatusChange(opt.status)}
            className={`rounded-md border px-2.5 py-1 text-[11px] font-jost font-semibold transition-colors disabled:opacity-50 ${
              promise.status === opt.status ? opt.active : opt.idle
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm font-jost">
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-gray-400">Owner</dt>
          <dd className="text-gray-700">{promise.owner_name ?? 'Not assigned'}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-wide text-gray-400">Next review</dt>
          <dd className={overdue ? 'text-red-700 font-semibold' : 'text-gray-700'}>
            {reviewDate ?? 'Not set'}
            {overdue && ' · overdue'}
          </dd>
        </div>
      </dl>

      {promise.notes && (
        <p className="mt-2 font-jost text-xs text-gray-500 line-clamp-2 border-t border-gray-100 pt-2">
          {promise.notes}
        </p>
      )}

      <button
        type="button"
        onClick={onOpen}
        className="mt-3 flex w-full items-center justify-between rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2 text-sm font-jost font-medium text-[#4C2585] hover:bg-[#F8F4EF]"
      >
        Evidence, notes & criteria
        <ChevronRight size={16} className="text-gray-400" />
      </button>
    </article>
  )
}
