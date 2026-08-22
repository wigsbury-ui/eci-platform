'use client'
import Link from 'next/link'
import { CalendarPlus, School as SchoolIcon, ExternalLink, Briefcase, Handshake, Building2, LayoutDashboard } from 'lucide-react'
import { School, InvestorEnquiry, Announcement } from '@/lib/types'

const FLAG: Record<string, string> = { China: '🇨🇳', UAE: '🇦🇪', Singapore: '🇸🇬', Kenya: '🇰🇪', Canada: '🇨🇦' }
const STATUS_COLOUR: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  setting_up: 'bg-amber-100 text-amber-700',
  prospect: 'bg-blue-100 text-blue-700',
  paused: 'bg-gray-100 text-gray-600',
}
const ENQUIRY_STATUS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_review: 'bg-amber-100 text-amber-700',
  progressing: 'bg-purple-100 text-purple-700',
  closed: 'bg-gray-100 text-gray-500',
}

export default function AdminDashboard({ schools, enquiries, announcements, documentsCount }: {
  schools: School[], enquiries: InvestorEnquiry[], announcements: Announcement[], documentsCount: number
}) {
  const active = schools.filter(s => s.status === 'active').length
  const totalStudents = schools.reduce((a, s) => a + (s.student_count || 0), 0)
  const newEnquiries = enquiries.filter(e => e.status === 'new').length

  return (
    <div>
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm font-jost mb-1">Admin & Governance</p>
          <h1 className="font-cormorant text-4xl text-eci-purple-dark">ECI Network Dashboard</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/team/calendar"
            className="inline-flex items-center gap-2 bg-eci-gold text-eci-purple-dark px-4 py-2.5 rounded-lg text-sm font-jost font-semibold hover:bg-eci-gold-light transition-colors"
          >
            <CalendarPlus size={16} />
            Add calendar block
          </Link>
          <Link
            href="/team/schools"
            className="inline-flex items-center gap-2 border border-eci-gold text-eci-purple-dark px-4 py-2.5 rounded-lg text-sm font-jost font-semibold hover:bg-eci-gold-light/40 transition-colors"
          >
            <SchoolIcon size={16} />
            Add school
          </Link>
        </div>
      </div>

      <div className="mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            href: '/team',
            label: 'Super Admin',
            hint: 'Team & governance',
            icon: LayoutDashboard,
          },
          {
            href: '/investor',
            label: 'Investor portal',
            hint: 'Briefings & markets',
            icon: Briefcase,
          },
          {
            href: '/agent',
            label: 'Agent portal',
            hint: 'Referrals & resources',
            icon: Handshake,
          },
          {
            href: '/school',
            label: 'School portal',
            hint: 'Partner school view',
            icon: Building2,
          },
        ].map(p => (
          <Link
            key={p.href}
            href={p.href}
            className="flex items-start gap-3 bg-white border border-eci-gold/30 rounded-xl p-4 hover:border-eci-gold transition-colors"
          >
            <span className="mt-0.5 text-eci-gold">
              <p.icon size={18} />
            </span>
            <span>
              <span className="block font-jost text-sm font-semibold text-eci-purple-dark">{p.label}</span>
              <span className="block text-xs text-gray-500 font-jost mt-0.5">{p.hint}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mb-8 grid sm:grid-cols-2 gap-4">
        <Link
          href="/team/calendar"
          className="block bg-white border border-eci-gold/35 rounded-xl p-5 hover:border-eci-gold transition-colors"
        >
          <p className="text-[10px] font-jost font-semibold uppercase tracking-wide text-eci-gold mb-1">
            Calendar
          </p>
          <p className="font-cormorant text-2xl text-eci-purple-dark">Create a time block</p>
          <p className="text-sm text-gray-500 font-jost mt-1">
            Book visits on Admin and any school calendar in one step, e.g. Admin + Riyadh.
          </p>
        </Link>
        <Link
          href="/team/schools"
          className="block bg-white border border-gray-100 rounded-xl p-5 hover:border-eci-gold/50 transition-colors"
        >
          <p className="text-[10px] font-jost font-semibold uppercase tracking-wide text-eci-gold mb-1">
            Schools
          </p>
          <p className="font-cormorant text-2xl text-eci-purple-dark">Add a network school</p>
          <p className="text-sm text-gray-500 font-jost mt-1">
            Register a partner campus so it appears in the network and calendar targets.
          </p>
        </Link>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
        {[
          { label: 'Total Schools', value: schools.length, sub: 'in network' },
          { label: 'Active Schools', value: active, sub: 'operational' },
          { label: 'Total Students', value: `${totalStudents}+`, sub: 'enrolled' },
          { label: 'New Enquiries', value: newEnquiries, sub: 'awaiting review', alert: newEnquiries > 0 },
          { label: 'Documents', value: documentsCount, sub: 'in library' },
        ].map(({ label, value, sub, alert }) => (
          <div key={label} className={`bg-white rounded-xl border p-5 ${alert ? 'border-eci-gold' : 'border-gray-100'}`}>
            <p className="text-gray-400 text-xs font-jost uppercase tracking-wide mb-1">{label}</p>
            <p className={`font-cormorant text-4xl ${alert ? 'text-eci-gold' : 'text-eci-purple-dark'}`}>{value}</p>
            <p className="text-xs text-gray-400 font-jost">{sub}</p>
          </div>
        ))}
      </div>

      {/* Network health + Student chart */}
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Network school status */}
        <div className="bg-white rounded-xl border border-gray-100 p-7">
          <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Network Schools</h2>
          <div className="space-y-3">
            {schools.map(school => (
              <div key={school.id} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl">{FLAG[school.country] || '🌍'}</span>
                  <div className="min-w-0">
                    <p className="font-jost font-semibold text-sm text-gray-800 truncate">{school.name}</p>
                    <p className="text-xs text-gray-400 font-jost">{school.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-jost px-2.5 py-1 rounded-full font-semibold ${STATUS_COLOUR[school.status]}`}>
                    {school.status.replace('_', ' ')}
                  </span>
                  <a
                    href={`/api/view-school?school=${encodeURIComponent(school.id)}&next=/school`}
                    className="inline-flex items-center gap-1 text-xs font-jost font-semibold text-eci-purple-dark bg-white border border-eci-gold/50 hover:bg-eci-gold-light px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <ExternalLink size={12} />
                    Portal
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student enrolment chart */}
        <div className="bg-white rounded-xl border border-gray-100 p-7">
          <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Enrolment by School</h2>
          <div className="space-y-4">
            {schools.filter(s => s.student_count).map(school => {
              const pct = Math.round(((school.student_count || 0) / totalStudents) * 100)
              return (
                <div key={school.id}>
                  <div className="flex justify-between text-xs font-jost mb-1.5">
                    <span className="text-gray-700">{school.name}</span>
                    <span className="text-gray-400">{school.student_count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'var(--eci-purple)' }} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-jost">Total: <strong className="text-gray-700">{totalStudents} students</strong> across {active} active schools</p>
          </div>
        </div>
      </div>

      {/* Investor enquiries */}
      <div className="bg-white rounded-xl border border-gray-100 p-7">
        <div className="flex items-center justify-between mb-5 gap-3">
          <h2 className="font-cormorant text-2xl text-eci-purple-dark">Pipeline</h2>
          <div className="flex items-center gap-3">
            {newEnquiries > 0 && (
              <span className="bg-eci-gold text-white text-xs font-jost font-semibold px-3 py-1 rounded-full">
                {newEnquiries} new
              </span>
            )}
            <Link href="/team/enquiries" className="text-sm font-jost text-eci-purple hover:underline">
              View all →
            </Link>
          </div>
        </div>
        {enquiries.length === 0 ? (
          <p className="text-gray-400 text-sm font-jost">No enquiries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-jost">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Name', 'Organisation', 'Country', 'Type', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enquiries.map(enq => (
                  <tr key={enq.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-semibold text-gray-800">{enq.full_name}</td>
                    <td className="py-3 pr-4 text-gray-600">{enq.organisation || '-'}</td>
                    <td className="py-3 pr-4 text-gray-500">{enq.country || '-'}</td>
                    <td className="py-3 pr-4 text-gray-500">{enq.investment_type || '-'}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${ENQUIRY_STATUS[enq.status] || 'bg-gray-100 text-gray-600'}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-400 text-xs">{new Date(enq.created_at).toLocaleDateString('en-GB')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
