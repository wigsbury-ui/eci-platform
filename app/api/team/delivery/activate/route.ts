import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isStaff } from '@/lib/auth/roles'
import { group1PromiseRows } from '@/lib/delivery/activate'
import { insertGroupPromises } from '@/lib/delivery/db'
import { servicesByGroup } from '@/lib/content/partner-services'
import type { ServiceGroupId } from '@/lib/content/partner-services'
import { promiseRowsFromServices } from '@/lib/delivery/activate'

export async function POST(request: Request) {
  const supabase = await createClient()
  if (!supabase) return NextResponse.json({ error: 'Unavailable' }, { status: 503 })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!isStaff(profile?.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await request.json()
  const schoolId = body.schoolId as string | undefined
  const group = Number(body.group ?? 1) as ServiceGroupId

  if (!schoolId) return NextResponse.json({ error: 'Missing schoolId' }, { status: 400 })
  if (![1, 2, 3].includes(group)) {
    return NextResponse.json({ error: 'Invalid group' }, { status: 400 })
  }

  const rows =
    group === 1
      ? group1PromiseRows(schoolId)
      : promiseRowsFromServices(schoolId, servicesByGroup(group))

  const { error } = await insertGroupPromises(rows)
  if (error) return NextResponse.json({ error }, { status: 500 })

  return NextResponse.json({ activated: rows.length, group })
}
