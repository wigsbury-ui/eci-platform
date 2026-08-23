'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { Document, School } from '@/lib/types'
import type {
  DeliveryNotification,
  PromiseEvidence,
  PromiseReview,
  ServicePromise,
} from '@/lib/delivery/types'
import { SERVICE_GROUPS, type PartnerService } from '@/lib/content/partner-services'
import { isPromiseGreen, isOverdue, schoolSummaries } from '@/lib/delivery/stats'
import DeliveryCommitmentCard from '@/components/portal/delivery/DeliveryCommitmentCard'
import DeliveryServicePicker from '@/components/portal/delivery/DeliveryServicePicker'
import PromiseSidePanel from '@/components/portal/delivery/PromiseSidePanel'
import DeliveryNotificationsBanner from '@/components/portal/delivery/DeliveryNotificationsBanner'
import { demoEvidence, demoReviews } from '@/lib/delivery/demo'
import { AlertCircle, LayoutGrid, Plus } from 'lucide-react'

type View = 'school' | 'network'
type GroupFilter = number | 'all'

type Props = {
  schools: School[]
  initialPromises: ServicePromise[]
  initialNotifications?: DeliveryNotification[]
  demoMode?: boolean
  initialSchoolId?: string
  initialShowPicker?: boolean
}

function attentionScore(p: ServicePromise) {
  if (p.status === 'red') return 0
  if (p.status === 'amber') return 1
  if (p.status === 'pending_verification') return 2
  if (isOverdue(p)) return 3
  return 4
}

export default function TeamDeliveryHub({
  schools,
  initialPromises,
  initialNotifications = [],
  demoMode,
  initialSchoolId,
  initialShowPicker,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const defaultSchoolId = initialSchoolId ?? schools[0]?.id ?? ''
  const [view, setView] = useState<View>(
    searchParams.get('view') === 'network' ? 'network' : 'school'
  )
  const [schoolId, setSchoolId] = useState(
    searchParams.get('school') ?? defaultSchoolId
  )
  const [groupFilter, setGroupFilter] = useState<GroupFilter>('all')
  const [promises, setPromises] = useState(initialPromises)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [pickerOpen, setPickerOpen] = useState(initialShowPicker ?? false)
  const [activating, setActivating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusSavingId, setStatusSavingId] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const [selected, setSelected] = useState<ServicePromise | null>(null)
  const [evidence, setEvidence] = useState<PromiseEvidence[]>([])
  const [reviews, setReviews] = useState<PromiseReview[]>([])
  const [schoolDocuments, setSchoolDocuments] = useState<Document[]>([])

  const school = schools.find(s => s.id === schoolId)
  const schoolPromises = useMemo(
    () => promises.filter(p => p.school_id === schoolId),
    [promises, schoolId]
  )
  const trackedServiceIds = useMemo(
    () => new Set(schoolPromises.map(p => p.service_id)),
    [schoolPromises]
  )

  const filteredPromises = useMemo(() => {
    let list = schoolPromises
    if (groupFilter !== 'all') list = list.filter(p => p.service_group === groupFilter)
    return [...list].sort(
      (a, b) => attentionScore(a) - attentionScore(b) || a.title.localeCompare(b.title)
    )
  }, [schoolPromises, groupFilter])

  const attentionList = useMemo(
    () =>
      schoolPromises
        .filter(p => !isPromiseGreen(p.status) || isOverdue(p))
        .sort((a, b) => attentionScore(a) - attentionScore(b)),
    [schoolPromises]
  )

  const counts = useMemo(() => {
    const c = { onTrack: 0, atRisk: 0, offTrack: 0, needsCheck: 0, ahead: 0 }
    schoolPromises.forEach(p => {
      if (p.status === 'green') c.onTrack++
      else if (p.status === 'amber') c.atRisk++
      else if (p.status === 'red') c.offTrack++
      else if (p.status === 'pending_verification') c.needsCheck++
      else if (p.status === 'over_delivered') c.ahead++
    })
    return c
  }, [schoolPromises])

  const groupCounts = useMemo(() => {
    const map: Record<number, number> = { 1: 0, 2: 0, 3: 0 }
    schoolPromises.forEach(p => {
      map[p.service_group] = (map[p.service_group] ?? 0) + 1
    })
    return map
  }, [schoolPromises])

  const networkSummaries = useMemo(
    () => schoolSummaries(schools, promises),
    [schools, promises]
  )

  const networkAttention = useMemo(() => {
    return promises
      .filter(p => !isPromiseGreen(p.status) || isOverdue(p))
      .sort((a, b) => attentionScore(a) - attentionScore(b))
      .slice(0, 12)
  }, [promises])

  const loadPromises = useCallback(async (id: string) => {
    if (demoMode) return
    setLoading(true)
    try {
      const res = await fetch(`/api/team/delivery/promises?schoolId=${encodeURIComponent(id)}`)
      const data = await res.json()
      if (data.promises) {
        setPromises(prev => {
          const others = prev.filter(p => p.school_id !== id)
          return [...others, ...data.promises]
        })
      }
    } finally {
      setLoading(false)
    }
  }, [demoMode])

  useEffect(() => {
    if (schoolId && !demoMode) loadPromises(schoolId)
  }, [schoolId, demoMode, loadPromises])

  const syncUrl = (nextSchool: string, nextView: View) => {
    const params = new URLSearchParams()
    if (nextView === 'network') params.set('view', 'network')
    else if (nextSchool) params.set('school', nextSchool)
    const q = params.toString()
    router.replace(q ? `/team/delivery?${q}` : '/team/delivery', { scroll: false })
  }

  const selectSchool = (id: string) => {
    setView('school')
    setSchoolId(id)
    setGroupFilter('all')
    syncUrl(id, 'school')
  }

  const selectNetwork = () => {
    setView('network')
    syncUrl('', 'network')
  }

  const activate = async (body: { schoolId: string; group?: number; serviceId?: string }) => {
    if (demoMode) {
      setFlash('Demo mode — connect the database to save tracking data.')
      return
    }
    setActivating(true)
    setFlash(null)
    const res = await fetch('/api/team/delivery/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setActivating(false)
    if (!res.ok) {
      setFlash(data.error ?? 'Could not add services')
      return
    }
    await loadPromises(body.schoolId)
    if (body.group) {
      setFlash(`Added ${data.activated} services. They appear in your list below.`)
    } else {
      setFlash('Service added to your tracking list.')
    }
    setPickerOpen(false)
  }

  const changeStatus = async (promiseId: string, status: ServicePromise['status']) => {
    setStatusSavingId(promiseId)
    if (demoMode) {
      setPromises(prev =>
        prev.map(p =>
          p.id === promiseId
            ? { ...p, status, updated_at: new Date().toISOString() }
            : p
        )
      )
      setStatusSavingId(null)
      return
    }
    const res = await fetch('/api/team/delivery/promises', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: promiseId, status }),
    })
    const data = await res.json()
    setStatusSavingId(null)
    if (!res.ok) {
      setFlash(data.error ?? 'Could not update status')
      return
    }
    setPromises(prev =>
      prev.map(p =>
        p.id === promiseId ? { ...p, ...data.promise, success_criteria: p.success_criteria } : p
      )
    )
    if (selected?.id === promiseId) {
      setSelected(prev => (prev ? { ...prev, ...data.promise, success_criteria: prev.success_criteria } : null))
    }
  }

  const openPromise = async (p: ServicePromise) => {
    setSelected(p)
    if (demoMode) {
      setEvidence(demoEvidence(p.id))
      setReviews(demoReviews(p.id))
      return
    }
    const [evRes, revRes, docRes] = await Promise.all([
      fetch(`/api/team/delivery/evidence?promiseId=${encodeURIComponent(p.id)}`),
      fetch(`/api/team/delivery/reviews?promiseId=${encodeURIComponent(p.id)}`),
      fetch(`/api/team/delivery/documents?schoolId=${encodeURIComponent(p.school_id)}`),
    ])
    const evData = await evRes.json()
    const revData = await revRes.json()
    const docData = await docRes.json()
    setEvidence(evData.evidence ?? [])
    setReviews(revData.reviews ?? [])
    setSchoolDocuments(docData.documents ?? [])
  }

  const groupLabel = (g: number) => {
    const meta = SERVICE_GROUPS.find(sg => sg.id === g)
    return meta?.title ?? `Group ${g}`
  }

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Partner delivery</h1>
        <p className="font-jost text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
          Track what ECI delivers to each partner school — who owns it, whether it is on track,
          and the evidence behind it. Pick a school to work; use network overview to spot problems
          across campuses.
        </p>
        {demoMode && (
          <p className="mt-2 font-jost text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 max-w-2xl">
            Showing sample data. Run database migration 010 and add services to save real tracking data.
          </p>
        )}
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={selectNetwork}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-jost font-semibold border transition-colors ${
            view === 'network'
              ? 'border-[#2D1654] bg-[#2D1654] text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <LayoutGrid size={16} />
          Network overview
        </button>
        {schools.map(s => {
          const summary = networkSummaries.find(ns => ns.schoolId === s.id)
          const needsAttention = summary && summary.overdueCount > 0
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => selectSchool(s.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-jost font-semibold border transition-colors ${
                view === 'school' && schoolId === s.id
                  ? 'border-[#2D1654] bg-[#2D1654] text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              {s.city || s.name.split(' ').pop()}
              {needsAttention && view !== 'school' && (
                <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-amber-400" aria-label="Needs attention" />
              )}
            </button>
          )
        })}
      </div>

      <DeliveryNotificationsBanner
        notifications={notifications}
        onMarkRead={id =>
          setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
          )
        }
      />

      {flash && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-jost text-emerald-900">
          {flash}
        </div>
      )}

      {view === 'network' ? (
        <div className="space-y-6">
          <section>
            <h2 className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">
              Schools at a glance
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {networkSummaries.map(s => {
                const pct = s.group1Total
                  ? Math.round((s.group1Green / s.group1Total) * 100)
                  : null
                return (
                  <button
                    key={s.schoolId}
                    type="button"
                    onClick={() => selectSchool(s.schoolId)}
                    className="rounded-xl border border-gray-200 bg-white p-4 text-left hover:border-[#C8A84B]/50 hover:shadow-sm transition-all"
                  >
                    <p className="font-jost font-semibold text-[#2D1654]">{s.schoolName}</p>
                    <p className="mt-2 font-jost text-2xl font-semibold text-[#4C2585]">
                      {pct !== null ? `${pct}%` : '—'}
                    </p>
                    <p className="font-jost text-xs text-gray-500">obligations on track</p>
                    <p className="mt-2 font-jost text-xs text-gray-500">
                      {s.group1Total} tracked · {s.overdueCount} overdue
                    </p>
                  </button>
                )
              })}
            </div>
          </section>

          {networkAttention.length > 0 && (
            <section className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-5">
              <h2 className="font-jost text-sm font-semibold text-amber-900 flex items-center gap-2">
                <AlertCircle size={18} />
                Needs attention across the network
              </h2>
              <ul className="mt-3 space-y-2">
                {networkAttention.map(p => {
                  const sch = schools.find(s => s.id === p.school_id)
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => {
                          selectSchool(p.school_id)
                          openPromise(p)
                        }}
                        className="w-full rounded-lg bg-white border border-amber-100 px-3 py-2 text-left hover:border-amber-200"
                      >
                        <p className="font-jost text-sm font-medium text-[#2D1654]">{p.title}</p>
                        <p className="font-jost text-xs text-gray-500">{sch?.name}</p>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </div>
      ) : school ? (
        <div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 mb-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-cormorant text-3xl text-[#2D1654]">{school.name}</h2>
                <p className="font-jost text-sm text-gray-500 mt-1">
                  {schoolPromises.length === 0
                    ? 'No services tracked yet'
                    : `${schoolPromises.length} service${schoolPromises.length === 1 ? '' : 's'} being tracked`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="flex items-center gap-2 rounded-lg bg-[#2D1654] px-4 py-2 text-sm font-jost font-semibold text-white hover:bg-[#4C2585]"
                >
                  <Plus size={16} />
                  Add services
                </button>
                {schoolPromises.length > 0 && (
                  <Link
                    href={`/team/delivery/review?school=${schoolId}`}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-jost font-semibold text-[#2D1654] hover:bg-gray-50"
                  >
                    Run quarterly review
                  </Link>
                )}
              </div>
            </div>

            {schoolPromises.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3 font-jost text-sm">
                <span className="rounded-full bg-emerald-50 text-emerald-800 px-3 py-1 border border-emerald-100">
                  {counts.onTrack + counts.ahead} on track
                </span>
                {counts.atRisk > 0 && (
                  <span className="rounded-full bg-amber-50 text-amber-900 px-3 py-1 border border-amber-100">
                    {counts.atRisk} at risk
                  </span>
                )}
                {counts.offTrack > 0 && (
                  <span className="rounded-full bg-red-50 text-red-800 px-3 py-1 border border-red-100">
                    {counts.offTrack} off track
                  </span>
                )}
                {counts.needsCheck > 0 && (
                  <span className="rounded-full bg-violet-50 text-violet-800 px-3 py-1 border border-violet-100">
                    {counts.needsCheck} need check
                  </span>
                )}
              </div>
            )}
          </div>

          {schoolPromises.length === 0 && !loading && (
            <div className="rounded-2xl border-2 border-dashed border-[#C8A84B]/60 bg-[#F8F4EF]/40 p-8 text-center mb-6">
              <h3 className="font-cormorant text-2xl text-[#2D1654]">Set up delivery tracking</h3>
              <p className="font-jost text-sm text-gray-600 mt-2 max-w-md mx-auto leading-relaxed">
                Start with the six obligation commitments every ECI partner must meet.
                You can add core and premium services later.
              </p>
              <button
                type="button"
                disabled={activating}
                onClick={() => activate({ schoolId, group: 1 })}
                className="mt-5 rounded-xl bg-[#C8A84B] px-6 py-3 text-sm font-jost font-bold text-[#2D1654] hover:bg-[#d4b55c] disabled:opacity-50"
              >
                Add 6 obligation commitments
              </button>
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="mt-3 block mx-auto text-sm font-jost text-[#4C2585] hover:underline"
              >
                Or pick individual services from the catalog
              </button>
            </div>
          )}

          {schoolPromises.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                <FilterPill
                  active={groupFilter === 'all'}
                  onClick={() => setGroupFilter('all')}
                  label={`All (${schoolPromises.length})`}
                />
                {SERVICE_GROUPS.map(g => (
                  <FilterPill
                    key={g.id}
                    active={groupFilter === g.id}
                    onClick={() => setGroupFilter(g.id)}
                    label={`${g.id === 1 ? 'Obligations' : g.id === 2 ? 'Core' : 'Premium'} (${groupCounts[g.id] ?? 0})`}
                  />
                ))}
              </div>

              {attentionList.length > 0 && groupFilter === 'all' && (
                <section className="mb-6 rounded-xl border border-amber-200/70 bg-amber-50/40 p-4">
                  <h3 className="font-jost text-sm font-semibold text-amber-900">
                    Needs attention ({attentionList.length})
                  </h3>
                  <p className="font-jost text-xs text-amber-800/80 mt-0.5">
                    Tap a status button to update, or open details for evidence and notes.
                  </p>
                </section>
              )}

              {loading ? (
                <p className="font-jost text-sm text-gray-500">Loading…</p>
              ) : filteredPromises.length === 0 ? (
                <p className="font-jost text-sm text-gray-500">
                  No services in this tier yet.{' '}
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="text-[#4C2585] font-semibold hover:underline"
                  >
                    Add from catalog
                  </button>
                </p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredPromises.map(p => (
                    <DeliveryCommitmentCard
                      key={p.id}
                      promise={p}
                      groupLabel={groupFilter === 'all' ? groupLabel(p.service_group) : undefined}
                      onOpen={() => openPromise(p)}
                      onStatusChange={status => changeStatus(p.id, status)}
                      statusSaving={statusSavingId === p.id}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <p className="font-jost text-sm text-gray-500">No schools available.</p>
      )}

      <DeliveryServicePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        schoolName={school?.name ?? 'School'}
        trackedServiceIds={trackedServiceIds}
        activating={activating}
        onActivateGroup={group => activate({ schoolId, group })}
        onActivateService={(service: PartnerService) =>
          activate({ schoolId, serviceId: service.id })
        }
      />

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/25" onClick={() => setSelected(null)} aria-hidden />
          <PromiseSidePanel
            promise={selected}
            evidence={evidence}
            reviews={reviews}
            schoolDocuments={schoolDocuments}
            onClose={() => setSelected(null)}
            demoMode={demoMode}
            onUpdated={updated => {
              setPromises(prev => prev.map(p => (p.id === updated.id ? updated : p)))
              setSelected(updated)
            }}
            onEvidenceChange={setEvidence}
          />
        </>
      )}
    </div>
  )
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm font-jost font-medium border transition-colors ${
        active
          ? 'border-[#2D1654] bg-[#2D1654] text-white'
          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  )
}
