import { notFound } from 'next/navigation'
import Image from 'next/image'
import DocumentIntakeDropzone from '@/components/intake/DocumentIntakeDropzone'
import { isValidIntakeToken } from '@/lib/intake/config'
import { hasSupabaseEnv } from '@/lib/supabase/server'

type Props = {
  params: Promise<{ token: string }>
}

export default async function IntakePage({ params }: Props) {
  const { token } = await params

  if (!isValidIntakeToken(token)) {
    notFound()
  }

  const supabaseReady = hasSupabaseEnv()

  return (
    <main className="min-h-screen bg-[#F8F4EF]">
      <div
        className="border-b border-[#2D1654]/10 bg-gradient-to-r from-[#2D1654] to-[#4C2585] text-white px-6 py-10"
      >
        <div className="max-w-2xl mx-auto flex items-start gap-5">
          <Image
            src="/images/brand/eci-crest.png"
            alt=""
            width={56}
            height={56}
            className="drop-shadow-md shrink-0"
          />
          <div>
            <p className="text-[#C8A84B] text-xs tracking-[0.35em] uppercase font-jost font-bold mb-2">
              Ellesmere College International
            </p>
            <h1 className="font-cormorant text-3xl sm:text-4xl font-semibold leading-tight">
              Partner document intake
            </h1>
            <p className="mt-3 text-white/80 font-jost text-sm leading-relaxed max-w-xl">
              Share source policies, curriculum materials, and operational documents. We use your
              uploads inside ECI to draft articulated, improved partner documentation. Name and email
              are required so we can follow up if needed.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {!supabaseReady ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 font-jost text-sm text-amber-900">
            Document intake requires Supabase to be configured on this environment. Contact the ECI
            team if you reached this page in production.
          </div>
        ) : (
          <DocumentIntakeDropzone token={token} />
        )}
      </div>
    </main>
  )
}
