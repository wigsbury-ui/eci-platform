import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-eci-dark text-white/60 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-eci-gold rounded-full flex items-center justify-center">
                <span className="font-cormorant font-bold text-eci-purple-dark text-base">E</span>
              </div>
              <div>
                <p className="font-cormorant font-semibold text-white text-base leading-none">Ellesmere College International</p>
                <p className="text-eci-gold text-xs tracking-widest uppercase">Est. 2020</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed font-jost max-w-sm">
              Extending 140 years of British educational heritage to schools and students around the world.
            </p>
          </div>
          <div>
            <p className="text-white text-xs tracking-widest uppercase font-jost font-semibold mb-4">Navigation</p>
            <ul className="space-y-2 text-sm font-jost">
              {[['About ECI', '#about'], ['Our Schools', '#schools'], ['Partnership', '#partnership'], ['Contact', '#contact']].map(([l, h]) => (
                <li key={l}><a href={h} className="hover:text-eci-gold transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white text-xs tracking-widest uppercase font-jost font-semibold mb-4">Portals</p>
            <ul className="space-y-2 text-sm font-jost">
              <li><Link href="/login" className="hover:text-eci-gold transition-colors">Investor Portal</Link></li>
              <li><Link href="/login" className="hover:text-eci-gold transition-colors">School Partner Portal</Link></li>
              <li><Link href="/login" className="hover:text-eci-gold transition-colors">Admin & Governance</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-jost">
          <p>© {new Date().getFullYear()} Ellesmere College International. All rights reserved.</p>
          <p>A division of Ellesmere College, Shropshire, UK · Registered Charity No. 1087175</p>
        </div>
      </div>
    </footer>
  )
}
