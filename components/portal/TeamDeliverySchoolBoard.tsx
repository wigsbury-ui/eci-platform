'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import type { Document, School } from '@/lib/types'
import type { PromiseEvidence, PromiseReview, ServicePromise } from '@/lib/delivery/types'
import DeliverySubNav from '@/components/portal/delivery/DeliverySubNav'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import PromiseSidePanel from '@/components/portal/delivery/PromiseSidePanel'
import DeliveryKanbanBoard from '@/components/portal/delivery/DeliveryKanbanBoard'
import { demoEvidence, demoReviews } from '@/lib/delivery/demo'

type ViewMode = 'matrix' | 'kanban'

type Props = {
  school: School
  schools: School[]
  initialPromises: ServicePromise[]
  demoMode?: boolean
}

export default function TeamDeliverySchoolBoard({
  school,
  schools,
  initialPromises,
  demoMode,
}: Props) {
  const [promises, setPromises] = useState(
    initialPromises.filter(p => p.school_id === school.id)
  )
  const [selected, setSelected] = useState<ServicePromise | null>(null)
  const [evidence, setEvidence] = useState<PromiseEvidence[]>([])
  const [reviews, setReviews] = useState<PromiseReview[]>([])
  const [schoolDocuments, setSchoolDocuments] = useState<Document[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('matrix')
  const [groupFilter, setGroupFilter] = useState<number | 'all'>('all')

  const filtered = useMemo(() => {
    if (groupFilter === 'all') return promises
    return promises.filter(p => p.service_group === groupFilter)
  }, [promises, groupFilter])

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => a.service_group - b.service_group || a.title.localeCompare(b.title)),
    [filtered]
  )

  const loadDocuments = useCallback(async () => {
    if (demoMode) return
    const res = await fetch(`/api/team/delivery/documents?schoolId=${encodeURIComponent(school.id)}`)
    const data = await res.json()
    if (data.documents) setSchoolDocuments(data.documents)
  }, [demoMode, school.id])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const openPromise = async (p: ServicePromise) => {
    setSelected(p)
    if (demoMode) {
      setEvidence(demoEvidence(p.id))
      setReviews(demoReviews(p.id))
      return
    }
    const [evRes, revRes] = await Promise.all([
      fetch(`/api/team/delivery/evidence?promiseId=${encodeURIComponent(p.id)}`),
      fetch(`/api/team/delivery/reviews?promiseId=${encodeURIComponent(p.id)}`),
    ])
    const evData = await evRes.json()
    const revData = await revRes.json()
    setEvidence(evData.evidence ?? [])
    setReviews(revData.reviews ?? [])
  }

  const activateGroup = async (group: number) => {
    if (demoMode) return
    const res = await fetch('/api/team/delivery/activate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schoolId: school.id, group }),
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.error ?? 'Could not activate')
      return
    }
    const listRes = await fetch(`/api/team/delivery/promises?schoolId=${school.id}`)
    const listData = await listRes.json()
    if (listData.promises) setPromises(listData.promises)
  }

  const hasGroup = (g: number) => promises.some(p => p.service_group === g)

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/team/delivery" className="font-jost text-xs text-[#4C2585] hover:underline">
            ← Cockpit
          </Link>
          <h1 className="font-cormorant text-4xl text-[#2D1654] mt-2">{school.name}</h1>
          <p className="text-gray-400 text-sm font-jost mt-1">Delivery board · {school.city}, {school.country}</p>
        </div>
        {!demoMode && (
          <div className="flex flex-wrap gap-2">
            {!hasGroup(1) && (
              <button
                type="button"
                onClick={() => activateGroup(1)}
                className="rounded-lg bg-[#C8A84B] px-3 py-2 text-sm font-jost font-semibold text-[#2D1654]"
              >
                Activate Group 1
              </button>
            )}
            {!hasGroup(2) && (
              <button
                type="button"
                onClick={() => activateGroup(2)}
                className="rounded-lg border border-[#6B3DA8] px-3 py-2 text-sm font-jost font-semibold text-[#6B3DA8]"
              >
                Activate Group 2
              </button>
            )}
            {!hasGroup(3) && (
              <button
                type="button"
                onClick={() => activateGroup(3)}
                className="rounded-lg border border-emerald-600 px-3 py-2 text-sm font-jost font-semibold text-emerald-700"
              >
                Activate Group 3
              </button>
            )}
          </div>
        )}
      </div>

      <DeliverySubNav active="/team/delivery" />

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex rounded-lg border border-gray-200 bg-white p-0.5">
          <button
            type="button"
            onClick={() => setViewMode('matrix')}
            className={`rounded-md px-3 py-1.5 text-sm font-jost ${
              viewMode === 'matrix' ? 'bg-[#2D1654] text-white' : 'text-gray-600'
            }`}
          >
            Matrix
          </button>
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`rounded-md px-3 py-1.5 text-sm font-jost ${
              viewMode === 'kanban' ? 'bg-[#2D1654] text-white' : 'text-gray-600'
            }`}
          >
            Kanban
          </button>
        </div>
        <label className="font-jost text-xs text-gray-500">
          Group
          <select
            value={groupFilter === 'all' ? 'all' : String(groupFilter)}
            onChange={e =>
              setGroupFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="ml-2 rounded-lg border border-gray-200 px-2 py-1.5 text-sm"
          >
            <option value="all">All</option>
            <option value="1">Group 1</option>
            <option value="2">Group 2</option>
            <option value="3">Group 3</option>
          </select>
        </label>
      </div>

      {viewMode === 'matrix' ? (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="font-jost text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Group</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Next review</th>
                <th className="px-4 py-3">Evidence</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center font-jost text-sm text-gray-500">
                    No promises in this group. Activate from the framework browser or buttons above.
                  </td>
                </tr>
              )}
              {sorted.map(p => (
                <tr
                  key={p.id}
                  className="border-b border-gray-50 hover:bg-[#F8F4EF]/40 cursor-pointer"
                  onClick={() => openPromise(p)}
                >
                  <td className="px-4 py-3 font-jost text-sm text-[#2D1654]">{p.title}</td>
                  <td className="px-4 py-3 font-jost text-sm text-gray-500">G{p.service_group}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 font-jost text-sm text-gray-600">{p.owner_name ?? '—'}</td>
                  <td className="px-4 py-3 font-jost text-sm text-gray-600">
                    {p.next_review_at ? new Date(p.next_review_at).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3 font-jost text-xs text-gray-400">Open →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <DeliveryKanbanBoard promises={sorted} onSelect={openPromise} />
      )}

      <p className="mt-4 font-jost text-xs text-gray-400">
        Other schools:{' '}
        {schools.filter(s => s.id !== school.id).map(s => (
          <Link key={s.id} href={`/team/delivery/schools/${s.id}`} className="text-[#4C2585] hover:underline mr-2">
            {s.name}
          </Link>
        ))}
      </p>

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelected(null)} aria-hidden />
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
