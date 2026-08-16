'use client'

import { useState, useTransition } from 'react'
import {
  FRAMEWORK_INTRO,
  GROUP1_PARTNER_COMMITMENTS,
  PARTNER_SERVICES,
  SERVICE_GROUPS,
  servicesByGroup,
  type ImpactLevel,
  type PartnerService,
  type ServiceGroupId,
} from '@/lib/content/partner-services'
import { ChevronDown } from 'lucide-react'

function ImpactPill({ label, value }: { label: string; value?: ImpactLevel }) {
  if (!value || value === '-') return null
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-jost text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1">
      <span className="text-gray-400 uppercase tracking-wider">{label}</span>
      <span className="text-[#4C2585] font-medium">{value}</span>
    </span>
  )
}

function ServiceRow({ service, open, onToggle }: {
  service: PartnerService
  open: boolean
  onToggle: () => void
}) {
  return (
    <article className="border border-gray-100 bg-white">
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-[#F8F4EF]/60 transition-colors"
      >
        <span className="font-jost text-xs text-[#C8A84B] tracking-widest mt-1 shrink-0">
          {String(service.number).padStart(2, '0')}
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-cormorant text-xl text-[#2D1654] leading-snug">{service.name}</h3>
          {!open && (
            <p className="font-jost text-sm text-gray-500 mt-1 line-clamp-2">{service.overview}</p>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-400 mt-1 shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-0 md:pl-[4.25rem] space-y-5">
            <p className="font-jost text-sm text-gray-600 leading-relaxed">{service.overview}</p>

            <div>
              <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-2">
                Key attributes
              </p>
              <ul className="space-y-1.5">
                {service.attributes.map(a => (
                  <li key={a} className="font-jost text-sm text-gray-600 flex gap-2">
                    <span className="text-[#C8A84B]">·</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            {service.products && service.products.length > 0 && (
              <div>
                <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-2">
                  Products / deliverables
                </p>
                <ul className="space-y-1.5">
                  {service.products.map(p => (
                    <li key={p} className="font-jost text-sm text-gray-600 flex gap-2">
                      <span className="text-[#6B3DA8]">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {service.successCriteria && service.successCriteria.length > 0 && (
              <div>
                <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-2">
                  Success criteria
                </p>
                <ul className="space-y-1.5">
                  {service.successCriteria.map(c => (
                    <li key={c} className="font-jost text-sm text-gray-600 flex gap-2">
                      <span className="text-[#34D399]">·</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <ImpactPill label="Education" value={service.educationImpact} />
              <ImpactPill label="Relationship" value={service.relationshipImpact} />
              <ImpactPill label="Brand" value={service.brandImpact} />
              <ImpactPill label="Profit" value={service.profitPotential} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function PartnerServicesDetail() {
  const [activeGroup, setActiveGroup] = useState<ServiceGroupId>(1)
  const [openId, setOpenId] = useState<string | null>(PARTNER_SERVICES[0]?.id ?? null)
  const [, startTransition] = useTransition()

  const group = SERVICE_GROUPS.find(g => g.id === activeGroup)!
  const services = servicesByGroup(activeGroup)

  return (
    <div>
      <div className="mb-10 max-w-3xl">
        <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-3 font-jost font-semibold">
          {FRAMEWORK_INTRO.eyebrow}
        </p>
        <h1 className="font-cormorant text-4xl text-[#2D1654] mb-3">{FRAMEWORK_INTRO.title}</h1>
        <p className="text-gray-500 font-jost text-sm leading-relaxed mb-4">
          {FRAMEWORK_INTRO.summary} This portal view includes the full programme detail across all{' '}
          {PARTNER_SERVICES.length} services, partner commitments, and impact signals.
        </p>
        <ul className="space-y-2">
          {FRAMEWORK_INTRO.whyItMatters.map(line => (
            <li key={line} className="font-jost text-sm text-gray-600 flex gap-2">
              <span className="text-[#C8A84B]">◆</span>
              {line}
            </li>
          ))}
        </ul>
      </div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {SERVICE_GROUPS.map(g => {
          const selected = g.id === activeGroup
          return (
            <button
              key={g.id}
              type="button"
              onClick={() =>
                startTransition(() => {
                  setActiveGroup(g.id)
                  const first = servicesByGroup(g.id)[0]
                  setOpenId(first?.id ?? null)
                })
              }
              className={`px-5 py-3 font-jost text-sm transition-colors border ${
                selected
                  ? 'bg-[#2D1654] text-white border-[#2D1654]'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-[#C8A84B]'
              }`}
            >
              <span className="block text-[10px] tracking-[0.2em] uppercase opacity-70 mb-0.5">
                {g.label}
              </span>
              {g.title}
            </button>
          )
        })}
      </div>

      <div
        className="mb-8 p-6 border-l-4 bg-[#F8F4EF]"
        style={{ borderColor: group.colour }}
      >
        <p className="font-cormorant text-2xl text-[#2D1654] mb-2">{group.title}</p>
        <p className="font-jost text-sm text-gray-600 leading-relaxed mb-3">{group.narrative}</p>
        <p className="font-jost text-xs text-[#4C2585] tracking-wide">{group.commercialNote}</p>
      </div>

      {activeGroup === 1 && (
        <div className="mb-8 bg-white border border-gray-100 p-6">
          <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-gray-400 mb-3">
            Partner commitments (Group 1)
          </p>
          <div className="grid sm:grid-cols-2 gap-2">
            {GROUP1_PARTNER_COMMITMENTS.map(c => (
              <p key={c} className="font-jost text-sm text-gray-600 flex gap-2">
                <span className="text-[#C8A84B]">·</span>
                {c}
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {services.map(service => (
          <ServiceRow
            key={service.id}
            service={service}
            open={openId === service.id}
            onToggle={() =>
              startTransition(() =>
                setOpenId(prev => (prev === service.id ? null : service.id))
              )
            }
          />
        ))}
      </div>
    </div>
  )
}
