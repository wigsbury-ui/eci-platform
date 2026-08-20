'use client'
import { School, Profile } from '@/lib/types'
import { PARTNERSHIP_MODELS } from '@/lib/content/network'
import { TOP_DESTINATIONS } from '@/lib/content/expansion-markets'
import Link from 'next/link'

export default function InvestorDashboard({ schools, profile }: { schools: School[], profile: Profile | null }) {
  const active = schools.filter(s => s.status === 'active').length

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400 text-sm font-jost mb-1">
          Welcome back, {profile?.full_name?.split(' ')[0] || 'Investor'}
        </p>
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Investment overview</h1>
        <p className="text-sm text-gray-500 font-jost mt-2 max-w-2xl">
          Network status and the partnership opportunity. Full models and services sit under
          Opportunity; marketing and diligence packs sit under Documents.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Network schools', value: schools.length },
          { label: 'Operating', value: active },
          { label: 'Opening soon', value: schools.filter(s => s.status === 'setting_up').length },
          { label: 'Top destinations', value: TOP_DESTINATIONS.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-100 p-5">
            <p className="text-gray-400 text-xs font-jost uppercase tracking-wide mb-2">{label}</p>
            <p className="font-cormorant text-4xl text-eci-purple-dark">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-8">
        <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Partnership models</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {PARTNERSHIP_MODELS.map(model => (
            <div key={model.id} className="border border-gray-100 p-5">
              <div className="w-8 h-0.5 bg-eci-gold mb-4" />
              <h3 className="font-cormorant text-xl text-eci-purple-dark mb-2">{model.title}</h3>
              <p className="text-xs text-gray-600 font-jost leading-relaxed mb-3">{model.summary}</p>
              <p className="text-xs text-eci-gold font-jost italic">{model.ideal}</p>
            </div>
          ))}
        </div>
        <Link href="/investor/opportunity#models" className="inline-block mt-6 text-sm font-jost text-eci-purple hover:underline">
          Open opportunity →
        </Link>
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="font-cormorant text-2xl text-eci-purple-dark">Partner Services Framework</h2>
            <p className="text-sm text-gray-500 font-jost mt-2 max-w-xl">
              The full three-tier product offering — obligatory commitments, core services, and premium
              add-ons — with attributes, deliverables and impact signals for every service.
            </p>
          </div>
          <Link
            href="/investor/opportunity#services"
            className="text-sm font-jost font-semibold text-[#2D1654] bg-[#C8A84B] px-5 py-2.5 hover:bg-[#F0E4B0] transition-colors"
          >
            Open opportunity →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { tier: 'Group 1', title: 'Obligatory commitments', note: 'Non-negotiable foundation' },
            { tier: 'Group 2', title: 'Core services', note: 'Experience & differentiation' },
            { tier: 'Group 3', title: 'Premium add-ons', note: 'Specialist high-value depth' },
          ].map(g => (
            <div key={g.tier} className="border border-gray-100 p-4">
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#C8A84B] font-jost mb-1">{g.tier}</p>
              <p className="font-cormorant text-lg text-eci-purple-dark">{g.title}</p>
              <p className="text-xs text-gray-500 font-jost mt-1">{g.note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white border border-gray-100 p-7">
          <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Network schools</h2>
          <div className="space-y-3">
            {schools.map(school => (
              <div key={school.id} className="flex items-center justify-between p-4 bg-gray-50">
                <div>
                  <p className="font-jost font-semibold text-sm text-gray-800">{school.name}</p>
                  <p className="text-xs text-gray-400 font-jost">{school.city}, {school.country}</p>
                </div>
                <span className={`text-xs font-jost px-2 py-0.5 capitalize ${
                  school.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  school.status === 'setting_up' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{school.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 p-7">
          <div className="flex items-start justify-between gap-3 mb-5">
            <h2 className="font-cormorant text-2xl text-eci-purple-dark">Top 10 destinations</h2>
            <Link href="/investor/markets" className="text-sm font-jost text-eci-purple hover:underline shrink-0">
              Full brief →
            </Link>
          </div>
          <ul className="space-y-3">
            {TOP_DESTINATIONS.slice(0, 6).map(m => (
              <li key={m.id} className="border-b border-gray-50 pb-3">
                <p className="font-jost font-semibold text-sm text-gray-800">
                  <span className="text-eci-gold mr-2">#{m.rank}</span>
                  {m.shortName}
                </p>
                <p className="text-xs text-gray-500 font-jost mt-1">{m.country} · {m.opportunity}</p>
              </li>
            ))}
          </ul>
          <Link href="/investor/markets" className="inline-block mt-4 text-sm font-jost text-eci-purple hover:underline">
            View all ten markets →
          </Link>
        </div>
      </div>
    </div>
  )
}
