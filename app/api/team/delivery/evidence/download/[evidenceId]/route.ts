import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isStaff } from '@/lib/auth/roles'
import { SCHOOL_ROLES } from '@/lib/auth/roles'
import type { UserRole } from '@/lib/types'
import { getPromiseEvidenceById, getServicePromiseById } from '@/lib/delivery/db'
import { DELIVERY_EVIDENCE_BUCKET } from '@/lib/delivery/config'

async function authorizeEvidenceDownload(
  evidenceId: string,
  userId: string,
  role?: string | null,
  profileSchoolId?: string | null
) {
  const evidence = await getPromiseEvidenceById(evidenceId)
  if (!evidence?.storage_path) return { error: 'Not found', evidence: null, promise: null }

  const promise = await getServicePromiseById(evidence.promise_id)
  if (!promise) return { error: 'Not found', evidence: null, promise: null }

  if (isStaff(role)) return { error: null, evidence, promise }

  if (role === 'school_partner' && profileSchoolId && promise.school_id === profileSchoolId) {
    return { error: null, evidence, promise }
  }

  if (SCHOOL_ROLES.includes(role as UserRole) && profileSchoolId === promise.school_id) {
    return { error: null, evidence, promise }
  }

  return { error: 'Forbidden', evidence: null, promise: null }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ evidenceId: string }> }
) {
  const { evidenceId } = await context.params
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  const auth = await authorizeEvidenceDownload(
    evidenceId,
    user.id,
    profile?.role,
    profile?.school_id
  )
  if (auth.error || !auth.evidence) {
    const status = auth.error === 'Forbidden' ? 403 : 404
    return NextResponse.json({ error: auth.error ?? 'Not found' }, { status })
  }

  const admin = createAdminClient()
  if (!admin) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: blob, error } = await admin.storage
    .from(DELIVERY_EVIDENCE_BUCKET)
    .download(auth.evidence.storage_path!)

  if (error || !blob) {
    return NextResponse.json({ error: 'Could not download file' }, { status: 500 })
  }

  const filename = auth.evidence.file_name ?? auth.evidence.title
  return new NextResponse(blob, {
    headers: {
      'Content-Type': blob.type || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${filename.replace(/"/g, '')}"`,
    },
  })
}
