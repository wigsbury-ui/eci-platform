'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-eci-purple-dark shadow-lg py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-eci-gold rounded-full flex items-center justify-center">
            <span className="font-cormorant font-bold text-eci-purple-dark text-lg">E</span>
          </div>
          <div>
            <p className="font-cormorant font-semibold text-white text-lg leading-none">Ellesmere College</p>
            <p className="text-eci-gold text-xs tracking-widest uppercase leading-none">International</p>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {[['About ECI', '#about'], ['Our Schools', '#schools'], ['Partnership', '#partnership'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} className="text-white/80 hover:text-eci-gold text-sm tracking-wide transition-colors font-jost">
              {label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="bg-eci-gold text-eci-purple-dark px-5 py-2 rounded text-sm font-semibold font-jost hover:bg-yellow-300 transition-colors">
            Portal Login
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-eci-purple-dark border-t border-white/10 px-6 py-4 space-y-3">
          {[['About ECI', '#about'], ['Our Schools', '#schools'], ['Partnership', '#partnership'], ['Contact', '#contact']].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)} className="block text-white/80 hover:text-eci-gold py-2 text-sm font-jost">
              {label}
            </a>
          ))}
          <Link href="/login" className="block bg-eci-gold text-eci-purple-dark px-5 py-2 rounded text-sm font-semibold text-center mt-4">
            Portal Login
          </Link>
        </div>
      )}
    </nav>
  )
}
