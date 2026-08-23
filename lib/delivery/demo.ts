import { group1PromiseRows } from '@/lib/delivery/activate'
import type { PromiseEvidence, PromiseReview, ServicePromise } from '@/lib/delivery/types'

function isoDaysAgo(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

function dateDaysFromNow(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

/** Demo ledger for preview / local dev when Supabase tables are empty. */
export function demoPromisesForSchool(schoolId: string, schoolName: string): ServicePromise[] {
  const base = group1PromiseRows(schoolId)
  const statuses: ServicePromise['status'][] = [
    'green',
    'green',
    'amber',
    'pending_verification',
    'red',
    'green',
  ]
  const owners = ['Sarah Mitchell', 'James Okonkwo', 'Sarah Mitchell', 'Unassigned', 'James Okonkwo', 'Sarah Mitchell']

  return base.map((row, i) => ({
    ...row,
    id: `demo-${schoolId}-${row.service_id}`,
    status: statuses[i] ?? 'pending_verification',
    owner_name: owners[i],
    owner_profile_id: null,
    next_review_at:
      i === 2 ? dateDaysFromNow(12) : i === 4 ? dateDaysFromNow(-8) : dateDaysFromNow(45 + i * 7),
    last_reviewed_at: i < 3 ? isoDaysAgo(14 + i * 3) : null,
    notes: i === 4 ? 'Brand audit findings outstanding — escalate at next UK visit.' : null,
    created_at: isoDaysAgo(90),
    updated_at: isoDaysAgo(i),
    promise_text: row.promise_text?.replace('Ellesmere', schoolName.split(' ')[0] ?? 'Partner') ?? null,
  }))
}

export function demoPromises(schools: { id: string; name: string }[]): ServicePromise[] {
  return schools.flatMap(s => demoPromisesForSchool(s.id, s.name))
}

export function demoEvidence(promiseId: string): PromiseEvidence[] {
  if (!promiseId.includes('brand-marketing')) return []
  return [
    {
      id: `ev-${promiseId}-1`,
      promise_id: promiseId,
      title: 'Q2 brand compliance checklist',
      url: null,
      document_id: null,
      added_by: null,
      created_at: isoDaysAgo(20),
    },
  ]
}

export function demoReviews(promiseId: string): PromiseReview[] {
  return [
    {
      id: `rev-${promiseId}-1`,
      promise_id: promiseId,
      reviewed_at: isoDaysAgo(30),
      reviewed_by: null,
      previous_status: 'pending_verification',
      new_status: 'green',
      notes: 'Verified against framework success criteria.',
    },
  ]
}
