import type { PromiseStatus } from '@/lib/delivery/types'
import { PROMISE_STATUS_LABELS } from '@/lib/delivery/types'

const STYLES: Record<PromiseStatus, string> = {
  green: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  amber: 'bg-amber-50 text-amber-900 border-amber-200',
  red: 'bg-red-50 text-red-800 border-red-200',
  pending_verification: 'bg-violet-50 text-violet-800 border-violet-200',
  over_delivered: 'bg-[#F8F4EF] text-[#2D1654] border-[#C8A84B]/50',
}

export default function StatusBadge({ status }: { status: PromiseStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-jost font-semibold uppercase tracking-wide ${STYLES[status]}`}
    >
      {PROMISE_STATUS_LABELS[status]}
    </span>
  )
}
