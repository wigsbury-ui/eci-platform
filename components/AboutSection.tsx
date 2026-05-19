export default function AboutSection() {
  return (
    <section id="about" className="py-28 bg-eci-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-eci-purple text-xs tracking-[0.3em] uppercase mb-4 font-jost font-semibold">About ECI</p>
            <h2 className="font-cormorant font-light text-eci-purple-dark leading-tight mb-6" style={{ fontSize: 'clamp(2rem, 3vw, 3rem)' }}>
              The ECI Standard.<br />
              <em>Trusted. Transferable. Transformative.</em>
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6 font-jost">
              Ellesmere College International (ECI) is the global licensing and partnership arm of Ellesmere College, Shropshire — one of England&apos;s most respected independent boarding schools, founded in 1884.
            </p>
            <p className="text-gray-600 leading-relaxed font-jost">
              Through carefully selected partnerships, ECI extends Ellesmere&apos;s educational philosophy, curriculum frameworks, and quality standards to schools around the world — giving students access to a proven British education wherever they are.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { title: 'Curriculum Excellence', body: 'Full support for IGCSE, A-Level, and IB pathways, with Ellesmere-developed schemes of work and assessment frameworks.' },
              { title: 'Quality Assurance', body: 'Regular inspection visits, self-evaluation frameworks, and direct oversight from ECI leadership ensure consistent standards.' },
              { title: 'Global Network', body: 'Access to a growing community of ECI school leaders, shared professional development, and a common identity recognised worldwide.' },
            ].map(({ title, body }) => (
              <div key={title} className="flex gap-5 p-6 bg-white rounded-lg border-l-4 border-eci-gold shadow-sm">
                <div>
                  <h3 className="font-cormorant font-semibold text-eci-purple-dark text-xl mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-jost">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
