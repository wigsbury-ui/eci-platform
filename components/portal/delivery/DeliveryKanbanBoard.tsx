'use client'

import type { ServicePromise, PromiseStatus } from '@/lib/delivery/types'
import { KANBAN_COLUMNS, PROMISE_STATUS_LABELS } from '@/lib/delivery/types'
import StatusBadge from '@/components/portal/delivery/StatusBadge'

type Props = {
  promises: ServicePromise[]
  onSelect: (promise: ServicePromise) => void
}

export default function DeliveryKanbanBoard({ promises, onSelect }: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {KANBAN_COLUMNS.map(status => {
        const column = promises.filter(p => p.status === status)
        return (
          <div key={status} className="min-w-0 rounded-xl border border-gray-200 bg-gray-50/80">
            <div className="border-b border-gray-200 px-3 py-2">
              <p className="font-jost text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {PROMISE_STATUS_LABELS[status as PromiseStatus]}
              </p>
              <p className="font-jost text-xs text-gray-400">{column.length}</p>
            </div>
            <ul className="p-2 space-y-2 max-h-[32rem] overflow-y-auto">
              {column.map(p => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(p)}
                    className="w-full rounded-lg border border-gray-200 bg-white p-3 text-left hover:border-[#C8A84B]/50 transition-colors"
                  >
                    <p className="font-jost text-xs text-gray-400">G{p.service_group}</p>
                    <p className="font-jost text-sm font-medium text-[#2D1654] mt-0.5 leading-snug">
                      {p.title}
                    </p>
                    {p.owner_name && (
                      <p className="font-jost text-xs text-gray-500 mt-1">{p.owner_name}</p>
                    )}
                    <div className="mt-2">
                      <StatusBadge status={p.status} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
