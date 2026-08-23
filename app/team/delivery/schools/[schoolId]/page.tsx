import { redirect } from 'next/navigation'

export default async function TeamDeliverySchoolPage({
  params,
}: {
  params: Promise<{ schoolId: string }>
}) {
  const { schoolId } = await params
  redirect(`/team/delivery?school=${encodeURIComponent(schoolId)}`)
}
