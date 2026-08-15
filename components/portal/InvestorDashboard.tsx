'use client'
import { School, Profile } from '@/lib/types'
import { EXPANSION_MARKETS, PARTNERSHIP_MODELS } from '@/lib/content/network'
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
          Marketing context, partnership models, and network status. Substantive due-diligence packs live under Due Diligence.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Network schools', value: schools.length },
          { label: 'Operating', value: active },
          { label: 'Opening soon', value: schools.filter(s => s.status === 'setting_up').length },
          { label: 'Expansion markets', value: EXPANSION_MARKETS.length },
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
        <Link href="/investor/models" className="inline-block mt-6 text-sm font-jost text-eci-purple hover:underline">
          View full model details →
        </Link>
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
          <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Expansion pipeline</h2>
          <ul className="space-y-3">
            {EXPANSION_MARKETS.map(m => (
              <li key={m.id} className="border-b border-gray-50 pb-3">
                <p className="font-jost font-semibold text-sm text-gray-800">{m.name}</p>
                <p className="text-xs text-gray-500 font-jost mt-1">{m.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
