'use client'

import Link from 'next/link'
import { Profile } from '@/lib/types'
import {
  AGENT_HOW_IT_WORKS,
  AGENT_PORTAL_HIGHLIGHTS,
  DEMO_AGENT_REFERRALS,
} from '@/lib/content/agents'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'
import { AGENT_PORTAL_ACCENT } from '@/components/portal/agentNav'

export default function AgentDashboard({ profile }: { profile: Profile | null }) {
  const firstName = profile?.full_name?.split(' ')[0] || 'Agent'

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400 text-sm font-jost mb-1">Welcome back, {firstName}</p>
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Agent overview</h1>
        <p className="text-sm text-gray-500 font-jost mt-2 max-w-2xl">
          Brief yourself, introduce aligned investors and operators, and track referrals as ECI leads
          the partnership conversation.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Open growth markets', value: TOP_DESTINATIONS.length },
          { label: 'Active referrals', value: DEMO_AGENT_REFERRALS.length },
          { label: 'In review', value: DEMO_AGENT_REFERRALS.filter(r => r.status === 'In review').length },
          { label: 'Qualified', value: DEMO_AGENT_REFERRALS.filter(r => r.status === 'Qualified').length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-100 p-5">
            <p className="text-gray-400 text-xs font-jost uppercase tracking-wide mb-2">{label}</p>
            <p className="font-cormorant text-4xl text-[#2D1654]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {AGENT_PORTAL_HIGHLIGHTS.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-gray-100 p-6 hover:border-[#0E7490]/50 transition-colors group"
          >
            <div className="w-10 h-1 mb-4" style={{ background: AGENT_PORTAL_ACCENT }} />
            <h2 className="font-cormorant text-2xl text-[#2D1654] mb-2 group-hover:text-[#0E7490] transition-colors">
              {item.title}
            </h2>
            <p className="text-sm text-gray-600 font-jost leading-relaxed">{item.body}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-8">
        <h2 className="font-cormorant text-2xl text-[#2D1654] mb-5">How introductions work</h2>
        <div className="grid md:grid-cols-4 gap-5">
          {AGENT_HOW_IT_WORKS.map(step => (
            <div key={step.step}>
              <p className="font-jost text-xs tracking-[0.2em] uppercase mb-2" style={{ color: AGENT_PORTAL_ACCENT }}>
                {step.step}
              </p>
              <p className="font-cormorant text-xl text-[#2D1654] mb-2">{step.title}</p>
              <p className="text-xs text-gray-600 font-jost leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-7">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="font-cormorant text-2xl text-[#2D1654]">Recent referrals</h2>
          <Link href="/agent/referrals" className="text-sm font-jost font-semibold" style={{ color: AGENT_PORTAL_ACCENT }}>
            Manage referrals →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-jost text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <tr>
                <th className="py-2 font-medium">Organisation</th>
                <th className="py-2 font-medium">Contact</th>
                <th className="py-2 font-medium">Market</th>
                <th className="py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_AGENT_REFERRALS.map(r => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="py-3 text-[#2D1654] font-medium">{r.organisation}</td>
                  <td className="py-3 text-gray-600">{r.contact}</td>
                  <td className="py-3 text-gray-600">{r.market}</td>
                  <td className="py-3">
                    <span className="text-xs px-2 py-1 bg-[#F0FDFA] text-[#0E7490]">{r.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
