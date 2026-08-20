'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

/**
 * Public navigation map
 *
 * Two destination types — never mix a page path with a same-named hash
 * (that produced /investors#investors#investors):
 *
 * 1. Home chapters — scroll on `/`
 *    Head's Message · Team · Contact
 *
 * 2. Journey pages — own URL, always open at the top
 *    Our Schools · Investors · Agents
 *
 * Portal login is auth, not part of the marketing map.
 */
const LINKS: Array<
  | { kind: 'home'; label: string; href: string }
  | { kind: 'page'; label: string; href: string; match: string }
  | { kind: 'rule' }
> = [
  { kind: 'home', label: "Head's Message", href: '/#heads-message' },
  { kind: 'rule' },
  { kind: 'page', label: 'Our Schools', href: '/schools', match: '/schools' },
  { kind: 'page', label: 'Investors', href: '/investors', match: '/investors' },
  { kind: 'page', label: 'Agents', href: '/agents', match: '/agents' },
  { kind: 'rule' },
  { kind: 'home', label: 'Team', href: '/#team' },
  { kind: 'home', label: 'Contact', href: '/#contact' },
]

function linkClass(active: boolean) {
  return active
    ? 'text-[#C8A84B] text-sm tracking-wide font-jost font-semibold'
    : 'text-white/80 hover:text-[#C8A84B] text-sm tracking-wide transition-colors font-jost'
}

export default function PublicNav({ solid = false }: { solid?: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(solid)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (solid) return
    const handler = () => setScrolled(window.scrollY > 24)
    handler()
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [solid])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const dark = solid || scrolled

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        dark ? 'bg-[#2D1654]/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
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

        <div className="hidden lg:flex items-center gap-5 xl:gap-7 min-w-0">
          {LINKS.map((item, i) => {
            if (item.kind === 'rule') {
              return <span key={`rule-${i}`} className="h-4 w-px bg-white/25 shrink-0" aria-hidden />
            }
            if (item.kind === 'page') {
              const active = pathname === item.match || pathname.startsWith(`${item.match}/`)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={linkClass(active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            }
            return (
              <Link key={item.label} href={item.href} className={linkClass(false)}>
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="hidden lg:flex items-center shrink-0">
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
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-jost pt-1 pb-2">
            On the home page
          </p>
          {LINKS.filter(l => l.kind === 'home').map(item => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block text-white/80 hover:text-[#C8A84B] py-2.5 text-sm font-jost"
            >
              {item.label}
            </Link>
          ))}
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/40 font-jost pt-3 pb-2">
            Dedicated pages
          </p>
          {LINKS.filter(l => l.kind === 'page').map(item => {
            const active = pathname === item.match || pathname.startsWith(`${item.match}/`)
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block py-2.5 text-sm font-jost ${
                  active ? 'text-[#C8A84B] font-semibold' : 'text-white/80 hover:text-[#C8A84B]'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {item.label}
              </Link>
            )
          })}
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
