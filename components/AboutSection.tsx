import Image from 'next/image'
import { HERITAGE } from '@/lib/content/network'

export default function AboutSection() {
  return (
    <section
      id="about"
      className="home-window relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#F8F4EF] py-16 md:py-20 lg:py-0"
    >
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
        <Image
          src="/images/campus/uk-160-acre.jpg"
          alt="Ellesmere College Shropshire campus"
          fill
          className="object-cover"
          sizes="50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F4EF] via-[#F8F4EF]/55 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 w-full flex flex-col justify-center">
        <div className="max-w-xl">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
            About ECI
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            140 years of Ellesmere.
            <br />
            <em className="text-[#4C2585]">A growing international family.</em>
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mb-5" />
          <p className="text-[#2D1654]/80 leading-relaxed mb-4 font-jost">
            Ellesmere College International is the global licensing and partnership arm of Ellesmere
            College, Shropshire — founded in {HERITAGE.founded} on a {HERITAGE.campusAcres}-acre
            campus in the English countryside. Our philosophy is simple and demanding:{' '}
            <strong className="text-[#2D1654] font-semibold">{HERITAGE.tagline}</strong> —
            academic excellence with character, confidence and care.
          </p>
          <p className="text-[#2D1654]/75 leading-relaxed mb-8 font-jost">
            Through carefully selected partnerships we extend Ellesmere&apos;s curriculum frameworks,
            High Performance Learning culture, and quality standards to schools across the Middle East
            and beyond.
          </p>

          <div className="grid grid-cols-3 gap-5">
            {[
              { k: '1884', v: 'Founded in Shropshire' },
              { k: 'HPL', v: 'World Class School' },
              { k: '30+', v: 'Nationalities at UK campus' },
            ].map(item => (
              <div key={item.k} className="border-t-2 border-[#C8A84B] pt-3">
                <p className="font-cormorant text-3xl text-[#2D1654] font-semibold">{item.k}</p>
                <p className="text-xs text-[#2D1654]/65 font-jost mt-1 font-medium leading-snug">
                  {item.v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
