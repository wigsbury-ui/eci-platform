import { redirect } from 'next/navigation'
import { isExcludedPartnerSchool } from '@/lib/schools/partner-schools'

export default async function TeamDeliverySchoolPage({
  params,
}: {
  params: Promise<{ schoolId: string }>
}) {
  const { schoolId } = await params
  if (isExcludedPartnerSchool({ id: schoolId, name: '', city: '' })) {
    redirect('/team/delivery')
  }
  redirect(`/team/delivery?school=${encodeURIComponent(schoolId)}`)
}
