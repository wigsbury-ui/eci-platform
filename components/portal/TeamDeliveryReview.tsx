'use client'

import { useMemo, useState } from 'react'
import type { School } from '@/lib/types'
import type { ServicePromise } from '@/lib/delivery/types'
import DeliverySubNav from '@/components/portal/delivery/DeliverySubNav'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import { servicesByGroup } from '@/lib/content/partner-services'

type Props = {
  schools: School[]
  initialPromises: ServicePromise[]
  demoMode?: boolean
}

export default function TeamDeliveryReview({ schools, initialPromises, demoMode }: Props) {
  const [schoolId, setSchoolId] = useState(schools[0]?.id ?? '')
  const [promises, setPromises] = useState(initialPromises)
  const [step, setStep] = useState(0)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const group1 = useMemo(() => {
    return promises
      .filter(p => p.school_id === schoolId && p.service_group === 1)
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [promises, schoolId])

  const school = schools.find(s => s.id === schoolId)
  const current = group1[step]
  const frameworkNames = new Map(servicesByGroup(1).map(s => [s.id, s.name]))

  const saveStep = async (status: ServicePromise['status']) => {
    if (!current) return
    setSaving(true)
    const nextReview = new Date()
    nextReview.setMonth(nextReview.getMonth() + 3)
    const nextReviewStr = nextReview.toISOString().slice(0, 10)

    if (demoMode) {
      setPromises(prev =>
        prev.map(p =>
          p.id === current.id
            ? {
                ...p,
                status,
                notes: notes[current.id] ?? p.notes,
                next_review_at: nextReviewStr,
                last_reviewed_at: new Date().toISOString(),
              }
            : p
        )
      )
      setSaving(false)
      if (step >= group1.length - 1) setDone(true)
      else setStep(s => s + 1)
      return
    }

    try {
      const res = await fetch('/api/team/delivery/promises', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: current.id,
          status,
          notes: notes[current.id] ?? null,
          next_review_at: nextReviewStr,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setPromises(prev => prev.map(p => (p.id === current.id ? { ...p, ...data.promise, success_criteria: p.success_criteria } : p)))
      if (step >= group1.length - 1) setDone(true)
      else setStep(s => s + 1)
    } catch {
      alert('Could not save review step')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Quarterly review</h1>
        <p className="text-gray-400 text-sm font-jost mt-1 max-w-2xl">
          Guided Group 1 walkthrough — verify promises, mark risk, set the next review date.
        </p>
      </div>

      <DeliverySubNav active="/team/delivery/review" />

      <div className="mb-6">
        <label className="font-jost text-xs text-gray-500">
          School
          <select
            value={schoolId}
            onChange={e => {
              setSchoolId(e.target.value)
              setStep(0)
              setDone(false)
            }}
            className="ml-2 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>

      {group1.length === 0 && (
        <p className="font-jost text-sm text-gray-500">
          No Group 1 promises for {school?.name}. Activate from the{' '}
          <a href="/team/delivery/framework" className="text-[#4C2585] hover:underline">framework browser</a>.
        </p>
      )}

      {done && group1.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="font-cormorant text-2xl text-emerald-900">Review complete</p>
          <p className="font-jost text-sm text-emerald-800 mt-2">
            Group 1 for {school?.name} has been walked through. Next reviews default to three months out.
          </p>
        </div>
      )}

      {!done && current && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 max-w-2xl">
          <p className="font-jost text-xs uppercase tracking-[0.2em] text-gray-400">
            Step {step + 1} of {group1.length}
          </p>
          <h2 className="font-cormorant text-3xl text-[#2D1654] mt-2">{current.title}</h2>
          <div className="mt-2">
            <StatusBadge status={current.status} />
          </div>
          <p className="font-jost text-sm text-gray-600 mt-4 leading-relaxed">{current.promise_text}</p>

          {current.success_criteria.length > 0 && (
            <ul className="mt-4 space-y-1">
              {current.success_criteria.map(c => (
                <li key={c} className="font-jost text-sm text-gray-600 flex gap-2">
                  <span className="text-[#C8A84B]">·</span>{c}
                </li>
              ))}
            </ul>
          )}

          <label className="block mt-5">
            <span className="font-jost text-xs text-gray-500">Review notes</span>
            <textarea
              value={notes[current.id] ?? ''}
              onChange={e => setNotes(prev => ({ ...prev, [current.id]: e.target.value }))}
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => saveStep('green')}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-jost font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Verified
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveStep('amber')}
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-jost font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              At risk
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveStep('red')}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-jost font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              Off track
            </button>
          </div>

          <details className="mt-6">
            <summary className="font-jost text-xs text-gray-400 cursor-pointer">All Group 1 items</summary>
            <ul className="mt-2 space-y-1">
              {group1.map((p, i) => (
                <li key={p.id} className="font-jost text-sm flex justify-between gap-2">
                  <span className={i === step ? 'text-[#2D1654] font-semibold' : 'text-gray-500'}>
                    {frameworkNames.get(p.service_id) ?? p.title}
                  </span>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  )
}
