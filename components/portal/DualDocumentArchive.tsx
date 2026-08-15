'use client'

import { useMemo, useState } from 'react'
import { Document, DocumentCategory } from '@/lib/types'
import {
  Search,
  Download,
  FileText,
  FileSpreadsheet,
  FileCheck,
  BookOpen,
  Folder,
  Network,
  School,
} from 'lucide-react'
import DocumentUploadForm from '@/components/portal/DocumentUploadForm'

type ArchiveTab = 'network' | 'school'

const TYPE_ICONS: Record<string, React.ReactNode> = {
  guidance: <BookOpen size={14} />,
  template: <FileSpreadsheet size={14} />,
  policy: <FileCheck size={14} />,
  form: <FileText size={14} />,
  report: <FileText size={14} />,
  marketing: <FileText size={14} />,
  due_diligence: <FileCheck size={14} />,
}

const TYPE_COLOURS: Record<string, string> = {
  guidance: 'bg-blue-50 text-blue-700',
  template: 'bg-green-50 text-green-700',
  policy: 'bg-purple-50 text-purple-700',
  form: 'bg-amber-50 text-amber-700',
  report: 'bg-gray-50 text-gray-700',
  marketing: 'bg-eci-gold-light/40 text-eci-purple-dark',
  due_diligence: 'bg-eci-purple-light text-eci-purple',
}

function groupByFolder(docs: Document[]): Record<string, Document[]> {
  const groups: Record<string, Document[]> = {}
  for (const doc of docs) {
    const key = doc.folder_path?.trim() || 'General'
    if (!groups[key]) groups[key] = []
    groups[key].push(doc)
  }
  return groups
}

function matchesSearch(doc: Document, search: string) {
  if (!search) return true
  const q = search.toLowerCase()
  return (
    doc.title.toLowerCase().includes(q) ||
    (doc.description?.toLowerCase().includes(q) ?? false) ||
    (doc.folder_path?.toLowerCase().includes(q) ?? false)
  )
}

interface DualDocumentArchiveProps {
  networkDocs: Document[]
  schoolDocs: Document[]
  categories?: DocumentCategory[]
  canUpload?: boolean
  schoolLabel?: string
}

export default function DualDocumentArchive({
  networkDocs,
  schoolDocs,
  categories = [],
  canUpload = false,
  schoolLabel = 'School archive',
}: DualDocumentArchiveProps) {
  const [tab, setTab] = useState<ArchiveTab>('network')
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<string | null>(null)

  const docs = tab === 'network' ? networkDocs : schoolDocs

  const filtered = useMemo(
    () =>
      docs.filter(doc => {
        const matchCat = !categoryId || doc.category_id === categoryId
        return matchCat && matchesSearch(doc, search)
      }),
    [docs, search, categoryId]
  )

  const grouped = useMemo(() => groupByFolder(filtered), [filtered])
  const folderNames = Object.keys(grouped).sort((a, b) => a.localeCompare(b))

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Document Archives</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">
          Network policies and templates, plus your school-specific files
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-100 pb-4">
        <button
          type="button"
          onClick={() => setTab('network')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-jost font-semibold transition-colors ${
            tab === 'network'
              ? 'bg-eci-purple text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Network size={15} />
          Network archive
          <span className={`text-xs ${tab === 'network' ? 'text-white/70' : 'text-gray-400'}`}>
            ({networkDocs.length})
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTab('school')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-jost font-semibold transition-colors ${
            tab === 'school'
              ? 'bg-eci-purple text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <School size={15} />
          {schoolLabel}
          <span className={`text-xs ${tab === 'school' ? 'text-white/70' : 'text-gray-400'}`}>
            ({schoolDocs.length})
          </span>
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title, description, or folder…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm font-jost focus:outline-none focus:border-eci-purple"
        />
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            type="button"
            onClick={() => setCategoryId(null)}
            className={`px-3 py-1.5 rounded-lg text-xs font-jost font-semibold transition-colors ${
              !categoryId ? 'bg-eci-purple text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(categoryId === cat.id ? null : cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-jost font-semibold transition-colors ${
                categoryId === cat.id
                  ? 'bg-eci-purple text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className={`grid gap-8 ${canUpload ? 'lg:grid-cols-[1fr_320px]' : ''}`}>
        <div>
          {folderNames.length === 0 ? (
            <div className="text-center py-16 text-gray-400 bg-white border border-gray-100 rounded-xl">
              <FileText size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-jost">No documents match your search.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {folderNames.map(folder => (
                <section key={folder}>
                  <div className="flex items-center gap-2 mb-3">
                    <Folder size={16} className="text-eci-gold" />
                    <h2 className="font-cormorant text-xl text-eci-purple-dark">{folder}</h2>
                    <span className="text-xs text-gray-400 font-jost">
                      {grouped[folder].length}
                    </span>
                  </div>
                  <div className="grid gap-3">
                    {grouped[folder].map(doc => (
                      <div
                        key={doc.id}
                        className="bg-white border border-gray-100 rounded-xl p-5 flex items-start justify-between gap-4 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="w-10 h-10 bg-eci-purple-light rounded-lg flex items-center justify-center flex-shrink-0 text-eci-purple">
                            <FileText size={18} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-jost font-semibold text-sm text-gray-800">
                                {doc.title}
                              </p>
                              <span
                                className={`text-xs px-2 py-0.5 rounded font-jost flex items-center gap-1 ${
                                  TYPE_COLOURS[doc.doc_type] || 'bg-gray-50 text-gray-600'
                                }`}
                              >
                                {TYPE_ICONS[doc.doc_type]} {doc.doc_type.replace('_', ' ')}
                              </span>
                              {doc.version && (
                                <span className="text-xs text-gray-300 font-jost">
                                  v{doc.version}
                                </span>
                              )}
                            </div>
                            {doc.description && (
                              <p className="text-xs text-gray-500 font-jost leading-relaxed">
                                {doc.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-300 font-jost mt-1">
                              {doc.document_categories?.name}
                              {doc.file_size_kb
                                ? ` · ${Math.round((doc.file_size_kb / 1024) * 10) / 10} MB`
                                : ''}
                            </p>
                          </div>
                        </div>
                        {doc.file_url ? (
                          <a
                            href={doc.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs font-jost text-eci-purple hover:text-eci-purple-dark bg-eci-purple-light px-3 py-2 rounded-lg flex-shrink-0 transition-colors"
                          >
                            <Download size={13} /> Download
                          </a>
                        ) : (
                          <span className="text-xs font-jost text-gray-400 flex-shrink-0 px-3 py-2 bg-gray-50 rounded-lg">
                            File pending
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {canUpload && (
          <DocumentUploadForm
            canUpload
            defaultScope={tab === 'network' ? 'network' : 'school'}
          />
        )}
      </div>
    </div>
  )
}
