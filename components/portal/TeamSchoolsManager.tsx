'use client'

import { useState } from 'react'
import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { Profile, School } from '@/lib/types'
import { OPENING_SOON, OPERATING_SCHOOLS, EXPANSION_MARKETS } from '@/lib/content/network'
import {
  LayoutDashboard,
  Globe,
  Users,
  FileText,
  Inbox,
  Settings,
  Calendar,
  MessageSquare,
  Plus,
} from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/team', icon: <LayoutDashboard size={16} /> },
  { label: 'Schools', href: '/team/schools', icon: <Globe size={16} /> },
  { label: 'Users', href: '/team/users', icon: <Users size={16} /> },
  { label: 'Documents', href: '/team/documents', icon: <FileText size={16} /> },
  { label: 'Calendar', href: '/team/calendar', icon: <Calendar size={16} /> },
  { label: 'Messages', href: '/team/messages', icon: <MessageSquare size={16} /> },
  { label: 'Enquiries', href: '/team/enquiries', icon: <Inbox size={16} /> },
  { label: 'Settings', href: '/team/settings', icon: <Settings size={16} /> },
]

function seedSchools(): School[] {
  return [...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => ({
    id: s.id,
    name: s.name,
    country: s.country,
    city: s.city,
    status: s.status,
    logo_url: null,
    website: s.website || null,
    contact_name: null,
    contact_email: null,
    student_count: null,
    year_joined: s.year_joined || null,
    curriculum: s.curriculum,
    accreditations: null,
    description: s.description,
    short_bio: s.short_bio,
    is_public: true,
  }))
}

export default function TeamSchoolsClient({ profile }: { profile: Profile | null }) {
  const [schools, setSchools] = useState<School[]>(seedSchools())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', city: '', country: '', status: 'prospect' as School['status'] })
  const canManage = profile?.role === 'super_admin' || profile?.role === 'admin'

  const addSchool = (e: React.FormEvent) => {
    e.preventDefault()
    setSchools(prev => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        name: form.name,
        city: form.city,
        country: form.country,
        status: form.status,
        logo_url: null,
        website: null,
        contact_name: null,
        contact_email: null,
        student_count: null,
        year_joined: null,
        curriculum: [],
        accreditations: null,
        description: null,
        short_bio: 'Added via super admin (local preview — persist when Supabase is connected).',
        is_public: false,
      },
    ])
    setShowForm(false)
    setForm({ name: '', city: '', country: '', status: 'prospect' })
  }

  return (
    <PortalShell
      profile={profile}
      portalName="Super Admin"
      portalAccent="#E05C5C"
      navItems={NAV_ITEMS}
      activeSection="/team/schools"
    >
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="font-cormorant text-4xl text-eci-purple-dark">Network schools</h1>
          <p className="text-gray-400 text-sm font-jost mt-1">
            Add and manage partner schools. Expansion targets appear below for pipeline visibility.
          </p>
        </div>
        {canManage && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-eci-purple text-white px-4 py-2.5 text-sm font-jost font-semibold hover:bg-eci-purple-dark"
          >
            <Plus size={16} /> Add school
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={addSchool} className="bg-white border border-gray-100 p-6 mb-8 grid md:grid-cols-2 gap-4">
          {(['name', 'city', 'country'] as const).map(field => (
            <div key={field}>
              <label className="block text-xs font-jost uppercase text-gray-500 mb-1">{field}</label>
              <input
                required
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2 text-sm font-jost"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-jost uppercase text-gray-500 mb-1">Status</label>
            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value as School['status'] })}
              className="w-full border border-gray-200 px-3 py-2 text-sm font-jost"
            >
              <option value="prospect">Prospect</option>
              <option value="setting_up">Setting up</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-eci-purple text-white px-4 py-2 text-sm font-jost font-semibold">Save</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm font-jost text-gray-500">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-gray-100 divide-y divide-gray-50 mb-10">
        {schools.map(school => (
          <div key={school.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <p className="font-jost font-semibold text-gray-800">{school.name}</p>
              <p className="text-xs text-gray-400 font-jost">{school.city}, {school.country}</p>
            </div>
            <span className="text-xs font-jost px-2.5 py-1 bg-eci-purple-light text-eci-purple capitalize w-fit">
              {school.status.replace('_', ' ')}
            </span>
          </div>
        ))}
      </div>

      <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-4">Expansion pipeline</h2>
      <div className="grid md:grid-cols-2 gap-3">
        {EXPANSION_MARKETS.map(m => (
          <div key={m.id} className="bg-white border border-gray-100 p-5">
            <p className="font-cormorant text-xl text-eci-purple-dark">{m.name}</p>
            <p className="text-sm text-gray-500 font-jost mt-1">{m.detail}</p>
          </div>
        ))}
      </div>
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
