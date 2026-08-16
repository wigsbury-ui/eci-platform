import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { resolvePortalDestination } from '@/lib/auth/roles'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; audience?: string }>
}) {
  if (!hasSupabaseEnv()) redirect('/login')

  const supabase = await createClient()
  if (!supabase) redirect('/login')

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const { data: role } = await supabase.rpc('get_my_role')
  redirect(
    resolvePortalDestination(typeof role === 'string' ? role : null, {
      redirectTo: params.redirectTo ?? null,
      audience: params.audience ?? null,
    })
  )
}
