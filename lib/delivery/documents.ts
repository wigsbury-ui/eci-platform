import { createAdminClient } from '@/lib/supabase/admin'
import type { Document } from '@/lib/types'

export async function listSchoolDocumentsForEvidence(schoolId: string): Promise<Document[]> {
  const admin = createAdminClient()
  if (!admin) return []

  const { data } = await admin
    .from('documents')
    .select('*')
    .eq('is_published', true)
    .or(`scope.eq.network,and(scope.eq.school,school_id.eq.${schoolId})`)
    .order('title')

  return (data ?? []) as Document[]
}
