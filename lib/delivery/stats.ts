import type { School } from '@/lib/types'
import type { SchoolDeliverySummary, ServicePromise, PromiseStatus } from '@/lib/delivery/types'

const GREEN_STATUSES: PromiseStatus[] = ['green', 'over_delivered']

export function isPromiseGreen(status: PromiseStatus) {
  return GREEN_STATUSES.includes(status)
}

export function daysFromToday(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export function isOverdue(promise: ServicePromise) {
  if (!promise.next_review_at || isPromiseGreen(promise.status)) return false
  return promise.next_review_at < todayIso()
}

export function isDueWithinDays(promise: ServicePromise, days: number) {
  if (!promise.next_review_at || isPromiseGreen(promise.status)) return false
  const due = promise.next_review_at
  return due >= todayIso() && due <= daysFromToday(days)
}

export function schoolSummaries(schools: School[], promises: ServicePromise[]): SchoolDeliverySummary[] {
  return schools.map(school => {
    const schoolPromises = promises.filter(p => p.school_id === school.id)
    const group1 = schoolPromises.filter(p => p.service_group === 1)
    const group1Green = group1.filter(p => isPromiseGreen(p.status)).length
    const overdueCount = schoolPromises.filter(isOverdue).length
    const lastReview = schoolPromises
      .map(p => p.last_reviewed_at)
      .filter(Boolean)
      .sort()
      .pop() ?? null

    return {
      schoolId: school.id,
      schoolName: school.name,
      group1Total: group1.length,
      group1Green,
      overdueCount,
      lastReviewDate: lastReview,
    }
  })
}

export function group1Wall(promises: ServicePromise[]) {
  return promises.filter(p => p.service_group === 1 && !isPromiseGreen(p.status))
}

export function deliveryWins(promises: ServicePromise[]) {
  return promises.filter(p => p.status === 'over_delivered' || p.status === 'green')
}

export function quarterFocus(promises: ServicePromise[]) {
  return promises.filter(
    p =>
      isOverdue(p) ||
      isDueWithinDays(p, 30) ||
      p.status === 'pending_verification'
  )
}
