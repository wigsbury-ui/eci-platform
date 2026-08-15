'use client'

import { useState } from 'react'
import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { Profile, UserRole } from '@/lib/types'
import {
  LayoutDashboard, Globe, Users, FileText, Inbox, Settings, Calendar, MessageSquare, Plus,
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

type UserRow = { id: string; name: string; email: string; role: UserRole; school: string }

const SEED: UserRow[] = [
  { id: '1', name: 'Network Director', email: 'international@ellesmere.com', role: 'super_admin', school: '—' },
  { id: '2', name: 'Riyadh Head of School', email: 'head@ellesmerecollegeriyadh.com', role: 'school_partner', school: 'Ellesmere College Riyadh' },
  { id: '3', name: 'Prospective Investor', email: 'partner@example.com', role: 'investor', school: '—' },
]

export default function TeamUsersManager({ profile }: { profile: Profile | null }) {
  const [users, setUsers] = useState(SEED)
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'school_partner' as UserRole, school: '' })
  const canManage = profile?.role === 'super_admin' || profile?.role === 'admin'

  return (
    <PortalShell profile={profile} portalName="Super Admin" portalAccent="#C8A84B" navItems={NAV_ITEMS} activeSection="/team/users">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="font-cormorant text-4xl text-eci-purple-dark">Users & access</h1>
          <p className="text-gray-400 text-sm font-jost mt-1">
            Invite investors, school partners, and staff. Accounts are invite-only.
          </p>
        </div>
        {canManage && (
          <button onClick={() => setShow(true)} className="flex items-center gap-2 bg-eci-purple text-white px-4 py-2.5 text-sm font-jost font-semibold">
            <Plus size={16} /> Invite user
          </button>
        )}
      </div>

      {show && (
        <form
          onSubmit={e => {
            e.preventDefault()
            setUsers(u => [...u, { id: String(Date.now()), name: form.name, email: form.email, role: form.role, school: form.school || '—' }])
            setShow(false)
          }}
          className="bg-white border border-gray-100 p-6 mb-8 grid md:grid-cols-2 gap-4"
        >
          <input required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-gray-200 px-3 py-2 text-sm font-jost" />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-gray-200 px-3 py-2 text-sm font-jost" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })} className="border border-gray-200 px-3 py-2 text-sm font-jost">
            <option value="investor">Investor</option>
            <option value="school_partner">School partner</option>
            <option value="employee">Employee</option>
            <option value="board_member">Board member</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super admin</option>
          </select>
          <input placeholder="School (if partner)" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} className="border border-gray-200 px-3 py-2 text-sm font-jost" />
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-eci-purple text-white px-4 py-2 text-sm font-jost font-semibold">Create invite</button>
            <button type="button" onClick={() => setShow(false)} className="text-sm text-gray-500 font-jost">Cancel</button>
          </div>
          <p className="md:col-span-2 text-xs text-gray-400 font-jost">Connect Supabase Auth invites to send email automatically.</p>
        </form>
      )}

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-sm font-jost">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">School</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-gray-50">
                <td className="p-4 font-semibold text-gray-800">{u.name}</td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4 capitalize text-eci-purple">{u.role.replace('_', ' ')}</td>
                <td className="p-4 text-gray-500">{u.school}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
