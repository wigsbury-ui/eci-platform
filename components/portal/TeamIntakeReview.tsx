'use client'

import { useMemo, useState } from 'react'
import {
  Download,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react'
import type { DocumentDraft, DocumentIntakeBatch, IntakeBatchStatus, IntakePillar } from '@/lib/types'
import { INTAKE_BATCH_STATUSES, INTAKE_PILLARS } from '@/lib/intake/config'

type Props = {
  batches: DocumentIntakeBatch[]
  drafts: DocumentDraft[]
  intakeShareUrl: string | null
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function pillarLabel(value: string | null) {
  return INTAKE_PILLARS.find(p => p.value === value)?.label ?? 'Unassigned'
}

export default function TeamIntakeReview({ batches: initialBatches, drafts: initialDrafts, intakeShareUrl }: Props) {
  const [batches, setBatches] = useState(initialBatches)
  const [drafts, setDrafts] = useState(initialDrafts)
  const [expanded, setExpanded] = useState<string | null>(initialBatches[0]?.id ?? null)
  const [filter, setFilter] = useState<IntakeBatchStatus | 'all'>('all')
  const [copied, setCopied] = useState(false)
  const [draftForm, setDraftForm] = useState<{
    batchId: string | null
    title: string
    pillar: IntakePillar | ''
    notes: string
    fileIds: string[]
  }>({ batchId: null, title: '', pillar: '', notes: '', fileIds: [] })
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const filtered = useMemo(() => {
    if (filter === 'all') return batches
    return batches.filter(b => b.status === filter)
  }, [batches, filter])

  const copyLink = async () => {
    if (!intakeShareUrl) return
    try {
      await navigator.clipboard.writeText(intakeShareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setMessage('Could not copy link')
    }
  }

  const updateBatch = async (
    batchId: string,
    patch: Partial<{
      status: IntakeBatchStatus
      suggested_pillar: IntakePillar | null
      review_notes: string
    }>
  ) => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/team/intake/batch/${batchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Update failed')
        return
      }
      setBatches(prev =>
        prev.map(b =>
          b.id === batchId
            ? {
                ...b,
                ...data.batch,
                document_intake_files: b.document_intake_files,
              }
            : b
        )
      )
      setMessage('Saved')
    } catch {
      setMessage('Update failed')
    } finally {
      setSaving(false)
    }
  }

  const openDraftForm = (batch: DocumentIntakeBatch) => {
    const files = batch.document_intake_files ?? []
    setDraftForm({
      batchId: batch.id,
      title: `Articulated document from ${batch.submitter_name}`,
      pillar: batch.suggested_pillar ?? '',
      notes: batch.notes ?? '',
      fileIds: files.map(f => f.id),
    })
    setExpanded(batch.id)
  }

  const createDraft = async () => {
    if (!draftForm.batchId || !draftForm.title.trim()) return
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/team/intake/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftForm.title.trim(),
          pillar: draftForm.pillar || null,
          prompt_notes: draftForm.notes,
          source_batch_id: draftForm.batchId,
          source_file_ids: draftForm.fileIds,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage(data.error || 'Could not create draft')
        return
      }
      setDrafts(prev => [data.draft, ...prev])
      setBatches(prev =>
        prev.map(b =>
          b.id === draftForm.batchId ? { ...b, status: 'ready_for_articulation' as IntakeBatchStatus } : b
        )
      )
      setDraftForm({ batchId: null, title: '', pillar: '', notes: '', fileIds: [] })
      setMessage('Articulation draft created. Use it as the working document for improved partner copy.')
    } catch {
      setMessage('Could not create draft')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white border border-gray-100 rounded-xl p-6">
        <h2 className="font-cormorant text-xl text-eci-purple-dark mb-2">Colleague upload link</h2>
        <p className="text-sm text-gray-500 font-jost mb-4 leading-relaxed">
          Share this link by email. Colleagues must enter <strong>name and email</strong> before files are
          accepted. Uploads stay inside ECI for review and articulation, not in the partner library until
          you publish finished documents.
        </p>
        {intakeShareUrl ? (
          <div className="flex flex-wrap items-center gap-3">
            <code className="text-xs bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg font-mono text-gray-700 max-w-full truncate">
              {intakeShareUrl}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 text-sm font-jost font-semibold text-eci-purple hover:text-eci-purple-dark"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy link'}
            </button>
          </div>
        ) : (
          <p className="text-sm font-jost text-amber-800 bg-amber-50 border border-amber-100 px-4 py-3 rounded-lg">
            Set <code className="font-mono text-xs">DOCUMENT_INTAKE_TOKEN</code> and{' '}
            <code className="font-mono text-xs">SUPABASE_SERVICE_ROLE_KEY</code> in the environment, then
            redeploy. Link format: /intake/your-secret-token
          </p>
        )}
      </div>

      {message && (
        <p className="text-sm font-jost text-eci-purple bg-eci-purple-light/50 px-4 py-2.5 rounded-lg">
          {message}
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-jost font-semibold ${
            filter === 'all' ? 'bg-eci-purple text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          All ({batches.length})
        </button>
        {INTAKE_BATCH_STATUSES.map(s => {
          const count = batches.filter(b => b.status === s.value).length
          if (!count && s.value !== 'new') return null
          return (
            <button
              key={s.value}
              type="button"
              onClick={() => setFilter(s.value)}
              className={`px-3 py-1.5 rounded-full text-xs font-jost font-semibold ${
                filter === s.value ? 'bg-eci-purple text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {s.label} ({count})
            </button>
          )
        })}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-xl p-10 text-center text-gray-500 font-jost text-sm">
            No intake submissions yet. Share the upload link with colleagues to collect source material.
          </div>
        ) : (
          filtered.map(batch => {
            const open = expanded === batch.id
            const files = batch.document_intake_files ?? []
            return (
              <div key={batch.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(open ? null : batch.id)}
                  className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50/80"
                >
                  <div>
                    <p className="font-jost font-semibold text-gray-900">
                      {batch.submitter_name}
                      <span className="text-gray-400 font-normal"> · {batch.submitter_email}</span>
                    </p>
                    <p className="text-xs text-gray-400 font-jost mt-1">
                      {formatDate(batch.created_at)} · {files.length} file{files.length === 1 ? '' : 's'}
                      {batch.department ? ` · ${batch.department}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-jost font-semibold uppercase tracking-wide text-eci-purple">
                      {INTAKE_BATCH_STATUSES.find(s => s.value === batch.status)?.label}
                    </span>
                    {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                  </div>
                </button>

                {open && (
                  <div className="px-5 pb-5 border-t border-gray-50 space-y-4">
                    {batch.notes && (
                      <p className="text-sm font-jost text-gray-600 bg-[#F8F4EF] rounded-lg px-4 py-3 mt-4">
                        {batch.notes}
                      </p>
                    )}

                    <ul className="space-y-2">
                      {files.map(file => (
                        <li
                          key={file.id}
                          className="flex items-center gap-3 text-sm font-jost border border-gray-100 rounded-lg px-3 py-2"
                        >
                          <FileText size={16} className="text-eci-purple shrink-0" />
                          <span className="flex-1 truncate">{file.file_name}</span>
                          <span className="text-gray-400 text-xs">{formatBytes(file.file_size_bytes)}</span>
                          <a
                            href={`/api/team/intake/download/${file.id}`}
                            className="inline-flex items-center gap-1 text-eci-purple font-semibold text-xs hover:underline"
                          >
                            <Download size={14} />
                            Download
                          </a>
                        </li>
                      ))}
                    </ul>

                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase mb-1">
                          Status
                        </label>
                        <select
                          value={batch.status}
                          disabled={saving}
                          onChange={e =>
                            updateBatch(batch.id, { status: e.target.value as IntakeBatchStatus })
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-jost"
                        >
                          {INTAKE_BATCH_STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase mb-1">
                          Pillar
                        </label>
                        <select
                          value={batch.suggested_pillar ?? ''}
                          disabled={saving}
                          onChange={e =>
                            updateBatch(batch.id, {
                              suggested_pillar: (e.target.value || null) as IntakePillar | null,
                            })
                          }
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-jost"
                        >
                          <option value="">Unassigned</option>
                          {INTAKE_PILLARS.map(p => (
                            <option key={p.value} value={p.value}>{p.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() => openDraftForm(batch)}
                          className="w-full inline-flex items-center justify-center gap-2 bg-eci-purple text-white py-2 rounded-lg text-sm font-jost font-semibold hover:bg-eci-purple-dark disabled:opacity-50"
                        >
                          <Sparkles size={16} />
                          Start articulation draft
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-jost font-semibold text-gray-500 uppercase mb-1">
                        Review notes
                      </label>
                      <textarea
                        rows={2}
                        value={batch.review_notes ?? ''}
                        disabled={saving}
                        onChange={e => {
                          const value = e.target.value
                          setBatches(prev =>
                            prev.map(b => (b.id === batch.id ? { ...b, review_notes: value } : b))
                          )
                        }}
                        onBlur={e =>
                          updateBatch(batch.id, { review_notes: e.target.value })
                        }
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-jost resize-none"
                        placeholder="Reuse, adapt, or replace. Gaps for articulated version."
                      />
                    </div>

                    {draftForm.batchId === batch.id && (
                      <div className="border border-eci-purple/20 bg-eci-purple-light/30 rounded-xl p-4 space-y-3">
                        <p className="text-sm font-jost font-semibold text-eci-purple-dark">
                          New articulation draft
                        </p>
                        <input
                          type="text"
                          value={draftForm.title}
                          onChange={e => setDraftForm(f => ({ ...f, title: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-jost bg-white"
                          placeholder="Working title for the improved document"
                        />
                        <textarea
                          rows={3}
                          value={draftForm.notes}
                          onChange={e => setDraftForm(f => ({ ...f, notes: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-jost resize-none bg-white"
                          placeholder="What should the articulated document cover? Audience, tone, gaps to fix."
                        />
                        <button
                          type="button"
                          disabled={saving || !draftForm.title.trim()}
                          onClick={createDraft}
                          className="bg-[#2D1654] text-white px-4 py-2 rounded-lg text-sm font-jost font-semibold disabled:opacity-50"
                        >
                          Create draft record
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {drafts.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-cormorant text-xl text-eci-purple-dark mb-4">Articulation drafts</h2>
          <p className="text-sm text-gray-500 font-jost mb-4">
            Working records linked to source intake files. Next step: draft body text here or via your LLM
            workflow, then publish finished documents to the partner library.
          </p>
          <ul className="space-y-3">
            {drafts.map(draft => (
              <li key={draft.id} className="border border-gray-100 rounded-lg px-4 py-3 text-sm font-jost">
                <p className="font-semibold text-gray-900">{draft.title}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {pillarLabel(draft.pillar)} · {draft.status} · {formatDate(draft.created_at)}
                </p>
                {draft.prompt_notes && (
                  <p className="text-gray-600 mt-2 text-xs leading-relaxed">{draft.prompt_notes}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
