'use client'

import { useCallback, useState } from 'react'
import { Upload, CheckCircle2, AlertCircle, FileText, X } from 'lucide-react'
import { validateIntakeFile, isValidEmail } from '@/lib/intake/validation'
import { INTAKE_MAX_FILES_PER_BATCH } from '@/lib/intake/config'

type Props = {
  token: string
}

type Status = 'idle' | 'uploading' | 'success' | 'error'

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentIntakeDropzone({ token }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [notes, setNotes] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const addFiles = useCallback((list: FileList | File[]) => {
    const incoming = Array.from(list)
    const errors: string[] = []
    const accepted: File[] = []

    for (const file of incoming) {
      const problem = validateIntakeFile(file)
      if (problem) errors.push(problem)
      else accepted.push(file)
    }

    if (errors.length) setError(errors[0])
    else setError('')

    setFiles(prev => {
      const merged = [...prev]
      for (const f of accepted) {
        if (merged.length >= INTAKE_MAX_FILES_PER_BATCH) break
        const dup = merged.some(
          x => x.name === f.name && x.size === f.size && x.lastModified === f.lastModified
        )
        if (!dup) merged.push(f)
      }
      return merged.slice(0, INTAKE_MAX_FILES_PER_BATCH)
    })
  }, [])

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files)
    },
    [addFiles]
  )

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const canSubmit =
    name.trim().length > 0 &&
    isValidEmail(email) &&
    files.length > 0 &&
    status !== 'uploading'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) {
      if (!name.trim()) setError('Please enter your name.')
      else if (!isValidEmail(email)) setError('Please enter a valid email address.')
      else if (!files.length) setError('Please add at least one file.')
      return
    }

    setStatus('uploading')
    setError('')

    const form = new FormData()
    form.set('token', token)
    form.set('submitter_name', name.trim())
    form.set('submitter_email', email.trim())
    if (department.trim()) form.set('department', department.trim())
    if (notes.trim()) form.set('notes', notes.trim())
    for (const file of files) form.append('files', file)

    try {
      const res = await fetch('/api/intake/upload', { method: 'POST', body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus('error')
        setError(typeof data.error === 'string' ? data.error : 'Upload failed. Please try again.')
        return
      }
      setStatus('success')
      setFiles([])
      setNotes('')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white rounded-2xl border border-[#4C2585]/10 p-10 text-center shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#EDE5F7] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="text-[#4C2585]" size={28} />
        </div>
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-2">Thank you</h2>
        <p className="text-gray-600 font-jost text-sm leading-relaxed max-w-md mx-auto">
          Your files are saved in the ECI system. The team will use them to develop articulated partner
          documentation. You can close this page or upload another batch.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-8 text-sm font-jost font-semibold text-[#4C2585] hover:text-[#2D1654]"
        >
          Upload more files
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Your name <span className="text-[#4C2585]">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-jost focus:outline-none focus:border-[#4C2585]"
          />
        </div>
        <div>
          <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Email <span className="text-[#4C2585]">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-jost focus:outline-none focus:border-[#4C2585]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Department or school (optional)
        </label>
        <input
          type="text"
          value={department}
          onChange={e => setDepartment(e.target.value)}
          placeholder="e.g. Ellesmere College Riyadh, Curriculum team"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-jost focus:outline-none focus:border-[#4C2585]"
        />
      </div>

      <div>
        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Notes (optional)
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="What are these files? Current version, topic, or anything that helps us articulate the right document."
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-jost focus:outline-none focus:border-[#4C2585] resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
          Files <span className="text-[#4C2585]">*</span>
        </label>
        <div
          onDragOver={e => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`relative rounded-xl border-2 border-dashed transition-colors p-8 text-center ${
            dragOver
              ? 'border-[#4C2585] bg-[#EDE5F7]/60'
              : 'border-gray-200 bg-[#F8F4EF]/80 hover:border-[#4C2585]/40'
          }`}
        >
          <Upload className="mx-auto mb-3 text-[#4C2585]" size={28} />
          <p className="font-jost text-sm text-gray-700 mb-1">
            Drag and drop files here, or{' '}
            <label className="text-[#4C2585] font-semibold cursor-pointer hover:underline">
              browse
              <input
                type="file"
                multiple
                className="hidden"
                onChange={e => {
                  if (e.target.files?.length) addFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </label>
          </p>
          <p className="font-jost text-xs text-gray-400">
            PDF, Word, Excel, PowerPoint, images, text, and zip. Up to {INTAKE_MAX_FILES_PER_BATCH}{' '}
            files, 50 MB each.
          </p>
        </div>

        {files.length > 0 && (
          <ul className="mt-4 space-y-2">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${file.size}-${i}`}
                className="flex items-center gap-3 bg-white border border-gray-100 rounded-lg px-3 py-2 text-sm font-jost"
              >
                <FileText size={16} className="text-[#4C2585] shrink-0" />
                <span className="flex-1 truncate text-gray-800">{file.name}</span>
                <span className="text-gray-400 text-xs shrink-0">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-gray-400 hover:text-red-600 p-1"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p className="text-sm font-jost text-red-700 bg-red-50 px-4 py-3 rounded-lg flex items-start gap-2">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full bg-[#4C2585] text-white py-3.5 rounded-lg font-jost font-semibold text-sm hover:bg-[#2D1654] transition-colors disabled:opacity-50"
      >
        {status === 'uploading' ? 'Uploading…' : 'Submit to ECI document intake'}
      </button>
    </form>
  )
}
