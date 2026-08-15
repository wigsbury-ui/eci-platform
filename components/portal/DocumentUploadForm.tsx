'use client'

import { useState } from 'react'
import { DocScope } from '@/lib/types'
import { Upload, CheckCircle2 } from 'lucide-react'

const SCOPE_OPTIONS: { value: DocScope; label: string }[] = [
  { value: 'network', label: 'Network archive' },
  { value: 'school', label: 'School archive' },
  { value: 'investor_marketing', label: 'Investor marketing' },
  { value: 'investor_dd', label: 'Investor due diligence' },
  { value: 'team', label: 'Team / internal' },
]

export type UploadPayload = {
  title: string
  description: string
  scope: DocScope
  file: File | null
}

interface DocumentUploadFormProps {
  canUpload?: boolean
  onUpload?: (payload: UploadPayload) => void | Promise<void>
  defaultScope?: DocScope
}

export default function DocumentUploadForm({
  canUpload = false,
  onUpload,
  defaultScope = 'school',
}: DocumentUploadFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [scope, setScope] = useState<DocScope>(defaultScope)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'queued' | 'done'>('idle')
  const [submitting, setSubmitting] = useState(false)

  if (!canUpload) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const payload: UploadPayload = { title, description, scope, file }

    try {
      if (onUpload) {
        await onUpload(payload)
        setStatus('done')
      } else {
        setStatus('queued')
      }
      setTitle('')
      setDescription('')
      setFile(null)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-gray-100 rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <Upload size={16} className="text-eci-purple" />
        <h3 className="font-cormorant text-xl text-eci-purple-dark">Upload document</h3>
      </div>
      <p className="text-xs text-gray-400 font-jost">
        Add a file to the selected archive. Storage activation is required for permanent uploads.
      </p>

      <div>
        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Title
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-purple"
        />
      </div>

      <div>
        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Description
        </label>
        <textarea
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-purple resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Scope
        </label>
        <select
          value={scope}
          onChange={e => setScope(e.target.value as DocScope)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-jost focus:outline-none focus:border-eci-purple bg-white"
        >
          {SCOPE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          File
        </label>
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="w-full text-sm font-jost text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-eci-purple-light file:text-eci-purple file:font-jost file:font-semibold file:text-xs"
        />
      </div>

      {status === 'queued' && (
        <p className="text-sm font-jost text-eci-purple bg-eci-purple-light/60 px-3 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={14} />
          Upload queued — connect Supabase Storage to activate
        </p>
      )}
      {status === 'done' && (
        <p className="text-sm font-jost text-green-700 bg-green-50 px-3 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle2 size={14} />
          Upload submitted
        </p>
      )}

      <button
        type="submit"
        disabled={submitting || !title.trim()}
        className="w-full bg-eci-purple text-white py-3 rounded-lg font-jost font-semibold text-sm hover:bg-eci-purple-dark transition-colors disabled:opacity-50"
      >
        {submitting ? 'Submitting…' : 'Upload'}
      </button>
    </form>
  )
}
