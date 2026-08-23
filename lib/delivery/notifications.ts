import { createAdminClient } from '@/lib/supabase/admin'
import type { DeliveryNotification, DeliveryNotificationKind } from '@/lib/delivery/types'

function mapNotification(row: Record<string, unknown>): DeliveryNotification {
  return {
    id: String(row.id),
    school_id: String(row.school_id),
    promise_id: (row.promise_id as string | null) ?? null,
    audience: row.audience as DeliveryNotification['audience'],
    kind: row.kind as DeliveryNotificationKind,
    title: String(row.title),
    body: String(row.body),
    metadata:
      row.metadata && typeof row.metadata === 'object'
        ? (row.metadata as Record<string, unknown>)
        : {},
    read_at: (row.read_at as string | null) ?? null,
    created_at: String(row.created_at),
  }
}

export async function createDeliveryNotification(input: {
  school_id: string
  promise_id?: string | null
  audience: 'school_partner' | 'staff'
  kind: DeliveryNotificationKind
  title: string
  body: string
  metadata?: Record<string, unknown>
}) {
  const admin = createAdminClient()
  if (!admin) return null

  const { data, error } = await admin
    .from('delivery_notifications')
    .insert({
      school_id: input.school_id,
      promise_id: input.promise_id ?? null,
      audience: input.audience,
      kind: input.kind,
      title: input.title,
      body: input.body,
      metadata: input.metadata ?? {},
    })
    .select('*')
    .single()

  if (error || !data) return null
  return mapNotification(data as Record<string, unknown>)
}

export async function listDeliveryNotifications(opts: {
  schoolId?: string
  audience?: 'school_partner' | 'staff'
  unreadOnly?: boolean
  limit?: number
}) {
  const admin = createAdminClient()
  if (!admin) return []

  let query = admin.from('delivery_notifications').select('*').order('created_at', { ascending: false })
  if (opts.schoolId) query = query.eq('school_id', opts.schoolId)
  if (opts.audience) query = query.eq('audience', opts.audience)
  if (opts.unreadOnly) query = query.is('read_at', null)
  query = query.limit(opts.limit ?? 50)

  const { data } = await query
  return (data ?? []).map(row => mapNotification(row as Record<string, unknown>))
}

export async function markNotificationRead(id: string) {
  const admin = createAdminClient()
  if (!admin) return { error: 'Unavailable' }

  const { error } = await admin
    .from('delivery_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)

  return { error: error?.message ?? null }
}

export async function recordServiceAgreement(
  schoolId: string,
  serviceGroup: number,
  activatedBy: string | null
) {
  const admin = createAdminClient()
  if (!admin) return

  await admin.from('school_service_agreements').upsert(
    {
      school_id: schoolId,
      service_group: serviceGroup,
      activated_by: activatedBy,
      activated_at: new Date().toISOString(),
    },
    { onConflict: 'school_id,service_group' }
  )
}

export async function listServiceAgreements(schoolId?: string) {
  const admin = createAdminClient()
  if (!admin) return []

  let query = admin.from('school_service_agreements').select('*').order('service_group')
  if (schoolId) query = query.eq('school_id', schoolId)

  const { data } = await query
  return (data ?? []).map(row => ({
    id: String(row.id),
    school_id: String(row.school_id),
    service_group: Number(row.service_group),
    activated_at: String(row.activated_at),
    activated_by: (row.activated_by as string | null) ?? null,
    notes: (row.notes as string | null) ?? null,
  }))
}
