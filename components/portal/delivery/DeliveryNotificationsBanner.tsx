'use client'

import { useState } from 'react'
import type { DeliveryNotification } from '@/lib/delivery/types'

type Props = {
  notifications: DeliveryNotification[]
  onMarkRead?: (id: string) => void
  apiBase?: '/api/team/delivery' | '/api/school/delivery'
}

export default function DeliveryNotificationsBanner({
  notifications,
  onMarkRead,
  apiBase = '/api/team/delivery',
}: Props) {
  const unread = notifications.filter(n => !n.read_at)
  const [hidden, setHidden] = useState(false)

  if (hidden || unread.length === 0) return null

  const markRead = async (id: string) => {
    if (onMarkRead) {
      onMarkRead(id)
      return
    }
    await fetch(`${apiBase}/notifications`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  return (
    <div className="mb-6 rounded-xl border border-[#C8A84B]/40 bg-[#F8F4EF] p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="font-jost text-sm font-semibold text-[#2D1654]">
          {unread.length} new update{unread.length === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          onClick={() => setHidden(true)}
          className="font-jost text-xs text-gray-500 hover:text-gray-700"
        >
          Hide
        </button>
      </div>
      <ul className="mt-3 space-y-2">
        {unread.slice(0, 5).map(n => (
          <li key={n.id} className="flex items-start justify-between gap-3 rounded-lg bg-white/80 px-3 py-2">
            <div>
              <p className="font-jost text-sm font-medium text-[#2D1654]">{n.title}</p>
              <p className="font-jost text-xs text-gray-600 mt-0.5">{n.body}</p>
            </div>
            <button
              type="button"
              onClick={() => markRead(n.id)}
              className="shrink-0 font-jost text-xs text-[#4C2585] hover:underline"
            >
              Mark read
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
