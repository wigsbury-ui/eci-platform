import { servicesByGroup, type PartnerService } from '@/lib/content/partner-services'
import type { ServicePromise } from '@/lib/delivery/types'

export function promiseRowsFromServices(
  schoolId: string,
  services: PartnerService[],
  overrides?: Partial<Pick<ServicePromise, 'status' | 'owner_name' | 'next_review_at'>>
): Omit<ServicePromise, 'id' | 'created_at' | 'updated_at' | 'last_reviewed_at' | 'owner_profile_id' | 'notes'>[] {
  return services.map(service => ({
    school_id: schoolId,
    service_id: service.id,
    service_group: service.group,
    title: service.name,
    promise_text: service.overview,
    success_criteria: service.successCriteria ?? [],
    status: overrides?.status ?? 'pending_verification',
    owner_name: overrides?.owner_name ?? null,
    next_review_at: overrides?.next_review_at ?? null,
  }))
}

export function group1PromiseRows(schoolId: string) {
  return promiseRowsFromServices(schoolId, servicesByGroup(1))
}
