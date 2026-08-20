'use client'

import { useState } from 'react'
import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { PartnerChannel, PartnerStatus, Profile, UserRole } from '@/lib/types'
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

type UserRow = {
  id: string
  name: string
  email: string
  role: UserRole
  school: string
  partner_status: PartnerStatus | null
  partner_channel: PartnerChannel | null
}

const SEED: UserRow[] = [
  {
    id: '1',
    name: 'Network Director',
    email: 'international@ellesmere.com',
    role: 'super_admin',
    school: '—',
    partner_status: null,
    partner_channel: null,
  },
  {
    id: '2',
    name: 'Riyadh Head of School',
    email: 'head@ellesmerecollegeriyadh.com',
    role: 'school_partner',
    school: 'Ellesmere College Riyadh',
    partner_status: null,
    partner_channel: null,
  },
  {
    id: '3',
    name: 'Prospective Investor',
    email: 'partner@example.com',
    role: 'investor',
    school: '—',
    partner_status: null,
    partner_channel: null,
  },
  {
    id: '4',
    name: 'Applicant Agent',
    email: 'agent.applicant@example.com',
    role: 'agent',
    school: '—',
    partner_status: 'applicant',
    partner_channel: 'agent',
  },
  {
    id: '5',
    name: 'Accepted Rainmaker',
    email: 'rainmaker@example.com',
    role: 'agent',
    school: '—',
    partner_status: 'accepted',
    partner_channel: 'rainmaker',
  },
]

export default function TeamUsersManager({ profile }: { profile: Profile | null }) {
  const [users, setUsers] = useState(SEED)
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    role: 'school_partner' as UserRole,
    school: '',
    partner_channel: 'agent' as PartnerChannel,
  })
  const canManage = profile?.role === 'super_admin' || profile?.role === 'admin'

  const acceptPartner = (id: string) => {
    setUsers(list =>
      list.map(u => (u.id === id ? { ...u, partner_status: 'accepted' as const } : u))
    )
  }

  const revertToApplicant = (id: string) => {
    setUsers(list =>
      list.map(u => (u.id === id ? { ...u, partner_status: 'applicant' as const } : u))
    )
  }

  return (
    <PortalShell profile={profile} portalName="Super Admin" portalAccent="#C8A84B" navItems={NAV_ITEMS} activeSection="/team/users">
      <div className="flex justify-between items-start mb-8 gap-4">
        <div>
          <h1 className="font-cormorant text-4xl text-eci-purple-dark">Users & access</h1>
          <p className="text-gray-400 text-sm font-jost mt-1 max-w-2xl">
            Invite introduction partners as applicants first. Accept them when ready so marketing
            resources and investor materials unlock in their portal.
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
            const isPartner = form.role === 'agent'
            setUsers(u => [
              ...u,
              {
                id: String(Date.now()),
                name: form.name,
                email: form.email,
                role: form.role,
                school: form.school || '—',
                partner_status: isPartner ? 'applicant' : null,
                partner_channel: isPartner ? form.partner_channel : null,
              },
            ])
            setShow(false)
          }}
          className="bg-white border border-gray-100 p-6 mb-8 grid md:grid-cols-2 gap-4"
        >
          <input required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="border border-gray-200 px-3 py-2 text-sm font-jost" />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border border-gray-200 px-3 py-2 text-sm font-jost" />
          <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value as UserRole })} className="border border-gray-200 px-3 py-2 text-sm font-jost">
            <option value="investor">Investor</option>
            <option value="agent">Introduction partner (agent / rainmaker)</option>
            <option value="school_partner">School partner</option>
            <option value="employee">Employee</option>
            <option value="board_member">Board member</option>
            <option value="admin">Admin</option>
            <option value="super_admin">Super admin</option>
          </select>
          {form.role === 'agent' ? (
            <select
              value={form.partner_channel}
              onChange={e => setForm({ ...form, partner_channel: e.target.value as PartnerChannel })}
              className="border border-gray-200 px-3 py-2 text-sm font-jost"
            >
              <option value="agent">Channel: Introduction agent</option>
              <option value="rainmaker">Channel: Rainmaker</option>
            </select>
          ) : (
            <input placeholder="School (if partner)" value={form.school} onChange={e => setForm({ ...form, school: e.target.value })} className="border border-gray-200 px-3 py-2 text-sm font-jost" />
          )}
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" className="bg-eci-purple text-white px-4 py-2 text-sm font-jost font-semibold">
              {form.role === 'agent' ? 'Invite as applicant' : 'Create invite'}
            </button>
            <button type="button" onClick={() => setShow(false)} className="text-sm text-gray-500 font-jost">Cancel</button>
          </div>
          <p className="md:col-span-2 text-xs text-gray-400 font-jost">
            Introduction partners start as applicants (About ECI, why partner, sample contracts). Use
            Accept below to unlock marketing resources. Connect Supabase Auth invites for live email.
          </p>
        </form>
      )}

      <div className="bg-white border border-gray-100 overflow-hidden">
        <table className="w-full text-sm font-jost">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Partner access</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t border-gray-50">
                <td className="p-4 font-semibold text-gray-800">{u.name}</td>
                <td className="p-4 text-gray-500">{u.email}</td>
                <td className="p-4 capitalize text-eci-purple">{u.role.replace('_', ' ')}</td>
                <td className="p-4 text-gray-500">
                  {u.role === 'agent' ? (
                    <span>
                      <span className="capitalize">{u.partner_status}</span>
                      {u.partner_channel ? ` · ${u.partner_channel}` : ''}
                    </span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="p-4">
                  {canManage && u.role === 'agent' && u.partner_status === 'applicant' && (
                    <button
                      type="button"
                      onClick={() => acceptPartner(u.id)}
                      className="text-sm font-semibold text-eci-purple hover:underline"
                    >
                      Accept partner
                    </button>
                  )}
                  {canManage && u.role === 'agent' && u.partner_status === 'accepted' && (
                    <button
                      type="button"
                      onClick={() => revertToApplicant(u.id)}
                      className="text-sm text-gray-400 hover:underline"
                    >
                      Revert to applicant
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PortalChatbot audience="team" />
    </PortalShell>
  )
}
