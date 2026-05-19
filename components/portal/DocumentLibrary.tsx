'use client'
import { useState } from 'react'
import { DocumentCategory, Document } from '@/lib/types'
import { Search, Download, FileText, FileSpreadsheet, FileCheck, BookOpen } from 'lucide-react'

const ICON_MAP: Record<string, string> = {
  shield: '🛡️', book: '📚', users: '👥', 'user-check': '✅',
  'chart-bar': '📊', heart: '❤️', mail: '📬', 'clipboard-check': '📋',
  'device-laptop': '💻', rocket: '🚀',
}
const TYPE_ICONS: Record<string, React.ReactNode> = {
  guidance: <BookOpen size={14} />,
  template: <FileSpreadsheet size={14} />,
  policy: <FileCheck size={14} />,
  form: <FileText size={14} />,
  report: <FileText size={14} />,
}
const TYPE_COLOURS: Record<string, string> = {
  guidance: 'bg-blue-50 text-blue-700',
  template: 'bg-green-50 text-green-700',
  policy: 'bg-purple-50 text-purple-700',
  form: 'bg-amber-50 text-amber-700',
  report: 'bg-gray-50 text-gray-700',
}

export default function DocumentLibrary({ categories, documents }: { categories: DocumentCategory[], documents: Document[] }) {
  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState<string | null>(null)

  const filtered = documents.filter(doc => {
    const matchSearch = !search || doc.title.toLowerCase().includes(search.toLowerCase()) || doc.description?.toLowerCase().includes(search.toLowerCase())
    const matchCat = !selectedCat || doc.category_id === selectedCat
    return matchSearch && matchCat
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Document Library</h1>
        <p className="text-gray-400 text-sm font-jost mt-1">Guidance documents, templates, and policies for ECI network schools</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm font-jost focus:outline-none focus:border-eci-purple"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCat(null)}
          className={`px-4 py-2 rounded-full text-xs font-jost font-semibold transition-colors ${!selectedCat ? 'bg-eci-purple text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          All ({documents.length})
        </button>
        {categories.map(cat => {
          const count = documents.filter(d => d.category_id === cat.id).length
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(selectedCat === cat.id ? null : cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-jost font-semibold transition-colors flex items-center gap-1.5 ${selectedCat === cat.id ? 'bg-eci-purple text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <span>{ICON_MAP[cat.icon || ''] || '📄'}</span>
              {cat.name} ({count})
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-jost">No documents match your search.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(doc => (
            <div key={doc.id} className="bg-white border border-gray-100 rounded-xl p-5 flex items-start justify-between gap-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-10 h-10 bg-eci-purple-light rounded-lg flex items-center justify-center flex-shrink-0 text-eci-purple">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-jost font-semibold text-sm text-gray-800">{doc.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded font-jost flex items-center gap-1 ${TYPE_COLOURS[doc.doc_type]}`}>
                      {TYPE_ICONS[doc.doc_type]} {doc.doc_type}
                    </span>
                    <span className="text-xs text-gray-300 font-jost">v{doc.version}</span>
                  </div>
                  {doc.description && <p className="text-xs text-gray-500 font-jost leading-relaxed">{doc.description}</p>}
                  <p className="text-xs text-gray-300 font-jost mt-1">
                    {doc.document_categories?.name}
                    {doc.file_size_kb ? ` · ${Math.round(doc.file_size_kb / 1024 * 10) / 10} MB` : ''}
                  </p>
                </div>
              </div>
              {doc.file_url ? (
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-jost text-eci-purple hover:text-eci-purple-dark bg-eci-purple-light px-3 py-2 rounded-lg flex-shrink-0 transition-colors">
                  <Download size={13} /> Download
                </a>
              ) : (
                <span className="text-xs font-jost text-gray-300 flex-shrink-0 px-3 py-2">No file yet</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
