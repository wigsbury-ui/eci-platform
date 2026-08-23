'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { School } from '@/lib/types'
import type { ServicePromise } from '@/lib/delivery/types'
import {
  FRAMEWORK_INTRO,
  SERVICE_GROUPS,
  servicesByGroup,
  type PartnerService,
  type ServiceGroupId,
} from '@/lib/content/partner-services'
import DeliverySubNav from '@/components/portal/delivery/DeliverySubNav'
import DeliveryWorkflowSteps from '@/components/portal/delivery/DeliveryWorkflowSteps'
import DeliveryPromiseLedger from '@/components/portal/delivery/DeliveryPromiseLedger'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import { demoPromisesForSchool } from '@/lib/delivery/demo'

type Props = {
  schools: School[]
  initialPromises?: ServicePromise[]
  demoMode?: boolean
}

export default function TeamDeliveryFramework({
  schools,
  initialPromises = [],
  demoMode,
}: Props) {
  const [group, setGroup] = useState<ServiceGroupId>(1)
  const [schoolId, setSchoolId] = useState(schools[0]?.id ?? '')
  const [openId, setOpenId] = useState<string | null>(null)
  const [promises, setPromises] = useState<ServicePromise[]>(initialPromises)
  const [loading, setLoading] = useState(false)
  const [activating, setActivating] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)

  const school = schools.find(s => s.id === schoolId)
  const services = servicesByGroup(group)
  const groupMeta = SERVICE_GROUPS.find(g => g.id === group)
  const schoolBoardHref = schoolId ? `/team/delivery/schools/${schoolId}` : null

  const schoolPromises = useMemo(
    () => promises.filter(p => p.school_id === schoolId),
    [promises, schoolId]
  )

  const promiseByServiceId = useMemo(() => {
    const map = new Map<string, ServicePromise>()
    schoolPromises.forEach(p => map.set(p.service_id, p))
    return map
  }, [schoolPromises])

  const groupPromises = schoolPromises.filter(p => p.service_group === group)
  const groupServiceCount = services.length
  const groupTrackedCount = services.filter(s => promiseByServiceId.has(s.id)).length
  const groupFullyTracked = groupTrackedCount >= groupServiceCount

  const loadPromises = useCallback(async () => {
    if (!schoolId) return
    if (demoMode) {
      setPromises(prev => {
        const others = prev.filter(p => p.school_id !== schoolId)
        return [...others, ...demoPromisesForSchool(schoolId, school?.name ?? 'School')]
      })
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/team/delivery/promises?schoolId=${encodeURIComponent(schoolId)}`)
      const data = await res.json()
      if (data.promises) {
        setPromises(prev => {
          const others = prev.filter(p => p.school_id !== schoolId)
          return [...others, ...data.promises]
        })
      }
    } finally {
      setLoading(false)
    }
  }, [demoMode, schoolId, school?.name])

  useEffect(() => {
    loadPromises()
  }, [loadPromises])

  const activateService = async (service: PartnerService, mode: 'group' | 'single') => {
    if (demoMode) {
      setFlash(`Demo mode — would add ${mode === 'group' ? `Group ${service.group}` : service.name} to the ledger.`)
      return
    }
    if (!schoolId) return
    setActivating(true)
    setFlash(null)
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
    setActivating(false)
    if (!res.ok) {
      setFlash(data.error ?? 'Could not activate')
      return
    }
    await loadPromises()
    if (mode === 'single') {
      setFlash(`Added “${service.name}” to the ledger. See it in the list below or on the school board.`)
    } else {
      setFlash(
        `Added ${data.activated} promises for Group ${data.group} to the ledger. They are listed below — open the school board to set owners, status, and evidence.`
      )
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Framework & activation</h1>
        <p className="text-gray-400 text-sm font-jost mt-1 max-w-2xl">
          Step 1–2: pick a school, activate services from the catalog. Promises then appear on the{' '}
          <strong className="text-[#2D1654]">ledger</strong> (list below) and on the{' '}
          <strong className="text-[#2D1654]">school board</strong> where you manage them day to day.
        </p>
      </div>

      <DeliverySubNav active="/team/delivery/framework" schoolBoardHref={schoolBoardHref} />

      <DeliveryWorkflowSteps current={groupFullyTracked ? 3 : 2} schoolBoardHref={schoolBoardHref} />

      <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
        <p className="font-jost text-[11px] uppercase tracking-[0.2em] text-[#C8A84B]">{FRAMEWORK_INTRO.eyebrow}</p>
        <h2 className="font-cormorant text-2xl text-[#2D1654] mt-1">{FRAMEWORK_INTRO.title}</h2>
        <p className="font-jost text-sm text-gray-600 mt-2 max-w-3xl">{FRAMEWORK_INTRO.summary}</p>
      </div>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <label className="font-jost text-sm text-[#2D1654]">
          School
          <select
            value={schoolId}
            onChange={e => setSchoolId(e.target.value)}
            className="mt-1 block min-w-[16rem] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
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
              className={`rounded-lg px-3 py-2 text-sm font-jost font-medium border ${
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
          <span className="ml-2 text-gray-400">
            ({groupTrackedCount} of {groupServiceCount} services on ledger for this school)
          </span>
        </p>
      )}

      {flash && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-jost text-emerald-900">
          {flash}
          {schoolBoardHref && (
            <Link href={schoolBoardHref} className="ml-2 font-semibold text-[#2D1654] underline">
              Open school board →
            </Link>
          )}
        </div>
      )}

      <section className="mb-8" aria-labelledby="ledger-heading">
        <h2 id="ledger-heading" className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
          Live promise ledger
        </h2>
        {loading ? (
          <p className="font-jost text-sm text-gray-500">Loading promises…</p>
        ) : (
          <DeliveryPromiseLedger
            promises={schoolPromises}
            schoolId={schoolId}
            schoolName={school?.name}
            groupFilter={group}
            emptyMessage={`No Group ${group} promises for ${school?.name ?? 'this school'} yet. Expand a service below and click “Add to ledger” or “Activate full Group ${group}".`}
          />
        )}
      </section>

      {!groupFullyTracked && (
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={activating || demoMode || !services.length}
            onClick={() => {
              const anchor = services[0]
              if (anchor) activateService(anchor, 'group')
            }}
            className="rounded-lg bg-[#C8A84B] px-4 py-2 text-sm font-jost font-semibold text-[#2D1654] hover:bg-[#d4b55c] disabled:opacity-50"
          >
            Activate all {groupServiceCount} Group {group} promises for {school?.name ?? 'school'}
          </button>
        </div>
      )}

      {groupFullyTracked && schoolBoardHref && (
        <div className="mb-6 rounded-lg border border-[#C8A84B]/40 bg-[#F8F4EF] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <p className="font-jost text-sm text-[#2D1654]">
            All Group {group} services are on the ledger. Manage status, owners, and evidence on the school board.
          </p>
          <Link
            href={schoolBoardHref}
            className="rounded-lg bg-[#2D1654] px-4 py-2 text-sm font-jost font-semibold text-white"
          >
            Go to school board →
          </Link>
        </div>
      )}

      <section aria-labelledby="catalog-heading">
        <h2 id="catalog-heading" className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
          Framework catalog — Group {group}
        </h2>
        <p className="font-jost text-xs text-gray-500 mb-4 max-w-2xl">
          Each card is a service from the Partner Services document. When you add it to the ledger, it becomes a
          trackable promise (one row in the table above).
        </p>
        <div className="space-y-3">
          {services.map(service => {
            const open = openId === service.id
            const tracked = promiseByServiceId.get(service.id)
            return (
              <article
                key={service.id}
                className={`rounded-xl border bg-white ${
                  tracked ? 'border-emerald-200/80' : 'border-gray-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenId(open ? null : service.id)}
                  className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-gray-50/80"
                >
                  <span className="font-jost text-xs text-[#C8A84B] tracking-widest shrink-0">
                    {String(service.number).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-cormorant text-xl text-[#2D1654]">{service.name}</h3>
                      {tracked ? (
                        <StatusBadge status={tracked.status} />
                      ) : (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-jost font-semibold uppercase text-gray-500">
                          Not on ledger
                        </span>
                      )}
                    </div>
                    {!open && (
                      <p className="font-jost text-sm text-gray-500 mt-1 line-clamp-2">{service.overview}</p>
                    )}
                  </div>
                </button>
                {open && (
                  <div className="px-5 pb-5 md:pl-16 space-y-4 border-t border-gray-100 pt-4">
                    <p className="font-jost text-sm text-gray-600 leading-relaxed">{service.overview}</p>
                    {service.successCriteria && service.successCriteria.length > 0 && (
                      <div>
                        <p className="font-jost text-[11px] uppercase tracking-wider text-gray-400 mb-2">
                          Success criteria (copied to promise when activated)
                        </p>
                        <ul className="space-y-1">
                          {service.successCriteria.map(c => (
                            <li key={c} className="font-jost text-sm text-gray-600 flex gap-2">
                              <span className="text-[#C8A84B]">·</span>{c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {tracked ? (
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="font-jost text-sm text-gray-600">On ledger as:</span>
                        <StatusBadge status={tracked.status} />
                        {schoolBoardHref && (
                          <Link
                            href={schoolBoardHref}
                            className="text-sm font-jost font-semibold text-[#4C2585] hover:underline"
                          >
                            Manage on school board →
                          </Link>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          disabled={activating}
                          onClick={() => activateService(service, 'single')}
                          className="rounded-lg bg-[#2D1654] px-4 py-2 text-sm font-jost font-semibold text-white hover:bg-[#4C2585] disabled:opacity-50"
                        >
                          Add this service to ledger
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </div>
  )
}
