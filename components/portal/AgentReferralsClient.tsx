'use client'

import { useState, useTransition } from 'react'
import PortalShell from '@/components/portal/PortalShell'
import PortalChatbot from '@/components/portal/PortalChatbot'
import { AGENT_PORTAL_ACCENT, AGENT_PORTAL_NAME, agentNavForProfile } from '@/components/portal/agentNav'
import { DEMO_AGENT_REFERRALS } from '@/lib/content/agents'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'
import { Profile } from '@/lib/types'

type Referral = (typeof DEMO_AGENT_REFERRALS)[number]

export default function AgentReferralsClient({ profile }: { profile: Profile | null }) {
  const [referrals, setReferrals] = useState<Referral[]>([...DEMO_AGENT_REFERRALS])
  const [submitted, setSubmitted] = useState(false)
  const [, startTransition] = useTransition()
  const [form, setForm] = useState({
    organisation: '',
    contact: '',
    email: '',
    market: TOP_DESTINATIONS[0]?.shortName ?? '',
    notes: '',
  })

  return (
    <PortalShell
      profile={profile}
      portalName={AGENT_PORTAL_NAME}
      portalAccent={AGENT_PORTAL_ACCENT}
      navItems={agentNavForProfile(profile)}
      activeSection="/agent/referrals"
    >
      <div className="mb-10 max-w-3xl">
        <p className="text-[#0E7490] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          Referral desk
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">Investor introductions</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed">
          Submit qualified investor or operator introductions. ECI reviews each referral and leads
          diligence, you retain visibility on status here.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 mb-10">
        <form
          className="lg:col-span-2 bg-white border border-gray-100 p-6 space-y-4"
          onSubmit={e => {
            e.preventDefault()
            startTransition(() => {
              setReferrals(prev => [
                {
                  id: `ref-${Date.now()}`,
                  organisation: form.organisation,
                  contact: form.contact,
                  market: form.market,
                  status: 'In review',
                  submitted: new Date().toISOString().slice(0, 10),
                },
                ...prev,
              ])
              setForm({
                organisation: '',
                contact: '',
                email: '',
                market: TOP_DESTINATIONS[0]?.shortName ?? '',
                notes: '',
              })
              setSubmitted(true)
            })
          }}
        >
          <h2 className="font-cormorant text-2xl text-[#2D1654]">New referral</h2>
          <input
            required
            placeholder="Organisation"
            value={form.organisation}
            onChange={e => setForm({ ...form, organisation: e.target.value })}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm font-jost"
          />
          <input
            required
            placeholder="Primary contact name"
            value={form.contact}
            onChange={e => setForm({ ...form, contact: e.target.value })}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm font-jost"
          />
          <input
            required
            type="email"
            placeholder="Contact email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm font-jost"
          />
          <select
            value={form.market}
            onChange={e => setForm({ ...form, market: e.target.value })}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm font-jost"
          >
            {TOP_DESTINATIONS.map(d => (
              <option key={d.id} value={`${d.shortName} / ${d.country}`}>
                #{d.rank} {d.shortName}, {d.country}
              </option>
            ))}
            <option value="Multiple / regional">Multiple / regional</option>
            <option value="Undecided">Undecided</option>
          </select>
          <textarea
            placeholder="Context for ECI (capacity, timing, prior education investments)"
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={4}
            className="w-full border border-gray-200 px-3 py-2.5 text-sm font-jost"
          />
          <button
            type="submit"
            className="w-full bg-[#0E7490] text-white py-3 text-sm font-jost font-semibold hover:bg-[#0F766E] transition-colors"
          >
            Submit introduction
          </button>
          {submitted && (
            <p className="text-xs text-[#0E7490] font-jost">
              Referral recorded. In production this notifies the ECI partnerships team.
            </p>
          )}
        </form>

        <div className="lg:col-span-3 bg-white border border-gray-100 p-6">
          <h2 className="font-cormorant text-2xl text-[#2D1654] mb-5">Your pipeline</h2>
          <div className="space-y-3">
            {referrals.map(r => (
              <div key={r.id} className="border border-gray-100 p-4 flex flex-wrap justify-between gap-3">
                <div>
                  <p className="font-jost font-semibold text-sm text-[#2D1654]">{r.organisation}</p>
                  <p className="text-xs text-gray-500 font-jost mt-1">
                    {r.contact} · {r.market}
                  </p>
                  <p className="text-[11px] text-gray-400 font-jost mt-1">Submitted {r.submitted}</p>
                </div>
                <span className="text-xs self-start px-2.5 py-1 bg-[#F0FDFA] text-[#0E7490] h-fit">
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PortalChatbot audience="agent" />
    </PortalShell>
  )
}
