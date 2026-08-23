'use client'

import { useState } from 'react'
import type { PromiseEvidence, PromiseReview, ServicePromise } from '@/lib/delivery/types'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import { PROMISE_STATUSES, PROMISE_STATUS_LABELS } from '@/lib/delivery/types'
import { X } from 'lucide-react'

type Props = {
  promise: ServicePromise
  evidence: PromiseEvidence[]
  reviews: PromiseReview[]
  onClose: () => void
  onUpdated: (promise: ServicePromise) => void
  demoMode?: boolean
}

export default function PromiseSidePanel({
  promise,
  evidence,
  reviews,
  onClose,
  onUpdated,
  demoMode,
}: Props) {
  const [status, setStatus] = useState(promise.status)
  const [notes, setNotes] = useState(promise.notes ?? '')
  const [owner, setOwner] = useState(promise.owner_name ?? '')
  const [nextReview, setNextReview] = useState(promise.next_review_at ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = async () => {
    if (demoMode) {
      onUpdated({
        ...promise,
        status,
        notes,
        owner_name: owner || null,
        next_review_at: nextReview || null,
        last_reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      return
    }

    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/team/delivery/promises', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: promise.id,
          status,
          notes,
          owner_name: owner || null,
          next_review_at: nextReview || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not save')
      onUpdated({
        ...promise,
        ...data.promise,
        success_criteria: promise.success_criteria,
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-gray-200 bg-white shadow-2xl flex flex-col"
      aria-label="Promise detail"
    >
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div>
          <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-gray-400">Promise</p>
          <h2 className="font-cormorant text-2xl text-[#2D1654] leading-snug mt-1">{promise.title}</h2>
          <div className="mt-2">
            <StatusBadge status={promise.status} />
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {promise.promise_text && (
          <div>
            <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Promise
            </p>
            <p className="font-jost text-sm text-gray-600 leading-relaxed">{promise.promise_text}</p>
          </div>
        )}

        {promise.success_criteria.length > 0 && (
          <div>
            <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Success criteria
            </p>
            <ul className="space-y-1.5">
              {promise.success_criteria.map(c => (
                <li key={c} className="font-jost text-sm text-gray-600 flex gap-2">
                  <span className="text-[#C8A84B]">·</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-3">
          <label className="block">
            <span className="font-jost text-xs text-gray-500">Status</span>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as ServicePromise['status'])}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
            >
              {PROMISE_STATUSES.map(s => (
                <option key={s} value={s}>{PROMISE_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="font-jost text-xs text-gray-500">Owner</span>
            <input
              value={owner}
              onChange={e => setOwner(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
              placeholder="ECI owner name"
            />
          </label>
          <label className="block">
            <span className="font-jost text-xs text-gray-500">Next review</span>
            <input
              type="date"
              value={nextReview}
              onChange={e => setNextReview(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
            />
          </label>
          <label className="block">
            <span className="font-jost text-xs text-gray-500">Notes</span>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
            />
          </label>
        </div>

        {evidence.length > 0 && (
          <div>
            <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Evidence
            </p>
            <ul className="space-y-2">
              {evidence.map(ev => (
                <li key={ev.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-jost text-gray-700">
                  {ev.url ? (
                    <a href={ev.url} className="text-[#4C2585] hover:underline" target="_blank" rel="noreferrer">
                      {ev.title}
                    </a>
                  ) : (
                    ev.title
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {reviews.length > 0 && (
          <div>
            <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              Review history
            </p>
            <ul className="space-y-2">
              {reviews.map(r => (
                <li key={r.id} className="rounded-lg border border-gray-100 px-3 py-2 text-xs font-jost text-gray-600">
                  <span className="text-gray-400">{new Date(r.reviewed_at).toLocaleDateString()}</span>
                  {' · '}
                  {r.previous_status ?? '—'} → {r.new_status}
                  {r.notes && <p className="mt-1 text-gray-500">{r.notes}</p>}
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="text-sm font-jost text-red-600">{error}</p>}
      </div>

      <div className="border-t border-gray-100 px-5 py-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="w-full rounded-lg bg-[#2D1654] py-2.5 text-sm font-jost font-semibold text-white hover:bg-[#4C2585] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </aside>
  )
}
