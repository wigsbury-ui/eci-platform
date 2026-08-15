import { createClient } from '@/lib/supabase/server'
import { portalForRole } from '@/lib/auth/roles'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: role } = await supabase.rpc('get_my_role')
  redirect(portalForRole(typeof role === 'string' ? role : null))
}
