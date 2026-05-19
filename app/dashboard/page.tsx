import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Read role from JWT user_metadata — no DB/RLS dependency
  const role = user.user_metadata?.role as string | undefined

  if (role === 'admin' || role === 'board_member') redirect('/admin')
  if (role === 'investor') redirect('/investor')
  redirect('/school')
}
