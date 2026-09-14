import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import { PUBLIC_CAMPUSES, type NetworkSchoolCard } from '@/lib/content/network'

export const metadata: Metadata = {
  title: 'Our Schools',
  description:
    'Ellesmere College in Shropshire, two Ellesmere College Riyadh campuses, and Ellesmere College Doha opening soon.',
}

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

export default function SchoolsPage() {
  return (
    <main>
      <PublicNav solid />

      <section className="relative min-h-[70svh] flex flex-col justify-end overflow-hidden">
        <Image
          src="/images/campus/uk-160-acre.jpg"
          alt="Ellesmere College Shropshire campus"
          fill
          priority
          className="object-cover object-[center_40%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1228]/94 via-[#2D1654]/75 to-[#2D1654]/30" />
        <div className="relative max-w-7xl mx-auto px-6 pb-16 md:pb-20 pt-32 w-full">
          <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
            Our schools
          </p>
          <h1
            className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Four campuses.
            <br />
            <em className="text-[#C8A84B] font-normal">One Ellesmere standard.</em>
          </h1>
          <p className="text-white/80 font-jost text-lg max-w-xl leading-relaxed">
            The Shropshire founding college, two operating campuses in Riyadh, and Ellesmere College
            Doha opening soon.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[#F8F4EF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {PUBLIC_CAMPUSES.map(school => {
              const status = STATUS[school.status]
              const href = campusHref(school)
              const internal = Boolean(school.href)
              return (
                <article
                  key={school.id}
                  className="bg-white border-2 border-[#2D1654]/10 overflow-hidden"
                >
                  <div className="relative h-64">
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1228]/75 via-transparent to-transparent" />
                    <span
                      className={`absolute top-4 left-4 text-[11px] font-jost font-bold px-3 py-1.5 tracking-wide ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="p-8">
                    <p className="text-[#C8A84B] text-xs tracking-[0.2em] uppercase font-jost font-bold mb-2">
                      {school.city}, {school.country}
                    </p>
                    <h2 className="font-cormorant font-semibold text-[#2D1654] text-3xl mb-3">
                      {school.name}
                    </h2>
                    <p className="text-[#2D1654]/75 font-jost leading-relaxed mb-5">
                      {school.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {school.curriculum.map(c => (
                        <span
                          key={c}
                          className="text-[11px] font-jost font-medium bg-[#2D1654] text-[#C8A84B] px-2.5 py-1"
                        >
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
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="font-cormorant text-2xl text-[#2D1654]">
            Exploring a new campus with ECI?
          </p>
          <Link
            href="/#contact"
            className="inline-block bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
          >
            Speak to the partnership team
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
