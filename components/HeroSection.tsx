export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center" style={{ background: 'linear-gradient(135deg, #2D1654 0%, #4C2585 50%, #6B3DA8 100%)' }}>
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(200,168,75,0.3) 40px, rgba(200,168,75,0.3) 41px)',
      }} />

      <div className="relative max-w-7xl mx-auto px-6 py-32 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-eci-gold text-sm tracking-[0.3em] uppercase mb-6 font-jost">Ellesmere College International</p>
          <h1 className="font-cormorant font-light text-white leading-tight mb-6" style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)' }}>
            British Excellence,<br />
            <em className="font-normal text-eci-gold">Globally Delivered</em>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed mb-10 font-jost font-light">
            ECI partners with schools worldwide to deliver the trusted Ellesmere College standard — 140 years of British educational heritage, brought to your community.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#schools" className="bg-eci-gold text-eci-purple-dark px-7 py-3 rounded font-jost font-semibold text-sm hover:bg-yellow-300 transition-colors">
              Our Schools
            </a>
            <a href="#partnership" className="border border-white/40 text-white px-7 py-3 rounded font-jost text-sm hover:border-eci-gold hover:text-eci-gold transition-colors">
              Partner With Us
            </a>
          </div>
        </div>

        <div className="hidden md:grid grid-cols-2 gap-4">
          {[
            { number: '5', label: 'Network Schools' },
            { number: '900+', label: 'Students Globally' },
            { number: '140', label: 'Years of Heritage' },
            { number: '4', label: 'Continents' },
          ].map(({ number, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur rounded-lg p-6 border border-white/20">
              <p className="font-cormorant text-eci-gold text-5xl font-light">{number}</p>
              <p className="text-white/70 text-sm mt-1 font-jost">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1.5">
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
