import Image from 'next/image'
import Link from 'next/link'
import { PARTNERSHIP_MODELS } from '@/lib/content/network'

export default function PartnershipSection() {
  return (
    <section id="partnership" className="relative py-28 overflow-hidden">
      <Image
        src="/images/campus/students-classroom.jpg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-[#2D1654]/92" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
            How we partner
          </p>
          <h2
            className="font-cormorant font-semibold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            Three ways to work with ECI
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mx-auto mb-5" />
          <p className="text-white/75 font-jost">
            Whether you are an investor, an existing school operator, or planning a new institution,
            we structure partnerships around quality, clarity and long-term stewardship of the Ellesmere name.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {PARTNERSHIP_MODELS.map(model => (
            <div
              key={model.id}
              className="bg-white/10 border-2 border-[#C8A84B]/35 p-8 backdrop-blur-sm hover:bg-white/15 hover:border-[#C8A84B] transition-colors"
            >
              <div className="w-12 h-1 bg-[#C8A84B] mb-6" />
              <h3 className="font-cormorant font-semibold text-white text-2xl mb-4">{model.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed font-jost mb-5">{model.summary}</p>
              <p className="text-[#C8A84B] text-xs font-jost font-medium">{model.ideal}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/investors"
            className="bg-[#C8A84B] text-[#2D1654] px-8 py-3.5 rounded-sm font-jost font-bold text-sm hover:bg-[#F0E4B0] transition-colors"
          >
            For investment partners
          </Link>
          <a
            href="#contact"
            className="border-2 border-[#C8A84B]/70 text-white px-8 py-3.5 rounded-sm font-jost font-semibold text-sm hover:bg-[#C8A84B] hover:text-[#2D1654] transition-colors"
          >
            Register your interest
          </a>
        </div>
      </div>
    </section>
  )
}
