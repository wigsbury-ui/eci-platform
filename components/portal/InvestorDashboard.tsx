'use client'
import { School, Profile } from '@/lib/types'
import { PRIMARY_PARTNERSHIP, PARTNERSHIP_ADDONS } from '@/lib/content/network'
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
          Build an Ellesmere school with ECI. This portal gives you markets, marketing packs, and
          due-diligence materials for brand licensing conversations.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Operating campuses', value: active },
          { label: 'Opening soon', value: schools.filter(s => s.status === 'setting_up').length },
          { label: 'Priority markets', value: TOP_DESTINATIONS.length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white border border-gray-100 p-5">
            <p className="text-gray-400 text-xs font-jost uppercase tracking-wide mb-2">{label}</p>
            <p className="font-cormorant text-4xl text-eci-purple-dark">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 p-7 mb-8">
        <p className="text-[10px] tracking-[0.2em] uppercase text-eci-gold font-jost font-bold mb-2">
          Core offer
        </p>
        <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-3">{PRIMARY_PARTNERSHIP.title}</h2>
        <p className="text-sm text-gray-600 font-jost leading-relaxed max-w-2xl mb-4">
          {PRIMARY_PARTNERSHIP.summary}
        </p>
        <p className="text-xs text-eci-gold font-jost italic mb-6">{PRIMARY_PARTNERSHIP.ideal}</p>
        <div className="border-t border-gray-100 pt-5">
          <p className="text-xs text-gray-400 font-jost uppercase tracking-wide mb-3">Optional add-ons</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PARTNERSHIP_ADDONS.map(a => (
              <div key={a.id}>
                <p className="font-cormorant text-lg text-eci-purple-dark">{a.title}</p>
                <p className="text-xs text-gray-500 font-jost mt-1 leading-relaxed">{a.summary}</p>
              </div>
            ))}
          </div>
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
            <h2 className="font-cormorant text-2xl text-eci-purple-dark">Priority markets</h2>
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

      <div className="flex flex-wrap gap-3">
        <Link
          href="/investor/apply"
          className="bg-eci-gold text-eci-purple-dark px-6 py-3 text-sm font-jost font-semibold hover:bg-eci-gold-light transition-colors"
        >
          Express interest
        </Link>
        <Link
          href="/investor/resources"
          className="border border-gray-200 text-eci-purple-dark px-6 py-3 text-sm font-jost font-semibold hover:border-eci-gold transition-colors"
        >
          Marketing resources
        </Link>
      </div>
    </div>
  )
}
