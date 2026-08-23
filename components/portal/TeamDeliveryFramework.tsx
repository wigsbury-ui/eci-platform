'use client'

import { useState } from 'react'
import type { School } from '@/lib/types'
import {
  FRAMEWORK_INTRO,
  SERVICE_GROUPS,
  servicesByGroup,
  type PartnerService,
  type ServiceGroupId,
} from '@/lib/content/partner-services'
import DeliverySubNav from '@/components/portal/delivery/DeliverySubNav'

type Props = {
  schools: School[]
  demoMode?: boolean
}

export default function TeamDeliveryFramework({ schools, demoMode }: Props) {
  const [group, setGroup] = useState<ServiceGroupId>(1)
  const [schoolId, setSchoolId] = useState(schools[0]?.id ?? '')
  const [openId, setOpenId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const services = servicesByGroup(group)
  const groupMeta = SERVICE_GROUPS.find(g => g.id === group)

  const activateService = async (service: PartnerService, mode: 'group' | 'single') => {
    if (demoMode) {
      setMessage(`Demo mode — would create promise for ${service.name} at ${schools.find(s => s.id === schoolId)?.name}.`)
      return
    }
    if (!schoolId) return
    setMessage(null)
    const body =
      mode === 'single'
        ? { schoolId, serviceId: service.id }
        : { schoolId, group: service.group }
    const res = await fetch('/api/team/delivery/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.error ?? 'Could not activate')
      return
    }
    if (mode === 'single') {
      setMessage(`Created promise for ${service.name}. Open the school board to review.`)
    } else {
      setMessage(`Activated ${data.activated} promises for Group ${data.group}. Open the school board to review.`)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Framework browser</h1>
        <p className="text-gray-400 text-sm font-jost mt-1 max-w-2xl">
          Read-only catalog from the Partner Services framework. Activate groups for a school without retyping success criteria.
        </p>
      </div>

      <DeliverySubNav active="/team/delivery/framework" />

      <div className="rounded-xl border border-gray-200 bg-white p-6 mb-6">
        <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-[#C8A84B]">{FRAMEWORK_INTRO.eyebrow}</p>
        <h2 className="font-cormorant text-2xl text-[#2D1654] mt-1">{FRAMEWORK_INTRO.title}</h2>
        <p className="font-jost text-sm text-gray-600 mt-2 max-w-3xl">{FRAMEWORK_INTRO.summary}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <label className="font-jost text-xs text-gray-500">
          School
          <select
            value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
            className="ml-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <div className="flex gap-2">
          {SERVICE_GROUPS.map(g => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroup(g.id)}
              className={`rounded-lg px-3 py-1.5 text-sm font-jost font-medium border ${
                group === g.id
                  ? 'border-[#2D1654] bg-[#2D1654] text-white'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {groupMeta && (
        <p className="font-jost text-sm text-gray-500 mb-4">
          <span className="font-semibold text-[#2D1654]">{groupMeta.title}</span> — {groupMeta.subtitle}
        </p>
      )}

      {message && (
        <p className="mb-4 rounded-lg border border-[#C8A84B]/40 bg-[#F8F4EF] px-4 py-2 text-sm font-jost text-[#2D1654]">
          {message}
        </p>
      )}

      <div className="space-y-3">
        {services.map(service => {
          const open = openId === service.id
          return (
            <article key={service.id} className="rounded-xl border border-gray-200 bg-white">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : service.id)}
                className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50"
              >
                <span className="font-jost text-xs text-[#C8A84B] tracking-widest shrink-0">
                  {String(service.number).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-cormorant text-xl text-[#2D1654]">{service.name}</h3>
                  {!open && (
                    <p className="font-jost text-sm text-gray-500 mt-1 line-clamp-2">{service.overview}</p>
                  )}
                </div>
              </button>
              {open && (
                <div className="px-5 pb-5 md:pl-16 space-y-4 border-t border-gray-100 pt-4">
                  <p className="font-jost text-sm text-gray-600 leading-relaxed">{service.overview}</p>
                  {service.successCriteria && service.successCriteria.length > 0 && (
                    <ul className="space-y-1">
                      {service.successCriteria.map(c => (
                        <li key={c} className="font-jost text-sm text-gray-600 flex gap-2">
                          <span className="text-[#C8A84B]">·</span>{c}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => activateService(service, 'single')}
                      className="rounded-lg bg-[#2D1654] px-4 py-2 text-sm font-jost font-semibold text-white hover:bg-[#4C2585]"
                    >
                      Create promise from this service
                    </button>
                    <button
                      type="button"
                      onClick={() => activateService(service, 'group')}
                      className="rounded-lg border border-[#4C2585] px-4 py-2 text-sm font-jost font-semibold text-[#4C2585] hover:bg-[#F8F4EF]"
                    >
                      Activate full Group {service.group}
                    </button>
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
