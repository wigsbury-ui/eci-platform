import Image from 'next/image'
import Link from 'next/link'
import NetworkSchoolMapThumb from '@/components/NetworkSchoolMapThumb'
import { HOMEPAGE_NETWORK_SCHOOLS, type NetworkSchoolCard } from '@/lib/content/network'

const STATUS: Record<string, { label: string; className: string }> = {
  active: { label: 'Open', className: 'bg-[#C8A84B] text-[#2D1654]' },
  setting_up: { label: 'Opening soon', className: 'bg-[#2D1654] text-[#C8A84B]' },
  prospect: { label: 'Proposed', className: 'bg-[#4C2585] text-white' },
  heritage: { label: 'Heritage', className: 'bg-[#4C2585] text-[#C8A84B]' },
}

function detailHref(school: NetworkSchoolCard): string | undefined {
  if (school.href) return school.href
  if (school.id === 'doha') return '/schools/doha'
  return school.website
}

function SchoolCard({ school }: { school: NetworkSchoolCard }) {
  const status = STATUS[school.status]
  const href = detailHref(school)
  const external = href?.startsWith('http')

  return (
    <article
      className="group flex flex-col overflow-hidden bg-white border border-[#2D1654]/12 hover:border-[#C8A84B]/60 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative h-28 sm:h-32 overflow-hidden">
        <Image
          src={school.image}
          alt={school.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1228]/70 via-transparent to-transparent" />
        <span
          className={`absolute top-3 left-3 text-[10px] font-jost font-bold px-2.5 py-1 tracking-wide ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5 border-t border-[#C8A84B]/35">
        <h3 className="font-cormorant font-semibold text-[#2D1654] text-lg sm:text-xl leading-snug mb-2">
          {school.name}
        </h3>
        <p className="text-[#2D1654]/70 text-xs sm:text-sm leading-relaxed font-jost flex-1">
          {school.short_bio}
        </p>

        {school.mapLat != null && school.mapLng != null && (
          <NetworkSchoolMapThumb
            schoolId={school.id}
            lat={school.mapLat}
            lng={school.mapLng}
            locationLabel={school.locationLabel}
          />
        )}

        {href && (
          <div className="mt-3 pt-3 border-t border-[#2D1654]/8">
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-jost font-semibold text-[#2D1654] hover:text-[#C8A84B] transition-colors"
              >
                Visit school website →
              </a>
            ) : (
              <Link
                href={href}
                className="text-xs font-jost font-semibold text-[#2D1654] hover:text-[#C8A84B] transition-colors"
              >
                View campus page →
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default function SchoolsSection() {
  return (
    <section
      id="schools"
      className="home-window relative min-h-[100svh] flex flex-col justify-center bg-[#F8F4EF] py-10 md:py-12 pt-[max(4.5rem,calc(var(--eci-nav-offset)+0.75rem))] scroll-mt-[var(--eci-nav-offset)]"
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <header className="max-w-3xl mb-6 md:mb-8">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
            Our network
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight"
            style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)' }}
          >
            Schools carrying the Ellesmere standard
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mt-4 mb-3" />
          <p className="text-[#2D1654]/70 font-jost text-sm md:text-base leading-relaxed">
            Two campuses in Riyadh — Al Hamra in the city and Salwa to the north — alongside Doha
            opening soon and our founding school in Shropshire.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {HOMEPAGE_NETWORK_SCHOOLS.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </div>
    </section>
  )
}
