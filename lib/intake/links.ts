import { randomBytes } from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'
import { getEnvIntakeToken } from '@/lib/intake/config'
import type { DocumentIntakeLink } from '@/lib/types'

export function generateIntakeToken() {
  return randomBytes(24).toString('hex')
}

/** Accept env token (legacy) or an active DB link token. */
export async function findActiveIntakeToken(token: string): Promise<boolean> {
  const trimmed = token.trim()
  if (!trimmed) return false

  const envToken = getEnvIntakeToken()
  if (envToken && trimmed === envToken) return true

  const admin = createAdminClient()
  if (!admin) return false

  const { data, error } = await admin
    .from('document_intake_links')
    .select('id')
    .eq('token', trimmed)
    .eq('is_active', true)
    .maybeSingle()

  if (error) {
    console.error('intake token lookup', error)
    return false
  }
  return Boolean(data)
}

/** Return the oldest active link, or create a default one. */
export async function ensureDefaultIntakeLink(
  createdBy: string | null
): Promise<DocumentIntakeLink | null> {
  const admin = createAdminClient()
  if (!admin) return null

  const { data: existing, error: readError } = await admin
    .from('document_intake_links')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (readError) {
    console.error('intake links read', readError)
    return null
  }
  if (existing) return existing as DocumentIntakeLink

  const token = generateIntakeToken()
  const { data: created, error: insertError } = await admin
    .from('document_intake_links')
    .insert({
      token,
      label: 'Colleague upload',
      is_active: true,
      created_by: createdBy,
    })
    .select('*')
    .single()

  if (insertError || !created) {
    console.error('intake link create', insertError)
    return null
  }
  return created as DocumentIntakeLink
}

export async function listIntakeLinks(): Promise<DocumentIntakeLink[]> {
  const admin = createAdminClient()
  if (!admin) return []

  const { data, error } = await admin
    .from('document_intake_links')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('intake links list', error)
    return []
  }
  return (data as DocumentIntakeLink[]) ?? []
}

export function buildIntakeShareUrl(siteBase: string, token: string) {
  return `${siteBase.replace(/\/$/, '')}/intake/${token}`
}
