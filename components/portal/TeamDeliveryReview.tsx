'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { School } from '@/lib/types'
import type { ServicePromise } from '@/lib/delivery/types'
import StatusBadge from '@/components/portal/delivery/StatusBadge'
import { servicesByGroup, type ServiceGroupId } from '@/lib/content/partner-services'
import { ArrowLeft } from 'lucide-react'

type Props = {
  schools: School[]
  initialPromises: ServicePromise[]
  demoMode?: boolean
  initialSchoolId?: string
}

export default function TeamDeliveryReview({
  schools,
  initialPromises,
  demoMode,
  initialSchoolId,
}: Props) {
  const searchParams = useSearchParams()
  const schoolFromUrl = searchParams.get('school')
  const [schoolId, setSchoolId] = useState(
    schoolFromUrl && schools.some(s => s.id === schoolFromUrl)
      ? schoolFromUrl
      : initialSchoolId ?? schools[0]?.id ?? ''
  )
  const [group, setGroup] = useState<ServiceGroupId>(1)
  const [promises, setPromises] = useState(initialPromises)
  const [step, setStep] = useState(0)
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const groupPromises = useMemo(() => {
    return promises
      .filter(p => p.school_id === schoolId && p.service_group === group)
      .sort((a, b) => a.title.localeCompare(b.title))
  }, [promises, schoolId, group])

  const school = schools.find(s => s.id === schoolId)
  const current = groupPromises[step]

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
      if (step >= groupPromises.length - 1) setDone(true)
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
      setPromises(prev =>
        prev.map(p =>
          p.id === current.id ? { ...p, ...data.promise, success_criteria: p.success_criteria } : p
        )
      )
      if (step >= groupPromises.length - 1) setDone(true)
      else setStep(s => s + 1)
    } catch {
      alert('Could not save review step')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <Link
        href={`/team/delivery?school=${encodeURIComponent(schoolId)}`}
        className="inline-flex items-center gap-1 font-jost text-sm text-[#4C2585] hover:underline mb-4"
      >
        <ArrowLeft size={16} />
        Back to {school?.name ?? 'delivery'}
      </Link>

      <div className="mb-6">
        <h1 className="font-cormorant text-4xl text-[#2D1654]">Quarterly review</h1>
        <p className="text-gray-500 text-sm font-jost mt-2 max-w-2xl leading-relaxed">
          Walk through each tracked service for a school, mark whether delivery is on track,
          and set the next review date (defaults to three months ahead).
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <label className="font-jost text-sm text-[#2D1654]">
          School
          <select
            value={schoolId}
            onChange={e => {
              setSchoolId(e.target.value)
              setStep(0)
              setDone(false)
            }}
            className="mt-1 block min-w-[14rem] rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            {schools.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
        <label className="font-jost text-sm text-[#2D1654]">
          Tier
          <select
            value={group}
            onChange={e => {
              setGroup(Number(e.target.value) as ServiceGroupId)
              setStep(0)
              setDone(false)
            }}
            className="mt-1 block rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          >
            <option value={1}>Obligations</option>
            <option value={2}>Core services</option>
            <option value={3}>Premium</option>
          </select>
        </label>
      </div>

      {groupPromises.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-8 text-center">
          <p className="font-jost text-sm text-gray-600">
            No services tracked in this tier for {school?.name}.
          </p>
          <Link
            href={`/team/delivery?school=${encodeURIComponent(schoolId)}&add=1`}
            className="mt-3 inline-block text-sm font-jost font-semibold text-[#4C2585] hover:underline"
          >
            Add services first →
          </Link>
        </div>
      )}

      {done && groupPromises.length > 0 && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 max-w-xl">
          <p className="font-cormorant text-2xl text-emerald-900">Review complete</p>
          <p className="font-jost text-sm text-emerald-800 mt-2">
            You have reviewed all {groupPromises.length} items for {school?.name}.
            Next reviews are set three months out.
          </p>
          <Link
            href={`/team/delivery?school=${encodeURIComponent(schoolId)}`}
            className="mt-4 inline-block rounded-lg bg-[#2D1654] px-4 py-2 text-sm font-jost font-semibold text-white"
          >
            Return to delivery list
          </Link>
        </div>
      )}

      {!done && current && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 max-w-2xl">
          <p className="font-jost text-xs uppercase tracking-[0.2em] text-gray-400">
            Item {step + 1} of {groupPromises.length}
          </p>
          <h2 className="font-cormorant text-3xl text-[#2D1654] mt-2">{current.title}</h2>
          <div className="mt-2">
            <StatusBadge status={current.status} />
          </div>
          {current.promise_text && (
            <p className="font-jost text-sm text-gray-600 mt-4 leading-relaxed">{current.promise_text}</p>
          )}

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
            <span className="font-jost text-xs text-gray-500">Notes for this review</span>
            <textarea
              value={notes[current.id] ?? ''}
              onChange={e => setNotes(prev => ({ ...prev, [current.id]: e.target.value }))}
              rows={3}
              placeholder="What did you check? Any follow-ups?"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-jost"
            />
          </label>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => saveStep('green')}
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-jost font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              On track
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveStep('amber')}
              className="rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-jost font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
            >
              At risk
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => saveStep('red')}
              className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-jost font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              Off track
            </button>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="font-jost text-xs text-gray-400 mb-2">All items in this review</p>
            <ul className="space-y-1">
              {groupPromises.map((p, i) => (
                <li key={p.id} className="font-jost text-sm flex justify-between gap-2">
                  <span className={i === step ? 'text-[#2D1654] font-semibold' : 'text-gray-500'}>
                    {p.title}
                  </span>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
