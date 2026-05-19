'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DebugPage() {
  const [info, setInfo] = useState<any>({ loading: true })

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (!user) { setInfo({ error: 'No user session', userError }); return }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const { data: session } = await supabase.auth.getSession()

      setInfo({
        user_id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        app_metadata: user.app_metadata,
        profile,
        profileError: profileError?.message,
        session_exists: !!session?.session,
      })
    }
    load()
  }, [])

  return (
    <div style={{ padding: 30, fontFamily: 'monospace', fontSize: 14 }}>
      <h2 style={{ marginBottom: 16 }}>ECI Auth Debug</h2>
      <pre style={{ background: '#f0f0f0', padding: 20, borderRadius: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
        {JSON.stringify(info, null, 2)}
      </pre>
    </div>
  )
}
