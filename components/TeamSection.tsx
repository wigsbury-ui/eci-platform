import Image from 'next/image'
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
      className="home-window relative flex min-h-[100svh] flex-col justify-center bg-white py-10 md:py-12 pt-[max(4.5rem,calc(var(--eci-nav-offset)+0.75rem))]"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto mb-6 max-w-3xl text-center md:mb-7">
          <p className="mb-2 font-jost text-[10px] font-bold uppercase tracking-[0.3em] text-[#C8A84B] md:text-xs">
            Leadership
          </p>
          <h2
            className="whitespace-nowrap font-cormorant font-semibold leading-tight text-[#2D1654]"
            style={{ fontSize: 'clamp(1.65rem, 3vw, 2.75rem)' }}
          >
            The people behind the partnership
          </h2>
          <div className="mx-auto mt-3 mb-2.5 h-1 w-12 bg-[#C8A84B]" />
          <p className="mx-auto max-w-xl font-jost text-sm leading-relaxed text-[#2D1654]/65">
            Educational stewardship and international partnership, the team that protects
            Ellesmere&apos;s standards as the network grows.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-3 md:grid-cols-2 md:gap-4">
          {TEAM_MEMBERS.map(member => (
            <article
              key={member.id}
              id={member.id}
              className="flex flex-col gap-3 border border-[#2D1654]/10 bg-[#F8F4EF]/50 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4"
            >
              <div className="mx-auto shrink-0 sm:mx-0">
                {member.image ? (
                  <div className="relative h-[72px] w-[72px] overflow-hidden rounded-full ring-2 ring-[#C8A84B]/40 md:h-[80px] md:w-[80px]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="80px"
                      className={member.avatarClassName ?? 'object-cover object-top'}
                    />
                  </div>
                ) : (
                  <div
                    className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#2D1654] font-cormorant text-2xl font-semibold text-[#C8A84B] ring-2 ring-[#C8A84B]/40 md:h-[80px] md:w-[80px]"
                    aria-hidden
                  >
                    {member.initials}
                  </div>
                )}
              </div>
              <div className="min-w-0 text-center sm:text-left">
                <div className="mb-0.5 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
                  <h3 className="font-cormorant text-xl font-semibold text-[#2D1654] md:text-[1.35rem]">
                    {member.name}
                  </h3>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0A66C2] transition-colors hover:text-[#004182]"
                    aria-label={`${member.name} on LinkedIn`}
                  >
                    <LinkedInIcon className="h-3.5 w-3.5" />
                  </a>
                </div>
                <p className="mb-1.5 font-jost text-xs font-medium text-[#4C2585] md:text-sm">
                  {member.title}
                </p>
                <p className="font-jost text-[13px] leading-snug text-[#2D1654]/70 md:text-sm md:leading-relaxed">
                  {member.shortBio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
