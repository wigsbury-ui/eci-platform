'use client'
import Link from 'next/link'
import { Profile, DocumentCategory, Announcement } from '@/lib/types'
import { FolderOpen, CheckSquare, Calendar, ExternalLink } from 'lucide-react'

const ICON_MAP: Record<string, string> = {
  shield: '🛡️', book: '📚', users: '👥', 'user-check': '✅',
  'chart-bar': '📊', heart: '❤️', mail: '📬', 'clipboard-check': '📋',
  'device-laptop': '💻', rocket: '🚀',
}

export default function SchoolDashboard({
  profile, categories, announcements
}: {
  profile: Profile | null
  categories: DocumentCategory[]
  announcements: Announcement[]
}) {
  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400 text-sm font-jost mb-1">School Partner Portal</p>
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">
          Welcome{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
        </h1>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Document Library', sub: `${categories.length} categories`, href: '/school/documents', icon: <FolderOpen size={22} />, colour: '#4C2585' },
          { label: 'Setup Checklist', sub: 'Track your progress', href: '/school/setup', icon: <CheckSquare size={22} />, colour: '#C8A84B' },
          { label: 'Network Events', sub: 'Upcoming calls & visits', href: '/school/announcements', icon: <Calendar size={22} />, colour: '#2D1654' },
        ].map(({ label, sub, href, icon, colour }) => (
          <Link key={label} href={href} className="bg-white rounded-xl border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: colour }}>
              {icon}
            </div>
            <div>
              <p className="font-jost font-semibold text-sm text-gray-800 group-hover:text-eci-purple transition-colors">{label}</p>
              <p className="text-xs text-gray-400 font-jost">{sub}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Document categories */}
        <div className="bg-white rounded-xl border border-gray-100 p-7">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-cormorant text-2xl text-eci-purple-dark">Document Library</h2>
            <Link href="/school/documents" className="text-xs font-jost text-eci-purple hover:underline flex items-center gap-1">
              View all <ExternalLink size={11} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {categories.slice(0, 8).map(cat => (
              <Link key={cat.id} href={`/school/documents?category=${cat.id}`}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-eci-purple-light transition-colors group">
                <span className="text-lg">{ICON_MAP[cat.icon || ''] || '📄'}</span>
                <span className="text-xs font-jost text-gray-700 group-hover:text-eci-purple leading-tight">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-xl border border-gray-100 p-7">
          <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Announcements</h2>
          {announcements.length === 0 ? (
            <p className="text-gray-400 text-sm font-jost">No announcements at this time.</p>
          ) : (
            <div className="space-y-4">
              {announcements.map(ann => (
                <div key={ann.id} className={`p-4 rounded-lg border-l-4 ${ann.is_pinned ? 'border-eci-gold bg-eci-gold-light/20' : 'border-eci-purple/30 bg-eci-purple-light/20'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-jost font-semibold text-sm text-gray-800">{ann.title}</p>
                    {ann.is_pinned && <span className="text-xs bg-eci-gold text-white px-2 py-0.5 rounded flex-shrink-0 font-jost">Pinned</span>}
                  </div>
                  <p className="text-xs text-gray-600 font-jost mt-1 leading-relaxed">{ann.body}</p>
                  <p className="text-xs text-gray-400 font-jost mt-2">{new Date(ann.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
