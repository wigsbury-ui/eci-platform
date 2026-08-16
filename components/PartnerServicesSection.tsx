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
      className={`relative overflow-hidden py-12 md:py-14 lg:min-h-[100svh] lg:flex lg:flex-col lg:justify-center ${
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

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        {/* Compact header row */}
        <div
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5 transition-all duration-700 ${
            entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="max-w-2xl">
            <p
              className={`text-[11px] tracking-[0.3em] uppercase mb-2 font-jost font-semibold ${
                dark ? 'text-[#C8A84B]' : 'text-[#4C2585]'
              }`}
            >
              {FRAMEWORK_INTRO.eyebrow}
            </p>
            <h2
              className={`font-cormorant font-light leading-tight ${
                dark ? 'text-white' : 'text-[#2D1654]'
              }`}
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.65rem)' }}
            >
              {FRAMEWORK_INTRO.title}
            </h2>
          </div>
          <p
            className={`font-jost text-sm font-light leading-snug max-w-md lg:text-right ${
              dark ? 'text-white/55' : 'text-gray-600'
            }`}
          >
            Three tiers — from non-negotiable foundations to premium specialisation.
          </p>
        </div>

        {/* Tier chooser — compact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          {SERVICE_GROUPS.map((g, i) => {
            const selected = g.id === activeGroup
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => selectGroup(g.id)}
                className={`relative text-left px-4 py-3 border transition-all duration-300 ${
                  selected
                    ? dark
                      ? 'bg-[#1c1628] border-white/25'
                      : 'bg-white border-[#2D1654]/25'
                    : dark
                      ? 'bg-transparent border-white/10 hover:border-white/25 opacity-70 hover:opacity-100'
                      : 'bg-white/40 border-black/8 hover:border-black/20 opacity-75 hover:opacity-100'
                }`}
                style={{
                  animation: entered ? `psf-service-in 400ms ease ${i * 50}ms both` : undefined,
                }}
              >
                <span
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{
                    backgroundColor: g.colour,
                    opacity: selected ? 1 : 0.3,
                  }}
                />
                <p
                  className="font-jost text-[10px] tracking-[0.2em] uppercase mb-0.5"
                  style={{ color: selected ? g.colour : dark ? 'rgba(255,255,255,0.4)' : '#9CA3AF' }}
                >
                  {g.label}
                </p>
                <p
                  className={`font-cormorant text-xl leading-tight ${
                    dark ? 'text-white' : 'text-[#2D1654]'
                  }`}
                >
                  {g.title}
                </p>
              </button>
            )
          })}
        </div>

        {/* Explorer — single viewport-friendly frame */}
        <div
          className={`border transition-opacity duration-300 ${
            isPending ? 'opacity-70' : 'opacity-100'
          } ${dark ? 'border-white/12 bg-[#171225]' : 'border-black/8 bg-white'}`}
        >
          <div
            className={`px-4 py-2.5 border-b flex items-center justify-between gap-3 ${
              dark ? 'border-white/10 bg-black/20' : 'border-gray-100 bg-[#F8F4EF]/70'
            }`}
          >
            <p
              className="font-jost text-[11px] tracking-[0.18em] uppercase truncate"
              style={{ color: group.colour }}
            >
              {group.commercialNote}
            </p>
            <p
              className={`font-jost text-[11px] shrink-0 ${
                dark ? 'text-white/35' : 'text-gray-400'
              }`}
            >
              {services.length} services
            </p>
          </div>

          <div className="grid lg:grid-cols-12 lg:h-[min(22rem,42vh)]">
            <div
              className={`lg:col-span-4 border-b lg:border-b-0 lg:border-r overflow-y-auto ${
                dark ? 'border-white/10 bg-[#120e1c]' : 'border-gray-100 bg-[#FAFAF8]'
              }`}
            >
              <div className="p-2">
                {services.map((s, i) => {
                  const on = s.id === activeService?.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => startTransition(() => setActiveServiceId(s.id))}
                      className={`w-full text-left px-3 py-2 transition-colors duration-200 border-l-[3px] ${
                        on
                          ? dark
                            ? 'bg-white/8 text-white'
                            : 'bg-white text-[#2D1654]'
                          : dark
                            ? 'border-l-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.04]'
                            : 'border-l-transparent text-gray-500 hover:text-[#2D1654] hover:bg-white/80'
                      }`}
                      style={{
                        borderLeftColor: on ? group.colour : 'transparent',
                        animation: entered
                          ? `psf-service-in 360ms ease ${60 + i * 18}ms both`
                          : undefined,
                      }}
                    >
                      <span className="font-jost text-[10px] tracking-widest opacity-45 mr-2">
                        {String(s.number).padStart(2, '0')}
                      </span>
                      <span className="font-jost text-[13px]">{s.shortName}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div
              key={activeService?.id}
              className={`lg:col-span-8 p-4 md:p-5 psf-panel relative overflow-y-auto ${
                dark ? 'text-white' : 'text-[#2D1654]'
              }`}
            >
              <div
                className="absolute top-0 bottom-0 left-0 w-1 hidden lg:block"
                style={{ backgroundColor: group.colour }}
              />

              {activeService && (
                <>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                    <p
                      className="font-jost text-[10px] tracking-[0.22em] uppercase"
                      style={{ color: group.colour }}
                    >
                      Service {String(activeService.number).padStart(2, '0')}
                    </p>
                    <h3 className="font-cormorant text-2xl font-light leading-snug">
                      {activeService.name}
                    </h3>
                  </div>
                  <p
                    className={`font-jost text-[13px] leading-relaxed mb-4 max-w-2xl ${
                      dark ? 'text-white/60' : 'text-gray-600'
                    }`}
                  >
                    {activeService.overview}
                  </p>

                  <ul className="grid sm:grid-cols-2 gap-x-5 gap-y-1.5 mb-4">
                    {activeService.attributes.slice(0, 4).map(attr => (
                      <li
                        key={attr}
                        className={`font-jost text-[12px] flex gap-2 leading-snug ${
                          dark ? 'text-white/55' : 'text-gray-600'
                        }`}
                      >
                        <span
                          className="mt-1.5 w-1 h-1 rounded-full shrink-0"
                          style={{ backgroundColor: group.colour }}
                        />
                        {attr}
                      </li>
                    ))}
                  </ul>

                  {(activeService.educationImpact ||
                    activeService.brandImpact ||
                    activeService.profitPotential) && (
                    <div className="flex flex-wrap gap-x-5 gap-y-1">
                      {[
                        ['Education', activeService.educationImpact],
                        ['Brand', activeService.brandImpact],
                        ['Commercial', activeService.profitPotential],
                      ].map(([label, value]) =>
                        value && value !== '-' ? (
                          <p key={label as string} className="font-jost text-[11px]">
                            <span className={dark ? 'text-white/35' : 'text-gray-400'}>
                              {label}{' '}
                            </span>
                            <span style={{ color: dark ? '#C8A84B' : '#4C2585' }}>{value}</span>
                          </p>
                        ) : null
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* CTA — single compact row */}
        <div className="mt-4 flex flex-wrap gap-3 items-center">
          {variant === 'home' ? (
            <>
              <Link
                href="/investors#services"
                className="bg-[#C8A84B] text-[#2D1654] px-5 py-2.5 rounded-sm font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
              >
                Explore for investors
              </Link>
              <Link
                href="/login?audience=investor"
                className={`font-jost text-sm transition-colors ${
                  dark
                    ? 'text-white/50 hover:text-[#C8A84B]'
                    : 'text-[#2D1654]/70 hover:text-[#4C2585]'
                }`}
              >
                Full detail in Investor Portal →
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login?audience=investor"
                className="bg-[#C8A84B] text-[#2D1654] px-5 py-2.5 rounded-sm font-jost font-semibold text-sm hover:bg-[#F0E4B0] transition-colors"
              >
                Open Investor Portal
              </Link>
              <p className={`font-jost text-xs max-w-md ${dark ? 'text-white/45' : 'text-gray-500'}`}>
                Full 33-service framework inside the password-protected portal.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
