import Image from 'next/image'
import Link from 'next/link'
import { HOMEPAGE_NETWORK_SCHOOLS, type NetworkSchoolCard } from '@/lib/content/network'

const STATUS: Record<string, { label: string; className: string }> = {
  active: { label: 'Open', className: 'bg-[#C8A84B] text-[#2D1654]' },
  setting_up: { label: 'Opening soon', className: 'bg-[#C8A84B] text-[#2D1654]' },
  prospect: { label: 'Proposed', className: 'bg-[#4C2585] text-white' },
  heritage: { label: 'Heritage', className: 'bg-[#C8A84B] text-[#2D1654]' },
}

function detailHref(school: NetworkSchoolCard): string | undefined {
  if (school.href) return school.href
  if (school.id === 'doha') return '/schools/doha'
  return school.website
}

function MapPinIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
    </svg>
  )
}

function SchoolCard({ school }: { school: NetworkSchoolCard }) {
  const status = STATUS[school.status]
  const href = detailHref(school)
  const external = href?.startsWith('http')

  const inner = (
  <>
    <div className="absolute inset-0">
      <Image
        src={school.image}
        alt={school.name}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        style={{ objectPosition: school.imagePosition ?? 'center' }}
        sizes="(max-width:768px) 100vw, 50vw"
      />
      <div
        className="absolute inset-0 bg-[#2D1654]/20"
        aria-hidden
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(26,18,40,0.62) 0%, rgba(26,18,40,0.18) 32%, rgba(26,18,40,0.35) 58%, rgba(26,18,40,0.94) 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 20%, rgba(200,168,75,0.22), transparent 55%)',
        }}
      />
    </div>

    <div className="absolute top-4 left-4 z-10">
      <span
        className={`text-[10px] font-jost font-bold px-3 py-1.5 tracking-[0.12em] uppercase ${status.className}`}
      >
        {status.label}
      </span>
    </div>

    <div className="relative z-10 flex flex-col justify-end flex-1 p-5 md:p-6">
      {school.locationLabel && (
        <p className="flex items-center gap-1.5 text-[#C8A84B] text-[11px] font-jost font-semibold tracking-[0.14em] uppercase mb-2">
          <MapPinIcon className="w-3 h-3 shrink-0" />
          <span>{school.locationLabel}</span>
        </p>
      )}
      <h3
        className="font-cormorant font-semibold text-white leading-[1.1] mb-2"
        style={{ fontSize: 'clamp(1.35rem, 2.2vw, 1.75rem)' }}
      >
        {school.name}
      </h3>
      <p className="text-white/75 text-sm font-jost leading-relaxed line-clamp-2 max-w-md mb-4">
        {school.short_bio}
      </p>
      {href && (
        <span
          className="inline-flex items-center gap-2 text-sm font-jost font-semibold text-[#C8A84B] group-hover:text-white transition-colors duration-300"
        >
          {external ? 'Visit school website' : 'Explore campus'}
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      )}
    </div>
  </>
  )

  if (!href) {
    return (
      <article className="group relative flex min-h-[260px] md:min-h-[280px] overflow-hidden bg-[#2D1654]">
        {inner}
      </article>
    )
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex min-h-[260px] md:min-h-[280px] overflow-hidden bg-[#2D1654] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A84B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F4EF]"
      >
        {inner}
      </a>
    )
  }

  return (
    <Link
      href={href}
      className="group relative flex min-h-[260px] md:min-h-[280px] overflow-hidden bg-[#2D1654] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A84B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F4EF]"
    >
      {inner}
    </Link>
  )
}

export default function SchoolsSection() {
  return (
    <section
      id="schools"
      className="home-window relative min-h-[100svh] flex flex-col justify-center bg-[#F8F4EF] py-10 md:py-12 pt-[max(4.5rem,calc(var(--eci-nav-offset)+0.75rem))] scroll-mt-[var(--eci-nav-offset)] overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 15% 20%, rgba(200,168,75,0.14), transparent 45%), radial-gradient(ellipse at 85% 80%, rgba(76,37,133,0.08), transparent 50%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <header className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 md:mb-10">
          <div className="max-w-2xl">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Our network
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-[1.08]"
              style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
            >
              Schools carrying the Ellesmere standard
            </h2>
            <div className="w-14 h-1 bg-[#C8A84B] mt-5 mb-4" />
            <p className="text-[#2D1654]/70 font-jost text-base leading-relaxed">
              Two Riyadh campuses, Al Hamra in the city and Salwa to the north, with Doha opening
              soon and our founding school in Shropshire.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 lg:pb-1 shrink-0">
            {[
              { label: 'Operating', value: '2 campuses' },
              { label: 'Opening soon', value: 'Doha' },
              { label: 'Heritage', value: 'Since 1884' },
            ].map(item => (
              <div key={item.label} className="border-l-2 border-[#C8A84B] pl-4">
                <p className="text-[10px] font-jost font-bold tracking-[0.2em] uppercase text-[#2D1654]/45 mb-0.5">
                  {item.label}
                </p>
                <p className="font-cormorant text-xl text-[#2D1654] font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {HOMEPAGE_NETWORK_SCHOOLS.map(school => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>
      </div>
    </section>
  )
}
