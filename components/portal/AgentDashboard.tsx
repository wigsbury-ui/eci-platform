'use client'

import Link from 'next/link'
import { Profile } from '@/lib/types'
import {
  hasAcceptedPartnerAccess,
  partnerChannelLabel,
  partnerStatusLabel,
} from '@/lib/auth/partnerAccess'
import { AGENT_PORTAL_ACCENT } from '@/components/portal/agentNav'
import PreviewPartnerTierToggle from '@/components/portal/PreviewPartnerTierToggle'
import { DEMO_AGENT_REFERRALS } from '@/lib/content/agents'

export default function AgentDashboard({
  profile,
  preview = false,
}: {
  profile: Profile | null
  preview?: boolean
}) {
  const firstName = profile?.full_name?.split(' ')[0] || 'Partner'
  const accepted = hasAcceptedPartnerAccess(profile)
  const channel = partnerChannelLabel(profile?.partner_channel)

  if (!accepted) {
    return (
      <div>
        <PreviewPartnerTierToggle accepted={false} visible={preview} />

        <div className="mb-8">
          <p className="text-gray-400 text-sm font-jost mb-1">Welcome, {firstName}</p>
          <h1 className="font-cormorant text-4xl text-[#2D1654]">Applicant overview</h1>
          <p className="text-sm text-gray-500 font-jost mt-2 max-w-2xl">
            You are reviewing ECI as a prospective {channel.toLowerCase()}. Learn who we are, why
            investors partner with us, and read the sample contract for your channel. Marketing packs
            unlock when an ECI admin accepts you.
          </p>
          <p className="mt-3 inline-block text-xs font-jost font-semibold uppercase tracking-wider px-2.5 py-1 bg-amber-50 text-amber-800">
            {partnerStatusLabel(profile?.partner_status)} · {channel}
          </p>
        </div>

        <div className="bg-white border border-gray-100 p-7 mb-8">
          <h2 className="font-cormorant text-2xl text-[#2D1654] mb-4">Your three pages</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                href: '/agent/about',
                title: 'About ECI',
                body: 'Heritage, campuses, and the brand-licensing offer.',
              },
              {
                href: '/agent/why-partner',
                title: 'Why partner',
                body: 'The short case for introducing investors to Ellesmere.',
              },
              {
                href: '/agent/contracts',
                title: 'Sample contracts',
                body: 'Agent and rainmaker agreements to review before joining.',
              },
            ].map(item => (
              <Link
                key={item.href}
                href={item.href}
                className="border border-gray-100 p-5 hover:border-[#0E7490]/40 transition-colors"
              >
                <div className="w-8 h-1 mb-4" style={{ background: AGENT_PORTAL_ACCENT }} />
                <p className="font-cormorant text-xl text-[#2D1654] mb-1">{item.title}</p>
                <p className="text-xs text-gray-500 font-jost leading-relaxed">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="border border-gray-100 bg-[#F8F4EF] p-6">
          <p className="font-cormorant text-xl text-[#2D1654] mb-2">Next step</p>
          <p className="text-sm text-gray-600 font-jost leading-relaxed max-w-2xl">
            When you are ready, ECI will review your application and accept you as a full{' '}
            {channel.toLowerCase()}. You will then receive marketing resources and investor
            promotional materials to support introductions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PreviewPartnerTierToggle accepted visible={preview} />

      <div className="mb-8">
        <p className="text-gray-400 text-sm font-jost mb-1">Welcome back, {firstName}</p>
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Partner overview</h1>
        <p className="text-sm text-gray-500 font-jost mt-2 max-w-2xl">
          Introduce investors who want to build a school under the Ellesmere brand. Use approved
          marketing and investor materials only, then log every introduction as a referral.
        </p>
        <p className="mt-3 inline-block text-xs font-jost font-semibold uppercase tracking-wider px-2.5 py-1 bg-[#F0FDFA] text-[#0E7490]">
          {partnerStatusLabel('accepted')} · {channel}
        </p>
      </div>

      <div className="bg-[#0E7490] text-white p-6 sm:p-7 mb-8">
        <p className="font-jost text-[11px] tracking-[0.25em] uppercase text-white/70 mb-2">
          Your focus
        </p>
        <h2 className="font-cormorant text-2xl sm:text-3xl leading-snug mb-3">
          Brand licensing introductions
        </h2>
        <p className="font-jost text-sm text-white/85 max-w-2xl leading-relaxed mb-5">
          Lead with one offer. Share only approved packs. Submit the referral so ECI can close.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/agent/resources"
            className="bg-white text-[#0E7490] px-5 py-2.5 text-sm font-jost font-semibold hover:bg-[#F0FDFA] transition-colors"
          >
            Marketing resources
          </Link>
          <Link
            href="/agent/materials"
            className="border border-white/40 text-white px-5 py-2.5 text-sm font-jost font-semibold hover:border-white transition-colors"
          >
            Investor materials
          </Link>
          <Link
            href="/agent/referrals"
            className="border border-white/40 text-white px-5 py-2.5 text-sm font-jost font-semibold hover:border-white transition-colors"
          >
            Submit a referral
          </Link>
        </div>
      </div>

      <div className="bg-white border border-gray-100 p-7">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="font-cormorant text-2xl text-[#2D1654]">Recent referrals</h2>
          <Link
            href="/agent/referrals"
            className="text-sm font-jost font-semibold"
            style={{ color: AGENT_PORTAL_ACCENT }}
          >
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
