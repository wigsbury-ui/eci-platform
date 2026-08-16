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

  return (
    <section
      id="services"
      className="relative overflow-hidden py-12 md:py-16 lg:min-h-[100svh] lg:flex lg:flex-col lg:justify-center bg-white"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-40"
        style={{
          background: `linear-gradient(180deg, ${group.colour}14 0%, transparent 100%)`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 w-full">
        <div
          className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 transition-all duration-700 ${
            entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div className="max-w-2xl">
            <p className="text-[#C8A84B] text-[11px] tracking-[0.32em] uppercase mb-2 font-jost font-bold">
              {FRAMEWORK_INTRO.eyebrow}
            </p>
            <h2
              className="font-cormorant font-semibold text-[#2D1654] leading-tight"
              style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.85rem)' }}
            >
              {FRAMEWORK_INTRO.title}
            </h2>
            <div className="mt-3 w-16 h-1 bg-[#C8A84B]" />
          </div>
          <p className="font-jost text-sm leading-snug max-w-md lg:text-right text-[#2D1654]/75">
            Three tiers — from non-negotiable foundations to premium specialisation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
          {SERVICE_GROUPS.map((g, i) => {
            const selected = g.id === activeGroup
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => selectGroup(g.id)}
                className={`relative text-left px-4 py-3.5 border-2 transition-all duration-300 ${
                  selected
                    ? 'bg-[#2D1654] border-[#2D1654] text-white shadow-md'
                    : 'bg-[#F8F4EF] border-transparent text-[#2D1654] hover:border-[#C8A84B]/60'
                }`}
                style={{
                  animation: entered ? `psf-service-in 400ms ease ${i * 50}ms both` : undefined,
                }}
              >
                <span
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{ backgroundColor: g.colour }}
                />
                <p
                  className={`font-jost text-[10px] tracking-[0.22em] uppercase mb-1 font-semibold ${
                    selected ? 'text-[#C8A84B]' : 'text-[#4C2585]'
                  }`}
                >
                  {g.label}
                </p>
                <p className="font-cormorant text-xl leading-tight font-semibold">{g.title}</p>
              </button>
            )
          })}
        </div>

        <div
          className={`border-2 border-[#2D1654]/12 bg-white shadow-[0_12px_40px_rgba(45,22,84,0.08)] transition-opacity duration-300 ${
            isPending ? 'opacity-70' : 'opacity-100'
          }`}
        >
          <div
            className="px-5 py-3.5 flex items-center justify-between gap-4 text-white"
            style={{ backgroundColor: '#2D1654' }}
          >
            <div className="min-w-0">
              <p className="font-jost text-[11px] tracking-[0.2em] uppercase font-semibold text-[#C8A84B]">
                {group.label} · {group.title}
              </p>
              <p className="font-jost text-xs mt-0.5 text-white/70 truncate">{group.subtitle}</p>
            </div>
            <p className="font-jost text-xs shrink-0 text-[#C8A84B] font-semibold tabular-nums">
              {services.length} services
            </p>
          </div>

          <div className="grid lg:grid-cols-12 lg:h-[min(30rem,52vh)]">
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#2D1654]/10 bg-[#F8F4EF] overflow-y-auto">
              <div className="p-2.5">
                {services.map((s, i) => {
                  const on = s.id === activeService?.id
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => startTransition(() => setActiveServiceId(s.id))}
                      className={`w-full text-left px-3.5 py-2.5 transition-colors duration-200 border-l-[3px] ${
                        on
                          ? 'bg-white text-[#2D1654] font-medium shadow-sm'
                          : 'border-l-transparent text-[#2D1654]/55 hover:text-[#2D1654] hover:bg-white/70'
                      }`}
                      style={{
                        borderLeftColor: on ? '#C8A84B' : 'transparent',
                        animation: entered
                          ? `psf-service-in 360ms ease ${60 + i * 18}ms both`
                          : undefined,
                      }}
                    >
                      <span className="font-jost text-[10px] tracking-widest text-[#C8A84B] mr-2 font-semibold">
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
              className="lg:col-span-8 p-6 md:p-8 psf-panel relative overflow-y-auto flex flex-col text-[#2D1654] bg-white"
            >
              <div
                className="absolute top-0 bottom-0 left-0 w-1.5 hidden lg:block"
                style={{ backgroundColor: group.colour }}
              />

              {activeService && (
                <>
                  <p
                    className="font-jost text-[11px] tracking-[0.25em] uppercase mb-2 font-bold"
                    style={{ color: group.colour }}
                  >
                    Service {String(activeService.number).padStart(2, '0')}
                  </p>
                  <h3
                    className="font-cormorant font-semibold leading-snug mb-4"
                    style={{ fontSize: 'clamp(1.75rem, 2.4vw, 2.35rem)' }}
                  >
                    {activeService.name}
                  </h3>
                  <p className="font-jost text-[15px] leading-relaxed mb-6 max-w-2xl text-[#2D1654]/75">
                    {activeService.overview}
                  </p>

                  <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-auto">
                    {activeService.attributes.slice(0, 4).map(attr => (
                      <li key={attr} className="font-jost text-sm flex gap-3 leading-snug text-[#2D1654]/80">
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: '#C8A84B' }}
                        />
                        {attr}
                      </li>
                    ))}
                  </ul>

                  {(activeService.educationImpact ||
                    activeService.brandImpact ||
                    activeService.profitPotential) && (
                    <div className="grid grid-cols-3 gap-3 max-w-xl mt-8 pt-5 border-t-2 border-[#C8A84B]/40">
                      {[
                        ['Education', activeService.educationImpact],
                        ['Brand', activeService.brandImpact],
                        ['Commercial', activeService.profitPotential],
                      ].map(([label, value]) =>
                        value && value !== '-' ? (
                          <div key={label as string} className="px-3 py-2.5 bg-[#2D1654] text-white">
                            <p className="font-jost text-[10px] tracking-widest uppercase mb-1 text-[#C8A84B]">
                              {label}
                            </p>
                            <p className="font-jost text-sm font-semibold">{value}</p>
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

        <div className="mt-5 flex flex-wrap gap-3 items-center">
          {variant === 'home' ? (
            <>
              <Link
                href="/investors#services"
                className="bg-[#C8A84B] text-[#2D1654] px-6 py-3 rounded-sm font-jost font-bold text-sm hover:bg-[#F0E4B0] transition-colors shadow-sm"
              >
                Explore for investors
              </Link>
              <Link
                href="/login?audience=investor"
                className="font-jost text-sm font-semibold text-[#2D1654] hover:text-[#C8A84B] transition-colors"
              >
                Full detail in Investor Portal →
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login?audience=investor"
                className="bg-[#C8A84B] text-[#2D1654] px-6 py-3 rounded-sm font-jost font-bold text-sm hover:bg-[#F0E4B0] transition-colors shadow-sm"
              >
                Open Investor Portal
              </Link>
              <p className="font-jost text-xs max-w-md text-[#2D1654]/60">
                Full 33-service framework inside the password-protected portal.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
