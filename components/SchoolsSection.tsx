import Image from 'next/image'
import Link from 'next/link'
import { OPENING_SOON, OPERATING_SCHOOLS, type NetworkSchoolCard } from '@/lib/content/network'

const STATUS: Record<string, { label: string; className: string }> = {
  active: { label: 'Open', className: 'bg-emerald-100 text-emerald-900' },
  setting_up: { label: 'Opening soon', className: 'bg-amber-100 text-amber-900' },
  prospect: { label: 'Proposed', className: 'bg-sky-100 text-sky-900' },
}

function SchoolCard({ school }: { school: NetworkSchoolCard }) {
  const status = STATUS[school.status]
  return (
    <article className="group relative overflow-hidden bg-white border border-black/5 shadow-sm hover:shadow-xl transition-shadow duration-500">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={school.image}
          alt={school.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1228]/75 via-transparent to-transparent" />
        <span className={`absolute top-4 left-4 text-[11px] font-jost font-semibold px-3 py-1 ${status.className}`}>
          {status.label}
        </span>
        {school.highlight && (
          <p className="absolute bottom-4 left-4 right-4 text-white/90 text-xs font-jost tracking-wide">
            {school.highlight}
          </p>
        )}
      </div>
      <div className="p-7">
        <p className="text-[#C8A84B] text-xs tracking-[0.2em] uppercase font-jost mb-2">
          {school.city}, {school.country}
        </p>
        <h3 className="font-cormorant font-semibold text-[#2D1654] text-2xl mb-3">{school.name}</h3>
        <p className="text-gray-600 text-sm leading-relaxed font-jost mb-5">{school.short_bio}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {school.curriculum.map(c => (
            <span key={c} className="text-[11px] font-jost bg-[#EDE5F7] text-[#4C2585] px-2.5 py-1">
              {c}
            </span>
          ))}
        </div>
        {school.website && (
          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-jost text-[#4C2585] hover:text-[#C8A84B] transition-colors"
          >
            Visit school website →
          </a>
        )}
      </div>
    </article>
  )
}

export default function SchoolsSection() {
  return (
    <section id="schools" className="py-28 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-[#4C2585] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">
            Our network
          </p>
          <h2
            className="font-cormorant font-light text-[#2D1654] leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            Schools carrying the Ellesmere standard
          </h2>
          <p className="text-gray-500 mt-4 font-jost leading-relaxed">
            Each campus is rooted in its community and united by shared standards, High Performance
            Learning, and the Ellesmere commitment to Life:Ready education.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {OPERATING_SCHOOLS.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>

        <div className="border-t border-gray-100 pt-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <div>
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
                Next campus
              </p>
              <h3 className="font-cormorant text-3xl text-[#2D1654]">Opening soon in Doha</h3>
            </div>
            <Link href="/investors" className="text-sm font-jost text-[#4C2585] hover:text-[#C8A84B]">
              Partner on the next campus →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {OPENING_SOON.map(school => (
              <SchoolCard key={school.id} school={school} />
            ))}
            <div className="relative min-h-[320px] overflow-hidden bg-[#2D1654] text-white p-10 flex flex-col justify-end">
              <Image
                src="/images/campus/uk-campus-life.jpg"
                alt=""
                fill
                className="object-cover opacity-35"
              />
              <div className="relative">
                <p className="text-[#C8A84B] text-xs tracking-[0.25em] uppercase mb-3 font-jost">Heritage</p>
                <h3 className="font-cormorant text-3xl mb-4">Ellesmere College, UK</h3>
                <p className="text-white/75 text-sm font-jost leading-relaxed mb-6 max-w-md">
                  The founding school — Shropshire, 1884 — remains the source of curriculum quality,
                  pastoral culture, and the Life:Ready ambition behind every international campus.
                </p>
                <a
                  href="https://www.ellesmere.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-jost text-[#C8A84B] hover:text-white transition-colors"
                >
                  ellesmere.com →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
