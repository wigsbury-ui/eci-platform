import Image from 'next/image'
import Link from 'next/link'
import { TEAM_MEMBERS } from '@/lib/content/team'

function LinkedInIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export default function TeamSection() {
  return (
    <section
      id="team"
      className="relative py-24 md:py-28 bg-white scroll-mt-[var(--eci-nav-offset)]"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-[#C8A84B] text-xs tracking-[0.3em] uppercase mb-4 font-jost font-bold">
            Leadership
          </p>
          <h2
            className="font-cormorant font-semibold text-[#2D1654] leading-tight"
            style={{ fontSize: 'clamp(2rem, 3.5vw, 3.25rem)' }}
          >
            The people behind the partnership
          </h2>
          <div className="w-14 h-1 bg-[#C8A84B] mt-4 mb-4" />
          <p className="text-[#2D1654]/70 font-jost leading-relaxed">
            Educational stewardship and international partnership, the team that protects
            Ellesmere&apos;s standards as the network grows.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TEAM_MEMBERS.map(member => (
            <article
              key={member.id}
              id={member.id}
              className="border-2 border-[#2D1654]/10 bg-[#F8F4EF]/40 p-7 md:p-8 flex flex-col sm:flex-row sm:items-center gap-6"
            >
              <div className="shrink-0 mx-auto sm:mx-0">
                {member.image ? (
                  <div className="relative h-[112px] w-[112px] overflow-hidden rounded-full ring-2 ring-[#C8A84B]/40">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="112px"
                      className={member.avatarClassName ?? 'object-cover object-top'}
                    />
                  </div>
                ) : (
                  <div
                    className="rounded-full bg-[#2D1654] text-[#C8A84B] flex items-center justify-center font-cormorant font-semibold text-3xl ring-2 ring-[#C8A84B]/40"
                    style={{ width: 112, height: 112 }}
                    aria-hidden
                  >
                    {member.initials}
                  </div>
                )}
              </div>
              <div className="min-w-0 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h3 className="font-cormorant text-2xl font-semibold text-[#2D1654]">
                    {member.name}
                  </h3>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] hover:text-[#004182] transition-colors"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <LinkedInIcon className="w-4 h-4" />
                  </a>
                </div>
                <p className="font-jost text-sm text-[#4C2585] font-medium mb-3">{member.title}</p>
                <p className="font-jost text-sm text-[#2D1654]/75 leading-relaxed">
                  {member.fullBio}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-10 text-sm font-jost text-[#2D1654]/55">
          Photographs for additional colleagues can be added as they are confirmed.{' '}
          <Link href="/#contact" className="text-[#2D1654] font-semibold hover:text-[#C8A84B]">
            Get in touch →
          </Link>
        </p>
      </div>
    </section>
  )
}
