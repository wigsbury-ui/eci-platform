import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Use SECURITY DEFINER function — bypasses RLS completely
  const { data: role } = await supabase.rpc('get_my_role')

  if (role === 'admin' || role === 'board_member') redirect('/admin')
  if (role === 'investor') redirect('/investor')
  redirect('/school')
}
