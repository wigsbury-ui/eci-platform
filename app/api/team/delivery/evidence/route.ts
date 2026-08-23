import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isStaff } from '@/lib/auth/roles'
import {
  deletePromiseEvidence,
  insertPromiseEvidence,
  listPromiseEvidence,
} from '@/lib/delivery/db'

export async function GET(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const promiseId = new URL(request.url).searchParams.get('promiseId')
  if (!promiseId) return NextResponse.json({ error: 'Missing promiseId' }, { status: 400 })

  const evidence = await listPromiseEvidence(promiseId)
  return NextResponse.json({ evidence })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const promiseId = body.promiseId as string | undefined
  const title = (body.title as string | undefined)?.trim()
  if (!promiseId || !title) {
    return NextResponse.json({ error: 'Missing promiseId or title' }, { status: 400 })
  }

  const { evidence, error } = await insertPromiseEvidence({
    promise_id: promiseId,
    title,
    url: (body.url as string | null) ?? null,
    document_id: (body.documentId as string | null) ?? null,
    added_by: user.id,
  })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ evidence })
}

export async function DELETE(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const id = new URL(request.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const { error } = await deletePromiseEvidence(id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ ok: true })
}
