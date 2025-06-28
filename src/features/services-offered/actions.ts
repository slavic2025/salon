'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { SERVICES_OFFERED_CONSTANTS } from '@/core/domains/services-offered/service-offered.constants'
import { handleError, handleUniquenessErrors } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import { UniquenessError } from '@/lib/errors'
import type { ActionResponse } from '@/types/actions.types'
import { createServicesOfferedRepository } from '@/core/domains/services-offered/service-offered.repository'
import { createServicesOfferedService } from '@/core/domains/services-offered/service-offered.service'
import { ServiceOffered } from '@/core/domains/services-offered/service-offered.types'

/**
 * Funcție ajutătoare care asamblează serviciul pentru `services-offered`.
 */
export async function getServiceOfferedService() {
  const supabase = await createClient()
  const repository = createServicesOfferedRepository(supabase)
  return createServicesOfferedService(repository)
}

/**
 * Acțiune pentru adăugarea unui serviciu la un stilist.
 */
/**
 * Acțiune pentru adăugarea unui serviciu la un stilist.
 * Acum este un simplu "transmițător" de date către serviciu.
 */
export async function addServiceToStylistAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const serviceOfferedService = await getServiceOfferedService()
    // Apelul este acum corect, cu un singur argument
    await serviceOfferedService.addServiceToStylist(rawData)

    const stylistId = rawData.stylist_id as string
    revalidatePath(SERVICES_OFFERED_CONSTANTS.PATHS.revalidate.stylistServices(stylistId))

    return { success: true, message: SERVICES_OFFERED_CONSTANTS.MESSAGES.SUCCESS.ADDED }
  } catch (error) {
    // Prindem eroarea specifică de unicitate aruncată de serviciu
    if (error instanceof UniquenessError) {
      return handleUniquenessErrors(error.fields)
    }
    return handleError(error, SERVICES_OFFERED_CONSTANTS.MESSAGES.ERROR.SERVER.ADD)
  }
}

/**
 * Acțiune pentru eliminarea unui serviciu de la un stilist.
 */
export async function deleteServiceToStylistdAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const serviceOfferedService = await getServiceOfferedService()
    // Serviciul se ocupă de validarea ID-ului
    await serviceOfferedService.deleteaddServiceToStylist(rawData)

    const stylistId = rawData.stylist_id as string
    revalidatePath(SERVICES_OFFERED_CONSTANTS.PATHS.revalidate.stylistServices(stylistId))

    return { success: true, message: SERVICES_OFFERED_CONSTANTS.MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, SERVICES_OFFERED_CONSTANTS.MESSAGES.ERROR.SERVER.DELETE)
  }
}

export async function findServiceToStylistAction(stylistId: string): Promise<ActionResponse<ServiceOffered[]>> {
  if (!stylistId) {
    return { success: false, message: 'ID-ul stilistului este necesar.' }
  }

  try {
    const serviceOfferedService = await getServiceOfferedService()
    const data = await serviceOfferedService.findOfferedServicesByStylist(stylistId)

    return { success: true, data }
  } catch (error) {
    return handleError(error, SERVICES_OFFERED_CONSTANTS.MESSAGES.ERROR.SERVER.FIND_BY_STYLIST)
  }
}
