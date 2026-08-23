'use client'

import { useState } from 'react'
import type { ServicePromise, PromiseStatus } from '@/lib/delivery/types'
import { KANBAN_COLUMNS, PROMISE_STATUS_LABELS } from '@/lib/delivery/types'
import StatusBadge from '@/components/portal/delivery/StatusBadge'

type Props = {
  promises: ServicePromise[]
  onSelect: (promise: ServicePromise) => void
  onStatusChange?: (promiseId: string, status: PromiseStatus) => void
  readOnly?: boolean
}

export default function DeliveryKanbanBoard({
  promises,
  onSelect,
  onStatusChange,
  readOnly,
}: Props) {
  const [dragId, setDragId] = useState<string | null>(null)

  const handleDrop = (status: PromiseStatus) => {
    if (readOnly || !dragId || !onStatusChange) return
    const promise = promises.find(p => p.id === dragId)
    if (promise && promise.status !== status) {
      onStatusChange(dragId, status)
    }
    setDragId(null)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      {KANBAN_COLUMNS.map(status => {
        const column = promises.filter(p => p.status === status)
        return (
          <div
            key={status}
            className="min-w-0 rounded-xl border border-gray-200 bg-gray-50/80"
            onDragOver={e => {
              if (!readOnly && onStatusChange) e.preventDefault()
            }}
            onDrop={e => {
              e.preventDefault()
              handleDrop(status as PromiseStatus)
            }}
          >
            <div className="border-b border-gray-200 px-3 py-2">
              <p className="font-jost text-[11px] font-bold uppercase tracking-wider text-gray-500">
                {PROMISE_STATUS_LABELS[status as PromiseStatus]}
              </p>
              <p className="font-jost text-xs text-gray-400">{column.length}</p>
            </div>
            <ul className="p-2 space-y-2 max-h-[32rem] overflow-y-auto">
              {column.map(p => (
                <li key={p.id}>
                  <div
                    draggable={!readOnly && !!onStatusChange}
                    onDragStart={() => setDragId(p.id)}
                    onDragEnd={() => setDragId(null)}
                    className={`rounded-lg border border-gray-200 bg-white p-3 ${
                      !readOnly && onStatusChange ? 'cursor-grab active:cursor-grabbing' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onSelect(p)}
                      className="w-full text-left hover:opacity-90"
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
