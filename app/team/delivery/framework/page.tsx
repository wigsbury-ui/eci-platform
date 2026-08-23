import { redirect } from 'next/navigation'

export default async function TeamDeliveryFrameworkPage({
  searchParams,
}: {
  searchParams: Promise<{ school?: string }>
}) {
  const params = await searchParams
  const q = new URLSearchParams()
  if (params.school) q.set('school', params.school)
  q.set('add', '1')
  redirect(`/team/delivery?${q.toString()}`)
}
