import { createAdminClient } from '@/lib/supabase/admin'
import type { PromiseEvidence, PromiseReview, ServicePromise } from '@/lib/delivery/types'

function mapPromise(row: Record<string, unknown>): ServicePromise {
  const criteria = row.success_criteria
  return {
    id: String(row.id),
    school_id: String(row.school_id),
    service_id: String(row.service_id),
    service_group: Number(row.service_group),
    title: String(row.title),
    promise_text: (row.promise_text as string | null) ?? null,
    success_criteria: Array.isArray(criteria) ? (criteria as string[]) : [],
    status: row.status as ServicePromise['status'],
    owner_profile_id: (row.owner_profile_id as string | null) ?? null,
    owner_name: (row.owner_name as string | null) ?? null,
    next_review_at: (row.next_review_at as string | null) ?? null,
    last_reviewed_at: (row.last_reviewed_at as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  }
}

export async function listServicePromises(schoolId?: string): Promise<ServicePromise[]> {
  const admin = createAdminClient()
  if (!admin) return []

  let query = admin.from('service_promises').select('*').order('service_group').order('title')
  if (schoolId) query = query.eq('school_id', schoolId)

  const { data, error } = await query
  if (error || !data) return []
  return data.map(row => mapPromise(row as Record<string, unknown>))
}

export async function listPromiseEvidence(promiseId: string): Promise<PromiseEvidence[]> {
  const admin = createAdminClient()
  if (!admin) return []

  const { data } = await admin
    .from('promise_evidence')
    .select('*, documents(title, file_url)')
    .eq('promise_id', promiseId)
    .order('created_at', { ascending: false })

  return (data ?? []).map(row => {
    const doc = row.documents as { title?: string; file_url?: string | null } | null
    return {
      id: String(row.id),
      promise_id: String(row.promise_id),
      title: String(row.title),
      url: (row.url as string | null) ?? null,
      document_id: (row.document_id as string | null) ?? null,
      document_title: doc?.title ?? null,
      document_file_url: doc?.file_url ?? null,
      added_by: (row.added_by as string | null) ?? null,
      created_at: String(row.created_at),
    }
  })
}

export async function listPromiseReviews(promiseId: string): Promise<PromiseReview[]> {
  const admin = createAdminClient()
  if (!admin) return []

  const { data } = await admin
    .from('promise_reviews')
    .select('*')
    .eq('promise_id', promiseId)
    .order('reviewed_at', { ascending: false })

  return (data ?? []).map(row => ({
    id: String(row.id),
    promise_id: String(row.promise_id),
    reviewed_at: String(row.reviewed_at),
    reviewed_by: (row.reviewed_by as string | null) ?? null,
    previous_status: (row.previous_status as string | null) ?? null,
    new_status: String(row.new_status),
    notes: (row.notes as string | null) ?? null,
  }))
}

export async function insertGroupPromises(
  rows: Omit<
    ServicePromise,
    'id' | 'created_at' | 'updated_at' | 'last_reviewed_at' | 'owner_profile_id' | 'notes'
  >[]
) {
  const admin = createAdminClient()
  if (!admin) return { error: 'Admin client unavailable' }

  const { error } = await admin.from('service_promises').upsert(
    rows.map(row => ({
      school_id: row.school_id,
      service_id: row.service_id,
      service_group: row.service_group,
      title: row.title,
      promise_text: row.promise_text,
      success_criteria: row.success_criteria,
      status: row.status,
      owner_name: row.owner_name,
      next_review_at: row.next_review_at,
    })),
    { onConflict: 'school_id,service_id', ignoreDuplicates: true }
  )

  if (error?.code === '42P01') {
    return { error: 'Run migration 010_partner_delivery.sql in Supabase.' }
  }
  return { error: error?.message ?? null }
}

export async function insertPromiseEvidence(input: {
  promise_id: string
  title: string
  url?: string | null
  document_id?: string | null
  added_by?: string | null
}) {
  const admin = createAdminClient()
  if (!admin) return { error: 'Admin client unavailable', evidence: null }

  const { data, error } = await admin
    .from('promise_evidence')
    .insert({
      promise_id: input.promise_id,
      title: input.title,
      url: input.url ?? null,
      document_id: input.document_id ?? null,
      added_by: input.added_by ?? null,
    })
    .select('*, documents(title, file_url)')
    .single()

  if (error) return { error: error.message, evidence: null }

  const doc = data.documents as { title?: string; file_url?: string | null } | null
  return {
    error: null,
    evidence: {
      id: String(data.id),
      promise_id: String(data.promise_id),
      title: String(data.title),
      url: (data.url as string | null) ?? null,
      document_id: (data.document_id as string | null) ?? null,
      document_title: doc?.title ?? null,
      document_file_url: doc?.file_url ?? null,
      added_by: (data.added_by as string | null) ?? null,
      created_at: String(data.created_at),
    },
  }
}

export async function deletePromiseEvidence(id: string) {
  const admin = createAdminClient()
  if (!admin) return { error: 'Admin client unavailable' }

  const { error } = await admin.from('promise_evidence').delete().eq('id', id)
  return { error: error?.message ?? null }
}
