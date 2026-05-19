'use client'
import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Profile } from '@/lib/types'
import { Menu, LogOut, ChevronRight } from 'lucide-react'

interface NavItem { label: string; href: string; icon: React.ReactNode }

interface PortalShellProps {
  profile: Profile | null
  portalName: string
  portalAccent: string
  navItems: NavItem[]
  children: React.ReactNode
  activeSection?: string
}

export default function PortalShell({ profile, portalName, portalAccent, navItems, children, activeSection }: PortalShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg, #2D1654 0%, #4C2585 100%)' }}
      >
        {/* Accent stripe at top */}
        <div className="h-1 w-full" style={{ background: portalAccent }} />

        {/* Logo */}
        <div className="px-5 pt-5 pb-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: portalAccent }}>
              <span className="font-cormorant font-bold text-sm" style={{ color: '#2D1654' }}>E</span>
            </div>
            <div>
              <p className="font-cormorant font-semibold text-white text-sm leading-none">ECI</p>
              <p className="text-xs leading-none mt-0.5" style={{ color: portalAccent }}>International</p>
            </div>
          </Link>
          {/* Portal badge */}
          <div className="rounded-lg px-3 py-2 border" style={{ background: `${portalAccent}22`, borderColor: `${portalAccent}55` }}>
            <p className="text-xs font-jost font-semibold tracking-wide uppercase" style={{ color: portalAccent }}>
              {portalName}
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-jost transition-colors"
              style={activeSection === item.href
                ? { background: `${portalAccent}33`, color: portalAccent }
                : { color: 'rgba(255,255,255,0.6)' }
              }
              onMouseEnter={e => { if (activeSection !== item.href) (e.currentTarget as HTMLElement).style.color = 'white' }}
              onMouseLeave={e => { if (activeSection !== item.href) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)' }}
            >
              <span className="w-5 h-5 flex-shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-4 border-t border-white/10">
          {profile && (
            <div className="flex items-center gap-3 px-3 py-2 mb-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: portalAccent, color: '#2D1654' }}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold font-jost truncate">{profile.full_name || 'User'}</p>
                <p className="text-xs font-jost capitalize" style={{ color: portalAccent, opacity: 0.8 }}>
                  {profile.role?.replace('_', ' ')}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-white/50 hover:text-white text-xs font-jost px-3 py-2 w-full rounded hover:bg-white/10 transition-colors"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-500 hover:text-gray-800" onClick={() => setSidebarOpen(true)}>
              <Menu size={22} />
            </button>
            {/* Portal indicator in topbar */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-jost">
              <Link href="/" className="text-gray-400 hover:text-eci-purple transition-colors">ECI</Link>
              <ChevronRight size={12} className="text-gray-300" />
              <span className="font-semibold px-2 py-0.5 rounded text-white text-xs"
                style={{ background: portalAccent }}>
                {portalName}
              </span>
            </div>
          </div>
          <Link href="/" className="text-xs font-jost text-gray-400 hover:text-eci-purple transition-colors">
            ← Back to ECI Website
          </Link>
        </header>

        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
