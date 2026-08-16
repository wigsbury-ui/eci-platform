'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { label: "Head's Message", href: '/#heads-message' },
  { label: 'Our Schools', href: '/#schools' },
  { label: 'Team', href: '/#team' },
  { label: 'Growth', href: '/growth' },
  { label: 'Contact', href: '/#contact' },
]

export default function PublicNav({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(solid)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (solid) return
    const handler = () => setScrolled(window.scrollY > 24)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [solid])

  const dark = solid || scrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        dark ? 'bg-[#2D1654]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/brand/eci-crest.png"
            alt="Ellesmere College"
            width={44}
            height={44}
            className="shrink-0"
            priority
          />
          <div>
            <p className="font-cormorant font-semibold text-white text-lg leading-none tracking-wide">
              Ellesmere College
            </p>
            <p className="text-[#C8A84B] text-[10px] tracking-[0.28em] uppercase leading-none mt-1">
              International
            </p>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-white/80 hover:text-[#C8A84B] text-sm tracking-wide transition-colors font-jost"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/login?audience=school"
            className="text-white/80 hover:text-white text-sm font-jost px-3 py-2"
          >
            School portal
          </Link>
          <Link
            href="/login"
            className="bg-[#C8A84B] text-[#2D1654] px-5 py-2.5 rounded-sm text-sm font-semibold font-jost hover:bg-[#F0E4B0] transition-colors"
          >
            Portal login
          </Link>
        </div>

        <button className="lg:hidden text-white" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-[#2D1654] border-t border-white/10 px-6 py-4 space-y-1">
          {LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-[#C8A84B] py-2.5 text-sm font-jost"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/login"
            className="block bg-[#C8A84B] text-[#2D1654] px-5 py-2.5 rounded-sm text-sm font-semibold text-center mt-3"
          >
            Portal login
          </Link>
        </div>
      )}
    </nav>
  )
}
