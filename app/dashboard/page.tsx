import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) redirect('/login')

  // Try profiles table first
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // If RLS blocks it, fall back to reading raw_user_meta_data from the JWT
  const role = profile?.role
    ?? (user.user_metadata?.role as string | undefined)

  if (role === 'admin' || role === 'board_member') redirect('/admin')
  if (role === 'investor') redirect('/investor')
  if (role === 'school_partner') redirect('/school')

  // Last resort: check user email pattern for demo accounts
  if (user.email?.includes('investor')) redirect('/investor')
  if (user.email?.includes('admin') || user.email === 'neil@tomalin.net') redirect('/admin')

  redirect('/school')
}
