import Image from 'next/image'
import { RIYADH_SUCCESS_QUOTE } from '@/lib/content/riyadh-success'

type Props = {
  className?: string
}

export default function RiyadhSuccessQuote({ className = '' }: Props) {
  const { quote, name, role, organisation, image } = RIYADH_SUCCESS_QUOTE

  return (
    <figure
      className={`rounded-2xl border border-[#2D1654]/10 bg-[#F8F4EF]/80 p-8 md:p-10 ${className}`}
    >
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-6 md:gap-8">
        <div className="shrink-0">
          <div className="relative h-28 w-28 md:h-32 md:w-32 overflow-hidden rounded-full border-4 border-[#C8A84B]/70 shadow-md shadow-[#2D1654]/10">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover object-top"
              sizes="128px"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <blockquote>
            <p className="font-cormorant text-[#2D1654] text-xl md:text-2xl leading-snug italic mb-6">
              &ldquo;{quote}&rdquo;
            </p>
          </blockquote>
          <figcaption>
            <p className="font-jost font-semibold text-[#2D1654] text-sm tracking-wide">
              {name}
            </p>
            <p className="font-jost text-[#2D1654]/60 text-sm mt-1">
              {role}, {organisation}
            </p>
          </figcaption>
        </div>
      </div>
    </figure>
  )
}
