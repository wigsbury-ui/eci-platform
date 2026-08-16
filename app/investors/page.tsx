import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PublicNav from '@/components/PublicNav'
import Footer from '@/components/Footer'
import ContactSection from '@/components/ContactSection'
import PartnerServicesSection from '@/components/PartnerServicesSection'
import {
  EXPANSION_MARKETS,
  INVESTOR_VALUE_PROPS,
  OPENING_SOON,
  OPERATING_SCHOOLS,
  PARTNERSHIP_MODELS,
} from '@/lib/content/network'

export const metadata: Metadata = {
  title: 'Investment Partners',
  description:
    'Partner with Ellesmere College International to develop British-heritage schools across the Middle East and North Africa.',
}

export default function InvestorsPage() {
  return (
    <main>
      <PublicNav solid />

      <section className="relative min-h-[70vh] flex items-end overflow-hidden pt-24">
        <Image
          src="/images/schools/doha-horizon.jpg"
          alt="International campus expansion"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1228]/95 via-[#2D1654]/80 to-[#2D1654]/45" />
        <div className="relative max-w-7xl mx-auto px-6 pb-20 w-full">
          <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase mb-5 font-jost">
            Investment partners
          </p>
          <h1
            className="font-cormorant font-light text-white leading-[1.05] max-w-3xl mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Build the next Ellesmere campus with us
          </h1>
          <p className="text-white/75 text-lg font-jost font-light max-w-xl mb-10 leading-relaxed">
            ECI seeks aligned capital and operating partners to grow a network of British-heritage
            schools — starting from live campuses in Riyadh and Muscat, with Doha opening soon, and
            defined opportunities in Egypt, wider Saudi Arabia, Abu Dhabi, Al Ain and Morocco.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#investor-contact"
              className="bg-[#C8A84B] text-[#2D1654] px-8 py-3.5 rounded-sm font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
            >
              Register interest
            </a>
            <Link
              href="/login?audience=investor"
              className="border border-white/40 text-white px-8 py-3.5 rounded-sm font-jost text-sm hover:border-[#C8A84B] hover:text-[#C8A84B] transition-colors"
            >
              Investor portal login
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F8F4EF]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-[#4C2585] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">
              Why ECI
            </p>
            <h2 className="font-cormorant text-4xl text-[#2D1654] font-light">
              Marketing clarity. Substantive partnership.
            </h2>
            <p className="text-gray-600 font-jost mt-4 leading-relaxed">
              This page is for prospective investors who want to understand the opportunity.
              Invited partners receive deeper due-diligence materials, financial packs and
              model documentation inside the password-controlled Investor Portal.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {INVESTOR_VALUE_PROPS.map(item => (
              <div key={item.title} className="bg-white p-8 border-l-4 border-[#C8A84B] shadow-sm">
                <h3 className="font-cormorant text-2xl text-[#2D1654] mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm font-jost leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <p className="text-[#4C2585] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">
                Operating proof
              </p>
              <h2 className="font-cormorant text-4xl text-[#2D1654] font-light mb-5">
                Live schools, transferable standard
              </h2>
              <p className="text-gray-600 font-jost leading-relaxed mb-8">
                Investors partner into a model already operating — not a paper franchise.
                Ellesmere College Riyadh is open (including the Salwa Compound campus), Muscat has
                been welcoming pupils since 2023, and Doha is approaching launch.
              </p>
              <ul className="space-y-4">
                {[...OPERATING_SCHOOLS, ...OPENING_SOON].map(s => (
                  <li key={s.id} className="flex gap-4 items-start border-b border-gray-100 pb-4">
                    <span className="text-[#C8A84B] font-cormorant text-xl mt-0.5">◆</span>
                    <div>
                      <p className="font-jost font-semibold text-[#2D1654] text-sm">{s.name}</p>
                      <p className="text-gray-500 text-sm font-jost">
                        {s.city}, {s.country} · {s.status === 'active' ? 'Operating' : 'Opening soon'}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[420px] overflow-hidden">
              <Image
                src="/images/schools/riyadh-community.webp"
                alt="Ellesmere College Riyadh community"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#2D1654] to-transparent p-8">
                <p className="text-[#C8A84B] text-xs tracking-widest uppercase font-jost mb-2">Riyadh</p>
                <p className="text-white font-cormorant text-2xl">Ellesmere College Riyadh — open now</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-cormorant text-3xl text-[#2D1654] mb-8">Priority expansion markets</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {EXPANSION_MARKETS.map(m => (
                <div key={m.id} className="border border-gray-150 bg-[#F8F4EF] p-6">
                  <h4 className="font-cormorant text-xl text-[#2D1654] mb-2">{m.name}</h4>
                  <p className="text-sm text-gray-600 font-jost leading-relaxed">{m.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PartnerServicesSection variant="investors" />

      <section className="py-24 bg-[#2D1654] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">
              Partnership structures
            </p>
            <h2 className="font-cormorant text-4xl font-light">Choose the right engagement model</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {PARTNERSHIP_MODELS.map(model => (
              <div key={model.id} className="border border-white/15 p-8">
                <div className="w-10 h-px bg-[#C8A84B] mb-6" />
                <h3 className="font-cormorant text-2xl mb-4">{model.title}</h3>
                <p className="text-white/70 text-sm font-jost leading-relaxed mb-4">{model.summary}</p>
                <p className="text-[#C8A84B] text-xs font-jost italic">{model.ideal}</p>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-sm font-jost mt-10 max-w-2xl">
            Marketing resources (overview decks, one-pagers) and substantive due-diligence packs are
            released through the Investor Portal after access is granted by the ECI team.
          </p>
        </div>
      </section>

      <div id="investor-contact">
        <ContactSection
          title="Start an investment conversation"
          subtitle="Tell us about your organisation and the markets you are interested in. Our team typically responds within three working days."
          defaultInterest="Investment Opportunity"
        />
      </div>

      <Footer />
    </main>
  )
}
