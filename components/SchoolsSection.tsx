import { School } from '@/lib/types'

const STATUS_COLOURS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  setting_up: 'bg-amber-100 text-amber-800',
  prospect: 'bg-blue-100 text-blue-800',
  paused: 'bg-gray-100 text-gray-600',
}

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  setting_up: 'Opening Soon',
  prospect: 'Proposed',
  paused: 'Paused',
}

const FLAG_EMOJIS: Record<string, string> = {
  China: '🇨🇳', UAE: '🇦🇪', Singapore: '🇸🇬', Kenya: '🇰🇪', Canada: '🇨🇦',
}

export default function SchoolsSection({ schools }: { schools: School[] }) {
  return (
    <section id="schools" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-eci-purple text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">Our Network</p>
          <h2 className="font-cormorant font-light text-eci-purple-dark leading-tight" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
            ECI Schools Around the World
          </h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto font-jost">
            Each ECI school is a distinctive institution in its own community, united by shared standards and the Ellesmere heritage.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map(school => (
            <div key={school.id} className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="h-3 bg-eci-purple" />
              <div className="p-7">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-full bg-eci-purple-light flex items-center justify-center text-2xl">
                    {FLAG_EMOJIS[school.country] || '🌍'}
                  </div>
                  <span className={`text-xs font-jost font-semibold px-3 py-1 rounded-full ${STATUS_COLOURS[school.status]}`}>
                    {STATUS_LABELS[school.status]}
                  </span>
                </div>
                <h3 className="font-cormorant font-semibold text-eci-purple-dark text-2xl mb-1">{school.name}</h3>
                <p className="text-gray-400 text-sm font-jost mb-4">{school.city}, {school.country}</p>
                <p className="text-gray-600 text-sm leading-relaxed font-jost mb-5">{school.short_bio}</p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {school.curriculum?.map(c => (
                    <span key={c} className="text-xs font-jost bg-eci-purple-light text-eci-purple px-2.5 py-1 rounded">
                      {c}
                    </span>
                  ))}
                </div>

                {school.student_count ? (
                  <p className="text-xs text-gray-400 font-jost">
                    {school.student_count} students · Est. {school.year_joined}
                  </p>
                ) : school.year_joined ? (
                  <p className="text-xs text-gray-400 font-jost">Joining {school.year_joined}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
