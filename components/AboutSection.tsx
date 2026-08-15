import Image from 'next/image'
import { HERITAGE } from '@/lib/content/network'

export default function AboutSection() {
  return (
    <section id="about" className="relative py-28 overflow-hidden bg-[#F8F4EF]">
      <div className="absolute inset-y-0 right-0 w-1/2 hidden lg:block">
        <Image
          src="/images/campus/uk-160-acre.jpg"
          alt="Ellesmere College Shropshire campus"
          fill
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F4EF] via-[#F8F4EF]/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="max-w-xl">
          <p className="text-[#4C2585] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">
            About ECI
          </p>
          <h2
            className="font-cormorant font-light text-[#2D1654] leading-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            140 years of Ellesmere.
            <br />
            <em>A growing international family.</em>
          </h2>
          <p className="text-gray-600 leading-relaxed mb-5 font-jost">
            Ellesmere College International is the global licensing and partnership arm of Ellesmere
            College, Shropshire — founded in {HERITAGE.founded} on a {HERITAGE.campusAcres}-acre
            campus in the English countryside. Our philosophy is simple and demanding:{' '}
            <strong className="text-[#2D1654] font-medium">{HERITAGE.tagline}</strong> —
            academic excellence with character, confidence and care.
          </p>
          <p className="text-gray-600 leading-relaxed mb-10 font-jost">
            Through carefully selected partnerships we extend Ellesmere&apos;s curriculum frameworks,
            High Performance Learning culture, and quality standards to schools across the Middle East
            and beyond — so students receive a trusted British education wherever they are.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { k: '1884', v: 'Founded in Shropshire' },
              { k: 'HPL', v: 'World Class School' },
              { k: '30+', v: 'Nationalities at UK campus' },
            ].map(item => (
              <div key={item.k} className="border-t border-[#C8A84B] pt-4">
                <p className="font-cormorant text-3xl text-[#4C2585]">{item.k}</p>
                <p className="text-sm text-gray-500 font-jost mt-1">{item.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
