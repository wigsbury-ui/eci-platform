export type PromiseStatus =
  | 'green'
  | 'amber'
  | 'red'
  | 'pending_verification'
  | 'over_delivered'

export const PROMISE_STATUSES: PromiseStatus[] = [
  'green',
  'amber',
  'red',
  'pending_verification',
  'over_delivered',
]

export const PROMISE_STATUS_LABELS: Record<PromiseStatus, string> = {
  green: 'Green',
  amber: 'Amber',
  red: 'Red',
  pending_verification: 'Awaiting verification',
  over_delivered: 'Over-delivered',
}

export interface ServicePromise {
  id: string
  school_id: string
  service_id: string
  service_group: number
  title: string
  promise_text: string | null
  success_criteria: string[]
  status: PromiseStatus
  owner_profile_id: string | null
  owner_name: string | null
  next_review_at: string | null
  last_reviewed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface PromiseEvidence {
  id: string
  promise_id: string
  title: string
  url: string | null
  document_id: string | null
  document_title?: string | null
  document_file_url?: string | null
  added_by: string | null
  created_at: string
}

export interface PromiseReview {
  id: string
  promise_id: string
  reviewed_at: string
  reviewed_by: string | null
  previous_status: string | null
  new_status: string
  notes: string | null
}

export const KANBAN_COLUMNS: PromiseStatus[] = [
  'red',
  'amber',
  'pending_verification',
  'green',
  'over_delivered',
]

export interface SchoolDeliverySummary {
  schoolId: string
  schoolName: string
  group1Total: number
  group1Green: number
  overdueCount: number
  lastReviewDate: string | null
}
