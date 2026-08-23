'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DeliveryNotification, PromiseEvidence, ServicePromise } from '@/lib/delivery/types'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import PromiseSidePanel from '@/components/portal/delivery/PromiseSidePanel'
import DeliveryKanbanBoard from '@/components/portal/delivery/DeliveryKanbanBoard'
import DeliveryNotificationsBanner from '@/components/portal/delivery/DeliveryNotificationsBanner'
import { demoEvidence, demoPromisesForSchool } from '@/lib/delivery/demo'

type Props = {
  schoolId: string
  schoolName: string
  initialPromises?: ServicePromise[]
  demoMode?: boolean
}

export default function SchoolDeliveryView({
  schoolId,
  schoolName,
  initialPromises,
  demoMode,
}: Props) {
  const [promises, setPromises] = useState<ServicePromise[]>(initialPromises ?? [])
  const [selected, setSelected] = useState<ServicePromise | null>(null)
  const [evidence, setEvidence] = useState<PromiseEvidence[]>([])
  const [notifications, setNotifications] = useState<DeliveryNotification[]>([])
  const [viewMode, setViewMode] = useState<'matrix' | 'kanban'>('matrix')
  const [loading, setLoading] = useState(!initialPromises?.length && !demoMode)

  const loadPromises = useCallback(async () => {
    if (demoMode) {
      setPromises(demoPromisesForSchool(schoolId, schoolName))
      setLoading(false)
      return
    }
    setLoading(true)
    const [promRes, notifRes] = await Promise.all([
      fetch(`/api/school/delivery/promises?schoolId=${encodeURIComponent(schoolId)}`),
      fetch(`/api/school/delivery/notifications?schoolId=${encodeURIComponent(schoolId)}`),
    ])
    const promData = await promRes.json()
    const notifData = await notifRes.json()
    if (promData.promises) setPromises(promData.promises)
    if (notifData.notifications) setNotifications(notifData.notifications)
    setLoading(false)
  }, [demoMode, schoolId, schoolName])

  useEffect(() => {
    if (!initialPromises?.length) loadPromises()
  }, [initialPromises, loadPromises])

  const sorted = useMemo(
    () => [...promises].sort((a, b) => a.service_group - b.service_group || a.title.localeCompare(b.title)),
    [promises]
  )

  const openPromise = async (p: ServicePromise) => {
    setSelected(p)
    if (demoMode) {
      setEvidence(demoEvidence(p.id))
      return
    }
    const evRes = await fetch(`/api/school/delivery/evidence?promiseId=${encodeURIComponent(p.id)}`)
    const evData = await evRes.json()
    setEvidence(evData.evidence ?? [])
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Partnership delivery</h1>
        <p className="text-gray-400 text-sm font-jost mt-1 max-w-2xl">
          Read-only view of ECI service commitments for {schoolName} — status, owners, and linked evidence.
        </p>
      </div>

      <DeliveryNotificationsBanner
        notifications={notifications}
        apiBase="/api/school/delivery"
        onMarkRead={id =>
          setNotifications(prev =>
            prev.map(n => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
          )
        }
      />

      <div className="flex rounded-lg border border-gray-200 bg-white p-0.5 mb-4">
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

      {loading && <p className="font-jost text-sm text-gray-500">Loading delivery ledger…</p>}

      {!loading && sorted.length === 0 && (
        <p className="font-jost text-sm text-gray-500">
          No active service promises for your campus yet. ECI will activate these as your partnership matures.
        </p>
      )}

      {!loading && sorted.length > 0 && viewMode === 'matrix' && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="font-jost text-[11px] uppercase tracking-wider text-gray-400">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Group</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Next review</th>
              </tr>
            </thead>
            <tbody>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && sorted.length > 0 && viewMode === 'kanban' && (
        <DeliveryKanbanBoard promises={sorted} onSelect={openPromise} readOnly />
      )}

      {selected && (
        <>
          <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setSelected(null)} aria-hidden />
          <PromiseSidePanel
            promise={selected}
            evidence={evidence}
            reviews={[]}
            onClose={() => setSelected(null)}
            readOnly
            demoMode={demoMode}
            evidenceApiBase="/api/school/delivery"
          />
        </>
      )}
    </div>
  )
}
