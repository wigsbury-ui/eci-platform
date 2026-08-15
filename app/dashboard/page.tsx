import { createClient, hasSupabaseEnv } from '@/lib/supabase/server'
import { portalForRole } from '@/lib/auth/roles'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  if (!hasSupabaseEnv()) redirect('/login')

  const supabase = await createClient()
  if (!supabase) redirect('/login')

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: role } = await supabase.rpc('get_my_role')
  redirect(portalForRole(typeof role === 'string' ? role : null))
}
