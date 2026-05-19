import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // app_metadata is set server-side and always reliable in the JWT
  const role = (user.app_metadata?.role ?? user.user_metadata?.role) as string | undefined

  if (role === 'admin' || role === 'board_member') redirect('/admin')
  if (role === 'investor') redirect('/investor')
  redirect('/school')
}
