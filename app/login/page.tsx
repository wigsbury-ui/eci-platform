'use client'

import { Suspense, useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { portalForRole } from '@/lib/auth/roles'

type AudienceHint = 'investor' | 'school' | 'team' | 'agent'

const AUDIENCE_COPY: Record<
  AudienceHint,
  { headline: string; body: string; bullets: string[] }
> = {
  investor: {
    headline: 'Investment &\npartnership access',
    body: 'Secure access to investor briefings, due-diligence materials, and expansion opportunities across the ECI network.',
    bullets: [
      'Market opportunity and partnership models',
      'Marketing packs and due-diligence library',
      'Direct channel to the ECI leadership team',
    ],
  },
  agent: {
    headline: 'Introduction\nagent access',
    body: 'Tools for trusted agents who connect aligned investors and operators with Ellesmere College International.',
    bullets: [
      'Opportunity briefing and talking points',
      'Priority market summaries for introductions',
      'Referral desk to submit and track investor leads',
    ],
  },
  school: {
    headline: 'School partner\nresources',
    body: 'Your gateway to network archives, setup guidance, calendar collaboration, and messaging with the ECI team.',
    bullets: [
      'Network and school document archives',
      'Shared calendar for visits and training',
      'WhatsApp-style messaging with ECI staff',
    ],
  },
  team: {
    headline: 'ECI team\nworkspace',
    body: 'Internal tools for staff, board, and administrators — schools, documents, calendars, and governance.',
    bullets: [
      'Cross-network school and document oversight',
      'Team calendar and internal messaging',
      'Admin and governance dashboards',
    ],
  },
}

function resolveAudience(raw: string | null): AudienceHint {
  if (raw === 'investor' || raw === 'team' || raw === 'school' || raw === 'agent') return raw
  return 'school'
}

function LoginForm() {
  const searchParams = useSearchParams()
  const audience = useMemo(
    () => resolveAudience(searchParams.get('audience')),
    [searchParams]
  )
  const copy = AUDIENCE_COPY[audience]

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // Preview without Supabase: route by audience hint
        window.location.href =
          audience === 'investor'
            ? '/investor'
            : audience === 'agent'
              ? '/agent'
              : audience === 'team'
                ? '/team'
                : '/school'
        return
      }

      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      const accessToken = data.session?.access_token
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/get_my_role`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        }
      )
      const role = (await res.text()).replace(/"/g, '')
      window.location.href = portalForRole(role)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
      setLoading(false)
    }
  }

  const headlineParts = copy.headline.split('\n')

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'linear-gradient(135deg, #2D1654 0%, #4C2585 100%)' }}
    >
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-16">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-eci-gold rounded-full flex items-center justify-center">
              <span className="font-cormorant font-bold text-eci-purple-dark text-xl">E</span>
            </div>
            <div>
              <p className="font-cormorant font-semibold text-white text-xl leading-none">
                Ellesmere College
              </p>
              <p className="text-eci-gold text-xs tracking-widest uppercase">International</p>
            </div>
          </Link>
          <h2 className="font-cormorant font-light text-white text-5xl leading-tight mb-6">
            {headlineParts[0]}
            {headlineParts[1] && (
              <>
                <br />
                <em className="text-eci-gold">{headlineParts[1]}</em>
              </>
            )}
          </h2>
          <p className="text-white/60 font-jost leading-relaxed max-w-sm">{copy.body}</p>
          <div className="mt-12 space-y-4 text-sm font-jost text-white/50">
            {copy.bullets.map(item => (
              <p key={item} className="flex gap-3 items-start">
                <span className="text-eci-gold mt-0.5">→</span> {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-2xl">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-eci-purple rounded-full flex items-center justify-center">
              <span className="font-cormorant font-bold text-white text-base">E</span>
            </div>
            <span className="font-cormorant font-semibold text-eci-purple-dark">
              Ellesmere College International
            </span>
          </div>

          <h3 className="font-cormorant text-3xl text-eci-purple-dark mb-1">Sign In</h3>
          <p className="text-gray-400 text-sm font-jost mb-8">
            {audience === 'investor' && 'Access the investor portal'}
            {audience === 'agent' && 'Access the introduction agent portal'}
            {audience === 'team' && 'Access the ECI team portal'}
            {audience === 'school' && 'Access your school partner portal'}
          </p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-jost focus:outline-none focus:border-eci-purple transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-jost font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm font-jost focus:outline-none focus:border-eci-purple transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-jost bg-red-50 p-3 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-eci-purple text-white py-3.5 rounded-lg font-jost font-semibold text-sm hover:bg-eci-purple-dark transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-jost text-center">
              Not yet registered?{' '}
              <a
                href="mailto:international@ellesmere.com"
                className="text-eci-purple hover:underline"
              >
                Contact ECI
              </a>{' '}
              to request access.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #2D1654 0%, #4C2585 100%)' }}
        >
          <p className="text-white/70 font-jost text-sm">Loading…</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
