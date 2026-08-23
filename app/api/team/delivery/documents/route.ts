import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isStaff } from '@/lib/auth/roles'
import { listSchoolDocumentsForEvidence } from '@/lib/delivery/documents'

export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const schoolId = new URL(request.url).searchParams.get('schoolId')
  if (!schoolId) return NextResponse.json({ error: 'Missing schoolId' }, { status: 400 })

  const documents = await listSchoolDocumentsForEvidence(schoolId)
  return NextResponse.json({ documents })
}
