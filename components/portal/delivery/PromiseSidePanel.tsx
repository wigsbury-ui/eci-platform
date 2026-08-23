'use client'

import { useEffect, useState } from 'react'
import type { Document } from '@/lib/types'
import type { PromiseEvidence, PromiseReview, ServicePromise } from '@/lib/delivery/types'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import { PROMISE_STATUSES, PROMISE_STATUS_LABELS } from '@/lib/delivery/types'
import { X, Trash2 } from 'lucide-react'

type Props = {
  promise: ServicePromise
  evidence: PromiseEvidence[]
  reviews: PromiseReview[]
  schoolDocuments?: Document[]
  onClose: () => void
  onUpdated?: (promise: ServicePromise) => void
  onEvidenceChange?: (evidence: PromiseEvidence[]) => void
  demoMode?: boolean
  readOnly?: boolean
  evidenceApiBase?: '/api/team/delivery' | '/api/school/delivery'
}

export default function PromiseSidePanel({
  promise,
  evidence: initialEvidence,
  reviews,
  schoolDocuments = [],
  onClose,
  onUpdated,
  onEvidenceChange,
  demoMode,
  readOnly,
  evidenceApiBase = '/api/team/delivery',
}: Props) {
  const [status, setStatus] = useState(promise.status)
  const [notes, setNotes] = useState(promise.notes ?? '')
  const [owner, setOwner] = useState(promise.owner_name ?? '')
  const [nextReview, setNextReview] = useState(promise.next_review_at ?? '')
  const [evidence, setEvidence] = useState(initialEvidence)
  const [evTitle, setEvTitle] = useState('')
  const [evUrl, setEvUrl] = useState('')
  const [evDocId, setEvDocId] = useState('')
  const [saving, setSaving] = useState(false)
  const [evSaving, setEvSaving] = useState(false)
  const [fileUploading, setFileUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setEvidence(initialEvidence)
  }, [initialEvidence])

  const uploadFile = async (file: File) => {
    if (readOnly || demoMode) return
    setFileUploading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('promiseId', promise.id)
      form.append('file', file)
      const res = await fetch('/api/team/delivery/evidence/upload', {
        method: 'POST',
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload failed')
      const next = [data.evidence, ...evidence]
      setEvidence(next)
      onEvidenceChange?.(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setFileUploading(false)
    }
  }

  const save = async () => {
    if (readOnly || !onUpdated) return

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

  const addEvidence = async () => {
    if (readOnly) return
    const title = evTitle.trim() || schoolDocuments.find(d => d.id === evDocId)?.title
    if (!title) {
      setError('Add a title or pick a document')
      return
    }

    if (demoMode) {
      const item: PromiseEvidence = {
        id: `demo-ev-${Date.now()}`,
        promise_id: promise.id,
        title,
        url: evUrl || null,
        document_id: evDocId || null,
        document_title: schoolDocuments.find(d => d.id === evDocId)?.title ?? null,
        document_file_url: schoolDocuments.find(d => d.id === evDocId)?.file_url ?? null,
        file_url: null,
        file_name: null,
        storage_path: null,
        added_by: null,
        created_at: new Date().toISOString(),
      }
      const next = [item, ...evidence]
      setEvidence(next)
      onEvidenceChange?.(next)
      setEvTitle('')
      setEvUrl('')
      setEvDocId('')
      return
    }

    setEvSaving(true)
    setError(null)
    try {
      const res = await fetch(`${evidenceApiBase}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promiseId: promise.id,
          title,
          url: evUrl || null,
          documentId: evDocId || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not add evidence')
      const next = [data.evidence, ...evidence]
      setEvidence(next)
      onEvidenceChange?.(next)
      setEvTitle('')
      setEvUrl('')
      setEvDocId('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add evidence')
    } finally {
      setEvSaving(false)
    }
  }

  const removeEvidence = async (id: string) => {
    if (readOnly) return
    if (demoMode) {
      const next = evidence.filter(e => e.id !== id)
      setEvidence(next)
      onEvidenceChange?.(next)
      return
    }
    const res = await fetch(`${evidenceApiBase}/evidence?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Could not remove evidence')
      return
    }
    const next = evidence.filter(e => e.id !== id)
    setEvidence(next)
    onEvidenceChange?.(next)
  }

  const evidenceHref = (ev: PromiseEvidence) => {
    if (ev.storage_path) return `/api/team/delivery/evidence/download/${ev.id}`
    return ev.document_file_url || ev.url || null
  }

  return (
    <aside
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-gray-200 bg-white shadow-2xl flex flex-col"
      aria-label="Service details"
    >
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div>
          <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-gray-400">Tracked service</p>
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
            <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2">What we deliver</p>
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

        {!readOnly && (
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
        )}

        {readOnly && promise.owner_name && (
          <p className="font-jost text-sm text-gray-600">
            <span className="text-gray-400">ECI owner:</span> {promise.owner_name}
          </p>
        )}

        <div>
          <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-2">Evidence</p>
          {evidence.length === 0 && (
            <p className="font-jost text-sm text-gray-500 mb-3">No evidence attached yet.</p>
          )}
          <ul className="space-y-2 mb-4">
            {evidence.map(ev => {
              const href = evidenceHref(ev)
              return (
                <li
                  key={ev.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm font-jost text-gray-700"
                >
                  <div className="min-w-0">
                    {href ? (
                      <a href={href} className="text-[#4C2585] hover:underline" target="_blank" rel="noreferrer">
                        {ev.document_title ?? ev.title}
                      </a>
                    ) : (
                      ev.title
                    )}
                    {ev.document_title && ev.title !== ev.document_title && (
                      <p className="text-xs text-gray-400 mt-0.5">{ev.title}</p>
                    )}
                  </div>
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => removeEvidence(ev.id)}
                      className="text-gray-400 hover:text-red-600 shrink-0"
                      aria-label="Remove evidence"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </li>
              )
            })}
          </ul>

          {!readOnly && (
            <div className="rounded-lg border border-gray-200 p-3 space-y-2">
              <p className="font-jost text-xs font-semibold text-gray-500">Add evidence</p>
              <input
                value={evTitle}
                onChange={e => setEvTitle(e.target.value)}
                placeholder="Label (optional if linking a document)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
              />
              <input
                value={evUrl}
                onChange={e => setEvUrl(e.target.value)}
                placeholder="External URL (optional)"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
              />
              {schoolDocuments.length > 0 && (
                <select
                  value={evDocId}
                  onChange={e => setEvDocId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
                >
                  <option value="">Link from document library…</option>
                  {schoolDocuments.map(d => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              )}
              <label className="block">
                <span className="font-jost text-xs text-gray-500">Upload file</span>
                <input
                  type="file"
                  disabled={fileUploading}
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) uploadFile(file)
                    e.target.value = ''
                  }}
                  className="mt-1 w-full text-sm font-jost"
                />
              </label>
              <button
                type="button"
                onClick={addEvidence}
                disabled={evSaving}
                className="rounded-lg bg-[#4C2585] px-3 py-2 text-sm font-jost font-semibold text-white hover:bg-[#2D1654] disabled:opacity-50"
              >
                {evSaving ? 'Adding…' : 'Attach evidence'}
              </button>
            </div>
          )}
        </div>

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

      {!readOnly && onUpdated && (
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
      )}
    </aside>
  )
}
