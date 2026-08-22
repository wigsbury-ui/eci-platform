import Image from 'next/image'
import Link from 'next/link'
import { PARTNERSHIP_ADDONS, PRIMARY_PARTNERSHIP } from '@/lib/content/network'

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
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
            How we partner
          </p>
          <h2
            className="font-cormorant font-semibold text-white leading-tight mb-5"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            Build a school under the Ellesmere brand
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mx-auto mb-5" />
          <p className="text-white/75 font-jost leading-relaxed">
            Our core offer is brand licensing: investors and operators work with ECI to open an
            Ellesmere school, with curriculum frameworks, quality assurance, and network support
            protecting the standard.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white/10 border-2 border-[#C8A84B]/40 p-8 md:p-10 mb-10">
          <p className="text-[#C8A84B] text-[10px] tracking-[0.25em] uppercase font-jost font-bold mb-3">
            Core offer
          </p>
          <h3 className="font-cormorant font-semibold text-white text-3xl mb-4">
            {PRIMARY_PARTNERSHIP.title}
          </h3>
          <p className="text-white/85 font-jost leading-relaxed mb-4">
            {PRIMARY_PARTNERSHIP.summary}
          </p>
          <p className="text-[#C8A84B] text-sm font-jost italic">{PRIMARY_PARTNERSHIP.ideal}</p>
        </div>

        <div className="max-w-3xl mx-auto mb-12">
          <p className="text-white/50 text-xs tracking-[0.2em] uppercase font-jost font-bold mb-4 text-center">
            Optional add-ons
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PARTNERSHIP_ADDONS.map(model => (
              <div key={model.id} className="border border-white/15 bg-white/[0.04] p-5">
                <h4 className="font-cormorant text-xl text-white font-semibold mb-2">{model.title}</h4>
                <p className="text-white/65 text-sm font-jost leading-relaxed">{model.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/investors"
            className="bg-[#C8A84B] text-[#2D1654] px-8 py-3.5 font-jost font-bold text-sm hover:bg-[#F0E4B0] transition-colors"
          >
            For investment partners
          </Link>
          <Link
            href="/#contact"
            className="border-2 border-[#C8A84B]/70 text-white px-8 py-3.5 font-jost font-semibold text-sm hover:bg-[#C8A84B] hover:text-[#2D1654] transition-colors"
          >
            Register your interest
          </Link>
        </div>
      </div>
    </section>
  )
}
