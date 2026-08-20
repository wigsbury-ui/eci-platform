import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import {
  DOHA_FACTS,
  DOHA_GALLERY,
  DOHA_HIGHLIGHTS,
  DOHA_SCHOOL,
} from '@/lib/content/doha'

export const metadata: Metadata = {
  title: 'Ellesmere College Doha',
  description: DOHA_SCHOOL.summary,
}

export default function DohaSchoolPage() {
  return (
    <main>
      <PublicNav solid />

      <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
        <Image
          src={DOHA_SCHOOL.heroImage}
          alt="Ellesmere College Doha campus"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1228]/94 via-[#2D1654]/75 to-[#2D1654]/30" />
        <div className="relative max-w-7xl mx-auto px-6 pb-16 md:pb-20 pt-32 w-full">
          <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-4 font-jost font-bold">
            {DOHA_SCHOOL.eyebrow} · Qatar
          </p>
          <h1
            className="font-cormorant font-semibold text-white leading-[1.05] max-w-3xl mb-5"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {DOHA_SCHOOL.name}
          </h1>
          <p className="text-white/80 font-jost text-lg max-w-xl mb-8 leading-relaxed">
            {DOHA_SCHOOL.tagline}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="#about-doha"
              className="bg-[#C8A84B] text-[#2D1654] px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              About the campus
            </a>
            <Link
              href="/investors#contact"
              className="border border-white/40 text-white px-6 py-3.5 font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Register interest
            </Link>
          </div>
        </div>
      </section>

      <section id="about-doha" className="py-20 md:py-24 bg-[#F8F4EF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
            <div>
              <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
                Our newest campus
              </p>
              <h2
                className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-4"
                style={{ fontSize: 'clamp(1.9rem, 3.2vw, 3rem)' }}
              >
                A Life:Ready education in Doha
              </h2>
              <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
              <p className="text-[#2D1654]/80 font-jost leading-relaxed mb-5">{DOHA_SCHOOL.summary}</p>
              <p className="text-[#2D1654]/70 font-jost leading-relaxed mb-8">{DOHA_SCHOOL.mission}</p>
              <p className="text-sm font-jost text-[#2D1654]/55 italic">
                Draft profile adapted from public school materials — final wording to be confirmed
                with Ellesmere College Doha leadership.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {DOHA_FACTS.map(fact => (
                <div key={fact.label} className="bg-white border border-[#2D1654]/8 p-5">
                  <p className="text-[10px] tracking-[0.2em] uppercase text-[#C8A84B] font-jost font-bold mb-1">
                    {fact.label}
                  </p>
                  <p className="font-cormorant text-xl text-[#2D1654] font-semibold leading-snug">
                    {fact.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Why Doha
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 3rem)' }}
            >
              What defines the campus
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {DOHA_HIGHLIGHTS.map(item => (
              <div key={item.title} className="bg-[#F8F4EF] border-l-4 border-[#C8A84B] p-7">
                <h3 className="font-cormorant text-2xl text-[#2D1654] font-semibold mb-3">
                  {item.title}
                </h3>
                <p className="font-jost text-sm text-[#2D1654]/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24 bg-[#1A1228]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-10">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Campus gallery
            </p>
            <h2
              className="font-cormorant font-semibold text-white leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 3.2vw, 3rem)' }}
            >
              Facilities taking shape in Doha
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DOHA_GALLERY.map((img, i) => (
              <div
                key={img.src}
                className={`relative overflow-hidden ${
                  i === 0 || i === 3 ? 'sm:col-span-2 min-h-[240px] lg:min-h-[280px]' : 'min-h-[200px]'
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#1A1228]/85 to-transparent p-4">
                  <p className="font-jost text-xs text-white/80 tracking-wide">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F8F4EF]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div className="max-w-xl">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-bold">
              Join the journey
            </p>
            <h2 className="font-cormorant text-3xl md:text-4xl text-[#2D1654] font-semibold mb-3">
              Families, educators and partners welcome
            </h2>
            <p className="font-jost text-[#2D1654]/70 leading-relaxed">
              Whether you are exploring a place for your child, joining a founding teaching team, or
              partnering with ECI, we would be glad to hear from you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/investors#contact"
              className="bg-[#2D1654] text-white px-7 py-3.5 font-jost font-semibold text-sm hover:bg-[#4C2585] transition-colors"
            >
              Contact ECI
            </Link>
            <Link
              href="/schools"
              className="border border-[#2D1654]/25 text-[#2D1654] px-6 py-3.5 font-jost text-sm hover:border-[#C8A84B] transition-colors"
            >
              All schools
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
