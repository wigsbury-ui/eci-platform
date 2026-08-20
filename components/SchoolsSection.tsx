import Image from 'next/image'
import Link from 'next/link'
import { PUBLIC_CAMPUSES, type NetworkSchoolCard } from '@/lib/content/network'

const STATUS: Record<string, { label: string; className: string }> = {
  heritage: { label: 'Heritage', className: 'bg-[#C8A84B] text-[#2D1654]' },
  active: { label: 'Open', className: 'bg-[#C8A84B] text-[#2D1654]' },
  setting_up: { label: 'Opening soon', className: 'bg-[#2D1654] text-[#C8A84B]' },
  prospect: { label: 'Proposed', className: 'bg-[#4C2585] text-white' },
}

function campusHref(school: NetworkSchoolCard) {
  if (school.href) return school.href
  return school.website
}

function SchoolCard({ school }: { school: NetworkSchoolCard }) {
  const status = STATUS[school.status]
  const href = campusHref(school)
  const internal = Boolean(school.href)
  return (
    <article className="group relative overflow-hidden bg-white border-2 border-[#2D1654]/10 hover:border-[#C8A84B]/70 shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="relative h-56 overflow-hidden">
        <Image
          src={school.image}
          alt={school.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width:768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1228]/80 via-transparent to-transparent" />
        <span className={`absolute top-4 left-4 text-[11px] font-jost font-bold px-3 py-1.5 tracking-wide ${status.className}`}>
          {status.label}
        </span>
        {school.highlight && (
          <p className="absolute bottom-4 left-4 right-4 text-white text-xs font-jost font-medium tracking-wide">
            {school.highlight}
          </p>
        )}
      </div>
      <div className="p-7 border-t-2 border-[#C8A84B]/50">
        <p className="text-[#C8A84B] text-xs tracking-[0.2em] uppercase font-jost font-bold mb-2">
          {school.city}, {school.country}
        </p>
        <h3 className="font-cormorant font-semibold text-[#2D1654] text-2xl mb-3">{school.name}</h3>
        <p className="text-[#2D1654]/75 text-sm leading-relaxed font-jost mb-5">{school.short_bio}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {school.curriculum.map(c => (
            <span key={c} className="text-[11px] font-jost font-medium bg-[#2D1654] text-[#C8A84B] px-2.5 py-1">
              {c}
            </span>
          ))}
        </div>
        {href &&
          (internal ? (
            <Link
              href={href}
              className="text-sm font-jost font-semibold text-[#2D1654] hover:text-[#C8A84B] transition-colors"
            >
              View campus page →
            </Link>
          ) : (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-jost font-semibold text-[#2D1654] hover:text-[#C8A84B] transition-colors"
            >
              Visit school website →
            </a>
          ))}
      </div>
    </article>
  )
}

export default function SchoolsSection() {
  return (
    <section id="schools" className="py-28 bg-[#F8F4EF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-10">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
            Our schools
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            Shropshire, Riyadh, Doha
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mt-4 mb-4" />
          <p className="text-[#2D1654]/70 font-jost leading-relaxed">
            The founding college in Shropshire, two operating campuses in Riyadh, and Ellesmere
            College Doha opening soon.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {PUBLIC_CAMPUSES.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>

        <Link
          href="/schools"
          className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
        >
          Our schools
        </Link>
      </div>
    </section>
  )
}
