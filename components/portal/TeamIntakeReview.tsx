'use client'

import { useMemo, useState } from 'react'
import {
  Download,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { DocumentDraft, DocumentIntakeBatch, DocumentIntakeLink, IntakeBatchStatus, IntakePillar } from '@/lib/types'
import { INTAKE_BATCH_STATUSES, INTAKE_PILLARS } from '@/lib/intake/config'
import IntakeSharePanel from '@/components/portal/IntakeSharePanel'
import MarkdownPreview from '@/components/portal/MarkdownPreview'

type Props = {
  batches: DocumentIntakeBatch[]
  drafts: DocumentDraft[]
  intakeShareUrl: string | null
  siteBase: string
  links?: DocumentIntakeLink[]
  setupError?: string | null
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

export default function TeamIntakeReview({
  batches: initialBatches,
  drafts: initialDrafts,
  intakeShareUrl,
  siteBase,
  links = [],
  setupError = null,
}: Props) {
  const [batches, setBatches] = useState(initialBatches)
  const [drafts, setDrafts] = useState(initialDrafts)
  const [expanded, setExpanded] = useState<string | null>(initialBatches[0]?.id ?? null)
  const [filter, setFilter] = useState<IntakeBatchStatus | 'all'>('all')
  const [draftForm, setDraftForm] = useState<{
    batchId: string | null
    title: string
    pillar: IntakePillar | ''
    notes: string
    fileIds: string[]
  }>({ batchId: null, title: '', pillar: '', notes: '', fileIds: [] })
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null)
  const [draftBodyEdit, setDraftBodyEdit] = useState('')
  const [draftView, setDraftView] = useState<'preview' | 'edit'>('preview')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [messageTone, setMessageTone] = useState<'info' | 'error' | 'success'>('info')

  const showMessage = (text: string, tone: 'info' | 'error' | 'success' = 'info') => {
    setMessage(text)
    setMessageTone(tone)
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return batches
    return batches.filter(b => b.status === filter)
  }, [batches, filter])

  const selectedDraft = useMemo(
    () => drafts.find(d => d.id === selectedDraftId) ?? null,
    [drafts, selectedDraftId]
  )

  const updateBatch = async (
    batchId: string,
    patch: Partial<{
      status: IntakeBatchStatus
      suggested_pillar: IntakePillar | null
      review_notes: string
    }>
  ) => {
    setSaving(true)
    showMessage('')
    try {
      const res = await fetch(`/api/team/intake/batch/${batchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      const data = await res.json()
      if (!res.ok) {
        showMessage(data.error || 'Update failed', 'error')
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
      showMessage('Saved', 'success')
    } catch {
      showMessage('Update failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const openDraftForm = (batch: DocumentIntakeBatch) => {
    const files = batch.document_intake_files ?? []
    const firstName = files[0]?.file_name?.replace(/\.[^.]+$/, '') || 'Partner document'
    setDraftForm({
      batchId: batch.id,
      title: firstName,
      pillar: batch.suggested_pillar ?? '',
      notes:
        batch.notes ||
        'Rewrite as a polished partner document: confident prose, clear structure, and practical detail a school board could use. Preserve facts from the source; do not pad with repetitive section templates.',
      fileIds: files.map(f => f.id),
    })
    setExpanded(batch.id)
  }

  const createDraft = async () => {
    if (!draftForm.batchId || !draftForm.title.trim()) return
    if (!draftForm.fileIds.length) {
      showMessage(
        'No source files found on this submission. Re-upload the document, then try again.',
        'error'
      )
      return
    }

    setSaving(true)
    showMessage('Reading source files and drafting with Claude… this can take up to a minute.', 'info')
    try {
      const batch = batches.find(b => b.id === draftForm.batchId)
      const pillar = draftForm.pillar || batch?.suggested_pillar || null

      const res = await fetch('/api/team/intake/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draftForm.title.trim(),
          pillar,
          prompt_notes: draftForm.notes,
          source_batch_id: draftForm.batchId,
          source_file_ids: draftForm.fileIds,
          generate: true,
        }),
      })

      const raw = await res.text()
      let data: {
        error?: string
        draft?: DocumentDraft
      } = {}
      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        const jsonError = raw.match(/"error"\s*:\s*"([^"]+)"/)
        if (jsonError?.[1]) {
          showMessage(jsonError[1], 'error')
          return
        }
        const stripped = raw
          .replace(/<script[\s\S]*?<\/script>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
        if (/couldn.t load|server error occurred/i.test(stripped)) {
          showMessage(
            'The draft API failed to start on the server (not your file). Wait for the latest deploy to finish, then try again.',
            'error'
          )
          return
        }
        const snippet = stripped.slice(0, 180)
        showMessage(
          res.status === 504 || res.status === 408
            ? 'The request timed out while drafting. Please try again — longer documents may need a second attempt.'
            : snippet
              ? snippet
              : `Draft request failed (${res.status}). Please try again.`,
          'error'
        )
        return
      }

      if (!res.ok) {
        showMessage(data.error || `Could not create draft (${res.status}).`, 'error')
        return
      }

      if (!data.draft) {
        showMessage('Draft response was empty. Please try again.', 'error')
        return
      }

      setDrafts(prev => [data.draft!, ...prev.filter(d => d.id !== data.draft!.id)])
      setBatches(prev =>
        prev.map(b =>
          b.id === draftForm.batchId ? { ...b, status: 'ready_for_articulation' as IntakeBatchStatus } : b
        )
      )
      // Keep the form open so success does not look like a silent reset; scroll to the draft body.
      setSelectedDraftId(data.draft.id)
      setDraftBodyEdit(data.draft.body_markdown || '')
      setDraftView('preview')
      showMessage(
        data.draft.body_markdown
          ? 'Draft generated. Review the text in Articulation drafts below, edit if needed, then save.'
          : 'Draft saved, but the body was empty. Check ANTHROPIC_API_KEY and LLM_MODEL in Vercel, then generate again.',
        data.draft.body_markdown ? 'success' : 'error'
      )

      requestAnimationFrame(() => {
        document.getElementById('articulation-drafts')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } catch (err) {
      console.error('createDraft', err)
      showMessage('Could not create draft. Check your connection and try again.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const saveDraftBody = async () => {
    if (!selectedDraftId) return
    setSaving(true)
    showMessage('')
    try {
      const res = await fetch('/api/team/intake/draft', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: selectedDraftId, body_markdown: draftBodyEdit }),
      })
      const data = await res.json()
      if (!res.ok) {
        showMessage(data.error || 'Could not save draft', 'error')
        return
      }
      setDrafts(prev => prev.map(d => (d.id === selectedDraftId ? { ...d, ...data.draft } : d)))
      showMessage('Draft saved', 'success')
    } catch {
      showMessage('Could not save draft', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <IntakeSharePanel
        shareUrl={intakeShareUrl}
        siteBase={siteBase}
        links={links}
        setupError={setupError}
      />

      {message && (
        <p
          role={messageTone === 'error' ? 'alert' : 'status'}
          className={`text-sm font-jost px-4 py-2.5 rounded-lg border ${
            messageTone === 'error'
              ? 'text-red-800 bg-red-50 border-red-200'
              : messageTone === 'success'
                ? 'text-emerald-900 bg-emerald-50 border-emerald-200'
                : 'text-eci-purple bg-eci-purple-light/50 border-eci-purple/15'
          }`}
        >
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
                          Generate articulated draft
                        </p>
                        <p className="text-xs font-jost text-gray-600 leading-relaxed">
                          We will read the uploaded file(s), then draft a clearer partner document from that
                          content. Review and edit the result before treating it as final.
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
                          {saving ? 'Generating…' : 'Generate draft from sources'}
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

      <div id="articulation-drafts" className="bg-white border border-gray-100 rounded-xl p-6 space-y-4 scroll-mt-24">
        <div>
          <h2 className="font-cormorant text-xl text-eci-purple-dark mb-1">Articulation drafts</h2>
          <p className="text-sm text-gray-500 font-jost">
            Generated from intake sources. Preview reads like a document; Edit lets you refine the markdown.
          </p>
        </div>
        {drafts.length === 0 ? (
          <p className="text-sm text-gray-500 font-jost">
            No drafts yet. Expand a submission, click Start articulation draft, then Generate draft from sources.
          </p>
        ) : (
          <ul className="space-y-3">
            {drafts.map(draft => (
              <li key={draft.id} className="border border-gray-100 rounded-lg px-4 py-3 text-sm font-jost">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{draft.title}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {pillarLabel(draft.pillar)} · {draft.status} · {formatDate(draft.created_at)}
                      {draft.body_markdown ? ' · body ready' : ' · no body yet'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDraftId(draft.id)
                      setDraftBodyEdit(draft.body_markdown || '')
                      setDraftView('preview')
                    }}
                    className="text-xs font-semibold text-eci-purple hover:underline"
                  >
                    {selectedDraftId === draft.id ? 'Editing' : 'Open'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {selectedDraft && (
          <div className="border border-eci-purple/15 rounded-xl p-4 space-y-3 bg-[#FBF8F4]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-cormorant text-lg text-eci-purple-dark">{selectedDraft.title}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setDraftView('preview')}
                    className={`px-3 py-1 rounded-md text-xs font-jost font-semibold ${
                      draftView === 'preview' ? 'bg-eci-purple text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setDraftView('edit')}
                    className={`px-3 py-1 rounded-md text-xs font-jost font-semibold ${
                      draftView === 'edit' ? 'bg-eci-purple text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Edit
                  </button>
                </div>
                <button
                  type="button"
                  disabled={saving}
                  onClick={saveDraftBody}
                  className="bg-eci-purple text-white px-3 py-1.5 rounded-lg text-xs font-jost font-semibold disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save edits'}
                </button>
              </div>
            </div>
            {draftView === 'preview' ? (
              <div className="bg-white border border-gray-100 rounded-lg px-5 py-5 max-h-[min(70vh,720px)] overflow-y-auto">
                <MarkdownPreview markdown={draftBodyEdit} />
              </div>
            ) : (
              <textarea
                rows={18}
                value={draftBodyEdit}
                onChange={e => setDraftBodyEdit(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-3 text-sm font-jost leading-relaxed bg-white resize-y min-h-[280px]"
                placeholder="Draft body will appear here after generation."
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
