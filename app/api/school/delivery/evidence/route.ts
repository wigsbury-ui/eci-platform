import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { SCHOOL_ROLES } from '@/lib/auth/roles'
import type { UserRole } from '@/lib/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || !SCHOOL_ROLES.includes(profile.role as UserRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const promiseId = new URL(request.url).searchParams.get('promiseId')
  if (!promiseId) return NextResponse.json({ error: 'Missing promiseId' }, { status: 400 })

  const { data, error } = await supabase
    .from('promise_evidence')
    .select('*, documents(title, file_url)')
    .eq('promise_id', promiseId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const evidence = (data ?? []).map((row: Record<string, unknown>) => {
    const doc = row.documents as { title?: string; file_url?: string | null } | null
    return {
      id: String(row.id),
      promise_id: String(row.promise_id),
      title: String(row.title),
      url: (row.url as string | null) ?? null,
      document_id: (row.document_id as string | null) ?? null,
      document_title: doc?.title ?? null,
      document_file_url: doc?.file_url ?? null,
      file_url: (row.file_url as string | null) ?? null,
      file_name: (row.file_name as string | null) ?? null,
      storage_path: (row.storage_path as string | null) ?? null,
      added_by: null,
      created_at: String(row.created_at),
    }
  })

  return NextResponse.json({ evidence })
}
