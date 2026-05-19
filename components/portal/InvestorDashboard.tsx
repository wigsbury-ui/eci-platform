'use client'
import { School, Profile } from '@/lib/types'

const FLAG_EMOJIS: Record<string, string> = { China: '🇨🇳', UAE: '🇦🇪', Singapore: '🇸🇬', Kenya: '🇰🇪', Canada: '🇨🇦' }

export default function InvestorDashboard({ schools, profile }: { schools: School[], profile: Profile | null }) {
  const active = schools.filter(s => s.status === 'active').length
  const totalStudents = schools.reduce((a, s) => a + (s.student_count || 0), 0)

  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400 text-sm font-jost mb-1">Welcome back, {profile?.full_name?.split(' ')[0] || 'Investor'}</p>
        <h1 className="font-cormorant text-4xl text-eci-purple-dark">Investment Overview</h1>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Network Schools', value: schools.length },
          { label: 'Active Schools', value: active },
          { label: 'Total Students', value: `${totalStudents}+` },
          { label: 'Countries', value: new Set(schools.map(s => s.country)).size },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5">
            <p className="text-gray-400 text-xs font-jost uppercase tracking-wide mb-2">{label}</p>
            <p className="font-cormorant text-4xl text-eci-purple-dark">{value}</p>
          </div>
        ))}
      </div>

      {/* Partnership models */}
      <div className="bg-white rounded-xl border border-gray-100 p-7 mb-8">
        <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Partnership Models</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: 'Full Partnership', fee: '£45,000–£85,000', type: 'Annual licence fee', points: ['Full ECI branding rights', 'Dedicated ECI liaison', 'Curriculum & QA support', 'Annual inspection visit', 'Network membership'] },
            { title: 'Curriculum Licensing', fee: '£18,000–£35,000', type: 'Annual licence fee', points: ['Ellesmere curriculum access', 'Teacher training programme', 'Assessment frameworks', 'Twice-yearly advisory visit'] },
            { title: 'Advisory', fee: '£8,000–£15,000', type: 'Annual retainer', points: ['QA consultation visits', 'CPD programme access', 'Network events', 'Strategic guidance'] },
          ].map(({ title, fee, type, points }) => (
            <div key={title} className="border border-gray-100 rounded-xl p-5">
              <div className="w-8 h-0.5 bg-eci-gold mb-4" />
              <h3 className="font-cormorant text-xl text-eci-purple-dark mb-1">{title}</h3>
              <p className="font-cormorant text-2xl text-eci-purple mb-0.5">{fee}</p>
              <p className="text-xs text-gray-400 font-jost mb-4">{type}</p>
              <ul className="space-y-1.5">
                {points.map(p => (
                  <li key={p} className="flex items-start gap-2 text-xs font-jost text-gray-600">
                    <span className="text-eci-gold mt-0.5 flex-shrink-0">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Schools table */}
      <div className="bg-white rounded-xl border border-gray-100 p-7">
        <h2 className="font-cormorant text-2xl text-eci-purple-dark mb-5">Network Schools</h2>
        <div className="space-y-3">
          {schools.map(school => (
            <div key={school.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{FLAG_EMOJIS[school.country] || '🌍'}</span>
                <div>
                  <p className="font-jost font-semibold text-sm text-gray-800">{school.name}</p>
                  <p className="text-xs text-gray-400 font-jost">{school.city}, {school.country}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-jost text-gray-600">{school.student_count ? `${school.student_count} students` : 'Opening soon'}</p>
                <span className={`text-xs font-jost px-2 py-0.5 rounded-full ${
                  school.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                  school.status === 'setting_up' ? 'bg-amber-100 text-amber-700' :
                  'bg-blue-100 text-blue-700'
                }`}>{school.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
