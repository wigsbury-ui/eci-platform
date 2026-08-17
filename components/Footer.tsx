import Link from 'next/link'
import Image from 'next/image'
import { HERITAGE } from '@/lib/content/network'

export default function Footer() {
  return (
    <footer className="bg-[#1A1228] text-white/60 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <Image src="/images/brand/eci-crest.png" alt="" width={40} height={40} className="rounded-full" />
              <div>
                <p className="font-cormorant font-semibold text-white text-base leading-none">
                  Ellesmere College International
                </p>
                <p className="text-[#C8A84B] text-[10px] tracking-[0.25em] uppercase mt-1">Life:Ready</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed font-jost max-w-sm">
              Extending British educational heritage from Shropshire to partner campuses across the
              Middle East and beyond.
            </p>
          </div>
          <div>
            <p className="text-white text-xs tracking-widest uppercase font-jost font-semibold mb-4">Explore</p>
            <ul className="space-y-2 text-sm font-jost">
              {[
                ['Our Schools', '/#schools'],
                ['Our team', '/#team'],
                ['Growth', '/growth'],
                ['Investors', '/growth#investors'],
                ['Agents & rainmakers', '/growth#agents'],
                ['Contact', '/growth#contact'],
              ].map(([l, h]) => (
                <li key={l}>
                  <Link href={h} className="hover:text-[#C8A84B] transition-colors">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-xs tracking-widest uppercase font-jost font-semibold mb-4">Portals</p>
            <ul className="space-y-2 text-sm font-jost">
              <li><Link href="/login?audience=investor" className="hover:text-[#C8A84B] transition-colors">Investor portal</Link></li>
              <li><Link href="/login?audience=agent" className="hover:text-[#C8A84B] transition-colors">Agent portal</Link></li>
              <li><Link href="/login?audience=school" className="hover:text-[#C8A84B] transition-colors">School partner portal</Link></li>
              <li><Link href="/login?audience=team" className="hover:text-[#C8A84B] transition-colors">Staff portal</Link></li>
            </ul>
            <p className="text-xs font-jost mt-6 text-white/40">
              {HERITAGE.email}
              <br />
              {HERITAGE.phone}
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-jost">
          <p>© {new Date().getFullYear()} Ellesmere College International. All rights reserved.</p>
          <p>
            A division of Ellesmere College, Shropshire · Registered Charity No. {HERITAGE.charityNumber}
          </p>
        </div>
      </div>
    </footer>
  )
}
