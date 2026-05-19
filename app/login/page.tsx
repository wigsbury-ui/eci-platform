'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Role is stored in user_metadata (set when account was created)
    // Route directly — no server round-trip needed
    // app_metadata.role is set server-side and always present in the JWT
    const role = (data.user?.app_metadata?.role ?? data.user?.user_metadata?.role) as string | undefined

    if (role === 'admin' || role === 'board_member') {
      window.location.href = '/admin'
    } else if (role === 'investor') {
      window.location.href = '/investor'
    } else {
      window.location.href = '/school'
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #2D1654 0%, #4C2585 100%)' }}>
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-16">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-eci-gold rounded-full flex items-center justify-center">
              <span className="font-cormorant font-bold text-eci-purple-dark text-xl">E</span>
            </div>
            <div>
              <p className="font-cormorant font-semibold text-white text-xl leading-none">Ellesmere College</p>
              <p className="text-eci-gold text-xs tracking-widest uppercase">International</p>
            </div>
          </Link>
          <h2 className="font-cormorant font-light text-white text-5xl leading-tight mb-6">
            Welcome to<br /><em className="text-eci-gold">the ECI Portal</em>
          </h2>
          <p className="text-white/60 font-jost leading-relaxed max-w-sm">
            Your secure gateway to partnership resources, governance tools, and the ECI school network.
          </p>
          <div className="mt-12 space-y-4 text-sm font-jost text-white/50">
            <p className="flex gap-3 items-start"><span className="text-eci-gold mt-0.5">→</span> Investor &amp; partnership enquiry portal</p>
            <p className="flex gap-3 items-start"><span className="text-eci-gold mt-0.5">→</span> School partner resource library</p>
            <p className="flex gap-3 items-start"><span className="text-eci-gold mt-0.5">→</span> Admin &amp; governance dashboard</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl p-10 shadow-2xl">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-eci-purple rounded-full flex items-center justify-center">
              <span className="font-cormorant font-bold text-white text-base">E</span>
            </div>
            <span className="font-cormorant font-semibold text-eci-purple-dark">Ellesmere College International</span>
          </div>

          <h3 className="font-cormorant text-3xl text-eci-purple-dark mb-1">Sign In</h3>
          <p className="text-gray-400 text-sm font-jost mb-8">Access your ECI portal</p>

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
              <a href="mailto:international@ellesmere.com" className="text-eci-purple hover:underline">
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
