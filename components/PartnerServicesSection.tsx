'use client'

import Link from 'next/link'
import { useEffect, useState, useTransition } from 'react'
import {
  FRAMEWORK_INTRO,
  SERVICE_GROUPS,
  servicesByGroup,
  type PartnerService,
  type ServiceGroupId,
} from '@/lib/content/partner-services'

type Variant = 'home' | 'investors'

export default function PartnerServicesSection({
  variant = 'home',
}: {
  variant?: Variant
}) {
  const [activeGroup, setActiveGroup] = useState<ServiceGroupId>(1)
  const [activeServiceId, setActiveServiceId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [entered, setEntered] = useState(false)

  const group = SERVICE_GROUPS.find(g => g.id === activeGroup)!
  const services = servicesByGroup(activeGroup)
  const activeService: PartnerService | undefined =
    services.find(s => s.id === activeServiceId) ?? services[0]

  useEffect(() => {
    const t = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(t)
  }, [])

  useEffect(() => {
    const first = servicesByGroup(activeGroup)[0]
    setActiveServiceId(first?.id ?? null)
  }, [activeGroup])

  const selectGroup = (id: ServiceGroupId) => {
    startTransition(() => setActiveGroup(id))
  }

  const dark = variant === 'home'

  return (
    <section
      id="services"
      className={`relative overflow-hidden py-24 md:py-28 ${
        dark ? 'bg-[#120e1c]' : 'bg-[#F8F4EF]'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: dark
            ? `radial-gradient(ellipse 55% 45% at 0% 0%, ${group.colour}18 0%, transparent 55%)`
            : `radial-gradient(ellipse 50% 40% at 100% 0%, ${group.colour}14 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Intro — one job */}
        <div
          className={`max-w-3xl mb-12 md:mb-14 transition-all duration-700 ${
            entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p
            className={`text-xs tracking-[0.35em] uppercase mb-4 font-jost font-semibold ${
              dark ? 'text-[#C8A84B]' : 'text-[#4C2585]'
            }`}
          >
            {FRAMEWORK_INTRO.eyebrow}
          </p>
          <h2
            className={`font-cormorant font-light leading-tight mb-5 ${
              dark ? 'text-white' : 'text-[#2D1654]'
            }`}
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            {FRAMEWORK_INTRO.title}
          </h2>
          <p
            className={`font-jost text-lg font-light leading-relaxed max-w-2xl ${
              dark ? 'text-white/60' : 'text-gray-600'
            }`}
          >
            {FRAMEWORK_INTRO.summary}
          </p>
        </div>

        {/* Zone A — Choose a tier */}
        <div className="mb-6">
          <p
            className={`font-jost text-[11px] tracking-[0.28em] uppercase mb-4 ${
              dark ? 'text-white/35' : 'text-gray-400'
            }`}
          >
            Step 1 · Choose a tier
          </p>
          <div className="grid md:grid-cols-3 gap-3 md:gap-4">
            {SERVICE_GROUPS.map((g, i) => {
              const selected = g.id === activeGroup
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => selectGroup(g.id)}
                  className={`relative text-left p-5 md:p-6 border transition-all duration-300 ${
                    selected
                      ? dark
                        ? 'bg-[#1c1628] border-white/25 shadow-[0_0_0_1px_rgba(200,168,75,0.35)]'
                        : 'bg-white border-[#2D1654]/25 shadow-sm'
                      : dark
                        ? 'bg-transparent border-white/10 hover:border-white/25 opacity-75 hover:opacity-100'
                        : 'bg-white/50 border-black/8 hover:border-black/20 opacity-80 hover:opacity-100'
                  }`}
                  style={{
                    animation: entered ? `psf-service-in 450ms ease ${i * 70}ms both` : undefined,
                  }}
                >
                  <span
                    className="absolute top-0 left-0 right-0 h-[3px] transition-opacity duration-300"
                    style={{
                      backgroundColor: g.colour,
                      opacity: selected ? 1 : 0.35,
                    }}
                  />
                  <p
                    className="font-jost text-[11px] tracking-[0.22em] uppercase mb-2"
                    style={{ color: selected ? g.colour : dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
                  >
                    {g.label}
                  </p>
                  <p
                    className={`font-cormorant text-2xl leading-tight mb-2 ${
                      dark ? 'text-white' : 'text-[#2D1654]'
                    }`}
                  >
                    {g.title}
                  </p>
                  <p
                    className={`font-jost text-sm leading-snug ${
                      dark ? 'text-white/50' : 'text-gray-500'
                    }`}
                  >
                    {g.subtitle}
                  </p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Zone B + C — Browse & detail as one framed explorer */}
        <div
          className={`border transition-opacity duration-300 ${
            isPending ? 'opacity-70' : 'opacity-100'
          } ${dark ? 'border-white/12 bg-[#171225]' : 'border-black/8 bg-white'}`}
        >
          {/* Active tier banner */}
          <div
            className={`px-5 md:px-8 py-5 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3 ${
              dark ? 'border-white/10 bg-black/20' : 'border-gray-100 bg-[#F8F4EF]/80'
            }`}
          >
            <div className="min-w-0">
              <p
                className="font-jost text-[11px] tracking-[0.2em] uppercase mb-1"
                style={{ color: group.colour }}
              >
                {group.commercialNote}
              </p>
              <p
                className={`font-jost text-sm leading-relaxed max-w-3xl ${
                  dark ? 'text-white/65' : 'text-gray-600'
                }`}
              >
                {group.narrative}
              </p>
            </div>
            <p
              className={`font-jost text-xs tracking-wide shrink-0 ${
                dark ? 'text-white/35' : 'text-gray-400'
              }`}
            >
              {services.length} services
            </p>
          </div>

          <div className="grid lg:grid-cols-12 min-h-[28rem]">
            {/* Zone B — Service index */}
            <div
              className={`lg:col-span-4 border-b lg:border-b-0 lg:border-r ${
                dark ? 'border-white/10 bg-[#120e1c]' : 'border-gray-100 bg-[#FAFAF8]'
              }`}
            >
              <div className="px-5 pt-5 pb-3">
                <p
                  className={`font-jost text-[11px] tracking-[0.28em] uppercase ${
                    dark ? 'text-white/35' : 'text-gray-400'
                  }`}
                >
                  Step 2 · Browse services
                </p>
              </div>
              <div className="px-3 pb-4 max-h-[24rem] overflow-y-auto">
                {services.map((s, i) => {
                  const on = s.id === activeService?.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => startTransition(() => setActiveServiceId(s.id))}
                      className={`w-full text-left px-3 py-3 mb-0.5 transition-colors duration-200 border-l-[3px] ${
                        on
                          ? dark
                            ? 'bg-white/8 text-white'
                            : 'bg-white text-[#2D1654] shadow-sm'
                          : dark
                            ? 'border-l-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                            : 'border-l-transparent text-gray-500 hover:text-[#2D1654] hover:bg-white/70'
                      }`}
                      style={{
                        borderLeftColor: on ? group.colour : 'transparent',
                        animation: entered
                          ? `psf-service-in 400ms ease ${80 + i * 24}ms both`
                          : undefined,
                      }}
                    >
                      <span className="font-jost text-[10px] tracking-widest opacity-45 mr-2">
                        {String(s.number).padStart(2, '0')}
                      </span>
                      <span className="font-jost text-sm">{s.shortName}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Zone C — Detail */}
            <div
              key={activeService?.id}
              className={`lg:col-span-8 p-6 md:p-9 psf-panel relative ${
                dark ? 'text-white' : 'text-[#2D1654]'
              }`}
            >
              <div
                className="absolute top-0 bottom-0 left-0 w-1 hidden lg:block"
                style={{ backgroundColor: group.colour }}
              />
              <p
                className={`font-jost text-[11px] tracking-[0.28em] uppercase mb-5 ${
                  dark ? 'text-white/35' : 'text-gray-400'
                }`}
              >
                Step 3 · Service detail
              </p>

              {activeService && (
                <>
                  <p
                    className="font-jost text-[11px] tracking-[0.25em] uppercase mb-3"
                    style={{ color: group.colour }}
                  >
                    Service {String(activeService.number).padStart(2, '0')}
                  </p>
                  <h3 className="font-cormorant text-3xl md:text-[2.15rem] font-light mb-4 leading-snug">
                    {activeService.name}
                  </h3>
                  <p
                    className={`font-jost text-sm md:text-[15px] leading-relaxed mb-7 max-w-2xl ${
                      dark ? 'text-white/65' : 'text-gray-600'
                    }`}
                  >
                    {activeService.overview}
                  </p>

                  <div
                    className={`mb-8 pt-6 border-t ${
                      dark ? 'border-white/10' : 'border-gray-100'
                    }`}
                  >
                    <p
                      className={`font-jost text-[11px] tracking-[0.2em] uppercase mb-4 ${
                        dark ? 'text-white/35' : 'text-gray-400'
                      }`}
                    >
                      What it includes
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
                      {activeService.attributes.slice(0, 4).map(attr => (
                        <li
                          key={attr}
                          className={`font-jost text-sm flex gap-3 leading-snug ${
                            dark ? 'text-white/60' : 'text-gray-600'
                          }`}
                        >
                          <span
                            className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: group.colour }}
                          />
                          {attr}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(activeService.educationImpact ||
                    activeService.brandImpact ||
                    activeService.profitPotential) && (
                    <div
                      className={`grid grid-cols-3 gap-3 max-w-lg pt-5 border-t ${
                        dark ? 'border-white/10' : 'border-gray-100'
                      }`}
                    >
                      {[
                        ['Education', activeService.educationImpact],
                        ['Brand', activeService.brandImpact],
                        ['Commercial', activeService.profitPotential],
                      ].map(([label, value]) =>
                        value && value !== '-' ? (
                          <div
                            key={label as string}
                            className={`px-3 py-3 ${
                              dark ? 'bg-white/[0.04]' : 'bg-[#F8F4EF]'
                            }`}
                          >
                            <p
                              className={`font-jost text-[10px] tracking-widest uppercase mb-1 ${
                                dark ? 'text-white/35' : 'text-gray-400'
                              }`}
                            >
                              {label}
                            </p>
                            <p
                              className="font-jost text-sm font-medium"
                              style={{ color: dark ? '#C8A84B' : '#4C2585' }}
                            >
                              {value}
                            </p>
                          </div>
                        ) : null
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Why it matters — separate, quiet strip */}
        <div
          className={`mt-8 grid md:grid-cols-3 gap-4 md:gap-6 ${
            dark ? 'text-white/55' : 'text-gray-600'
          }`}
        >
          {FRAMEWORK_INTRO.whyItMatters.map((line, i) => (
            <p key={line} className="font-jost text-sm leading-relaxed flex gap-3">
              <span className="text-[#C8A84B] shrink-0 font-medium">{String(i + 1).padStart(2, '0')}</span>
              <span>{line}</span>
            </p>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`mt-10 flex flex-wrap gap-4 items-center pt-8 border-t ${
            dark ? 'border-white/10' : 'border-black/8'
          }`}
        >
          {variant === 'home' ? (
            <>
              <Link
                href="/investors#services"
                className="bg-[#C8A84B] text-[#2D1654] px-7 py-3 rounded-sm font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
              >
                Explore for investors
              </Link>
              <Link
                href="/login?audience=investor"
                className={`font-jost text-sm transition-colors ${
                  dark
                    ? 'text-white/55 hover:text-[#C8A84B]'
                    : 'text-[#2D1654]/70 hover:text-[#4C2585]'
                }`}
              >
                Full programme detail in the Investor Portal →
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login?audience=investor"
                className="bg-[#C8A84B] text-[#2D1654] px-7 py-3 rounded-sm font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
              >
                Open Investor Portal
              </Link>
              <p
                className={`font-jost text-sm max-w-md ${
                  dark ? 'text-white/50' : 'text-gray-500'
                }`}
              >
                Invited partners can review the complete 33-service framework, partner commitments,
                and impact matrix inside the password-protected portal.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
