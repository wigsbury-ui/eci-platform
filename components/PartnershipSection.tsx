export default function PartnershipSection() {
  return (
    <section id="partnership" className="py-28" style={{ background: 'linear-gradient(135deg, #2D1654 0%, #4C2585 100%)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-eci-gold text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">Partner With ECI</p>
          <h2 className="font-cormorant font-light text-white leading-tight mb-6" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
            Three Ways to Work With Us
          </h2>
          <p className="text-white/60 max-w-xl mx-auto font-jost">
            Whether you are an investor, an existing school operator, or planning a new institution, ECI offers a partnership model designed around your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: 'Full Partnership',
              desc: 'Complete ECI branding, curriculum framework, quality assurance programme, and ongoing support for new or established schools.',
              ideal: 'Ideal for new school investors and established operators seeking full ECI affiliation.',
            },
            {
              title: 'Curriculum Licensing',
              desc: 'License the Ellesmere curriculum and assessment frameworks while retaining your existing school brand and identity.',
              ideal: 'Ideal for schools already operating who wish to adopt British curriculum standards.',
            },
            {
              title: 'Advisory Partnership',
              desc: 'Benefit from ECI expertise, inspection support, and professional development without full brand integration.',
              ideal: 'Ideal for schools seeking quality assurance and professional development support.',
            },
          ].map(({ title, desc, ideal }) => (
            <div key={title} className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-colors">
              <div className="w-10 h-0.5 bg-eci-gold mb-6" />
              <h3 className="font-cormorant font-semibold text-white text-2xl mb-4">{title}</h3>
              <p className="text-white/70 text-sm leading-relaxed font-jost mb-5">{desc}</p>
              <p className="text-eci-gold text-xs font-jost italic">{ideal}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a href="#contact" className="inline-block bg-eci-gold text-eci-purple-dark px-8 py-4 rounded font-jost font-semibold hover:bg-yellow-300 transition-colors">
            Register Your Interest
          </a>
        </div>
      </div>
    </section>
  )
}
