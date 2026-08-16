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
      className={`relative overflow-hidden py-28 ${
        dark
          ? 'bg-[#1A1228]'
          : 'bg-gradient-to-br from-[#F8F4EF] via-white to-[#F0EBE3]'
      }`}
    >
      {/* Atmospheric plane */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: dark
            ? `radial-gradient(ellipse 80% 60% at 15% 20%, ${group.colour}22 0%, transparent 55%),
               radial-gradient(ellipse 70% 50% at 90% 80%, #C8A84B14 0%, transparent 50%)`
            : `radial-gradient(ellipse 70% 50% at 10% 30%, ${group.colour}18 0%, transparent 55%),
               radial-gradient(ellipse 60% 40% at 95% 70%, #C8A84B12 0%, transparent 50%)`,
        }}
      />
      <div
        className={`pointer-events-none absolute inset-0 ${
          dark ? 'opacity-[0.07]' : 'opacity-[0.04]'
        }`}
        style={{
          backgroundImage:
            'repeating-linear-gradient(-12deg, transparent, transparent 48px, currentColor 48px, currentColor 49px)',
          color: dark ? '#C8A84B' : '#2D1654',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div
          className={`max-w-3xl mb-14 transition-all duration-700 ${
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
              dark ? 'text-white/65' : 'text-gray-600'
            }`}
          >
            {FRAMEWORK_INTRO.summary}
          </p>
        </div>

        {/* Tier story rail */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <div className="lg:col-span-4 space-y-3">
            {SERVICE_GROUPS.map((g, i) => {
              const selected = g.id === activeGroup
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => selectGroup(g.id)}
                  className={`group w-full text-left relative overflow-hidden transition-all duration-500 ${
                    selected ? 'pl-5' : 'pl-4 opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    transitionDelay: entered ? `${i * 80}ms` : '0ms',
                    transform: entered ? 'translateX(0)' : 'translateX(-12px)',
                    opacity: entered ? undefined : 0,
                  }}
                >
                  <span
                    className={`absolute left-0 top-2 bottom-2 w-[3px] transition-all duration-500 ${
                      selected ? 'scale-y-100' : 'scale-y-40 opacity-40'
                    }`}
                    style={{ backgroundColor: g.colour, transformOrigin: 'center' }}
                  />
                  <p
                    className={`font-jost text-[11px] tracking-[0.25em] uppercase mb-1 ${
                      dark ? 'text-white/45' : 'text-gray-500'
                    }`}
                  >
                    {g.label}
                  </p>
                  <p
                    className={`font-cormorant text-2xl mb-1 transition-colors ${
                      selected
                        ? dark
                          ? 'text-white'
                          : 'text-[#2D1654]'
                        : dark
                          ? 'text-white/70 group-hover:text-white'
                          : 'text-[#2D1654]/70'
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

            <ul className={`pt-8 space-y-3 border-t ${dark ? 'border-white/10' : 'border-gray-200'}`}>
              {FRAMEWORK_INTRO.whyItMatters.map(line => (
                <li
                  key={line}
                  className={`font-jost text-sm leading-relaxed flex gap-3 ${
                    dark ? 'text-white/55' : 'text-gray-600'
                  }`}
                >
                  <span className="text-[#C8A84B] shrink-0 mt-0.5">◆</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active tier + service story */}
          <div
            className={`lg:col-span-8 transition-opacity duration-300 ${
              isPending ? 'opacity-60' : 'opacity-100'
            }`}
          >
            <div
              className={`mb-8 pb-8 border-b ${
                dark ? 'border-white/10' : 'border-gray-200'
              }`}
            >
              <p
                className="font-jost text-xs tracking-[0.2em] uppercase mb-3"
                style={{ color: group.colour }}
              >
                {group.commercialNote}
              </p>
              <p
                className={`font-jost text-base leading-relaxed max-w-2xl ${
                  dark ? 'text-white/70' : 'text-gray-600'
                }`}
              >
                {group.narrative}
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              <div className="md:col-span-2">
                <p
                  className={`font-jost text-[11px] tracking-[0.22em] uppercase mb-4 ${
                    dark ? 'text-white/40' : 'text-gray-400'
                  }`}
                >
                  {services.length} services in this tier
                </p>
                <div className="space-y-1 max-h-[22rem] overflow-y-auto pr-2">
                  {services.map((s, i) => {
                    const on = s.id === activeService?.id
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => startTransition(() => setActiveServiceId(s.id))}
                        className={`w-full text-left px-3 py-2.5 transition-all duration-300 border-l-2 ${
                          on
                            ? dark
                              ? 'bg-white/8 border-l-[#C8A84B] text-white'
                              : 'bg-[#2D1654]/05 border-l-[#C8A84B] text-[#2D1654]'
                            : dark
                              ? 'border-l-transparent text-white/55 hover:text-white/85 hover:bg-white/4'
                              : 'border-l-transparent text-gray-500 hover:text-[#2D1654] hover:bg-black/[0.03]'
                        }`}
                        style={{
                          animation: entered
                            ? `psf-service-in 420ms ease ${i * 28}ms both`
                            : undefined,
                        }}
                      >
                        <span className="font-jost text-[10px] tracking-widest opacity-50 mr-2">
                          {String(s.number).padStart(2, '0')}
                        </span>
                        <span className="font-jost text-sm">{s.shortName}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div
                key={activeService?.id}
                className={`md:col-span-3 psf-panel ${
                  dark ? 'text-white' : 'text-[#2D1654]'
                }`}
              >
                {activeService && (
                  <>
                    <p
                      className="font-jost text-[11px] tracking-[0.25em] uppercase mb-3"
                      style={{ color: group.colour }}
                    >
                      Service {String(activeService.number).padStart(2, '0')}
                    </p>
                    <h3 className="font-cormorant text-3xl font-light mb-4 leading-snug">
                      {activeService.name}
                    </h3>
                    <p
                      className={`font-jost text-sm leading-relaxed mb-6 ${
                        dark ? 'text-white/65' : 'text-gray-600'
                      }`}
                    >
                      {activeService.overview}
                    </p>
                    <ul className="space-y-2.5 mb-8">
                      {activeService.attributes.slice(0, 4).map(attr => (
                        <li
                          key={attr}
                          className={`font-jost text-sm flex gap-3 leading-snug ${
                            dark ? 'text-white/55' : 'text-gray-600'
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
                    {(activeService.educationImpact ||
                      activeService.brandImpact ||
                      activeService.profitPotential) && (
                      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8">
                        {[
                          ['Education', activeService.educationImpact],
                          ['Brand', activeService.brandImpact],
                          ['Commercial', activeService.profitPotential],
                        ].map(([label, value]) =>
                          value && value !== '-' ? (
                            <div key={label as string}>
                              <p
                                className={`font-jost text-[10px] tracking-widest uppercase ${
                                  dark ? 'text-white/35' : 'text-gray-400'
                                }`}
                              >
                                {label}
                              </p>
                              <p
                                className={`font-jost text-xs ${
                                  dark ? 'text-[#C8A84B]' : 'text-[#4C2585]'
                                }`}
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

            <div
              className={`mt-10 flex flex-wrap gap-4 items-center pt-8 border-t ${
                dark ? 'border-white/10' : 'border-gray-200'
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
                        ? 'text-white/60 hover:text-[#C8A84B]'
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
                    Invited partners can review the complete 33-service framework, partner
                    commitments, and impact matrix inside the password-protected portal.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
