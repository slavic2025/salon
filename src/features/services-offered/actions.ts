// src/features/services-offered/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { formatZodErrors } from '@/lib/form'
import { ActionResponse } from '@/types/actions.types'
import {
  addOfferedServiceSchema,
  editOfferedServiceSchema,
  deleteOfferedServiceSchema,
} from '@/core/domains/services-offered/services-offered.types'
import { servicesOfferedRepository } from '@/core/domains/services-offered/services-offered.repository'
import { serviceRepository } from '@/core/domains/services/service.repository'
import { Tables } from '@/types/database.types'
import { formDataToObject } from '@/lib/form-utils'
import {
  SERVICES_OFFERED_MESSAGES,
  SERVICES_OFFERED_PATHS,
} from '@/core/domains/services-offered/services-offered.constants'
import { validateStylistId, validateDeleteContext, handleDuplicateError } from './utils'
import { ServicesOfferedService } from '@/core/domains/services-offered/services-offered.service'
import { handleValidationError, handleError, handleUniquenessErrors } from '@/lib/action-helpers'

const logger = createLogger('ServicesOfferedActions')
const servicesOfferedService = new ServicesOfferedService()

/**
 * Acțiune pentru adăugarea unui serviciu la un stilist.
 */
export async function addServiceToStylistAction(
  stylistId: string,
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  logger.debug('addServiceToStylistAction invoked', { stylistId })

  const validationError = validateStylistId(stylistId)
  if (validationError) return validationError

  const rawData = formDataToObject(formData)
  const validationResult = addOfferedServiceSchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  try {
    await servicesOfferedService.addServiceToStylist(stylistId, validationResult.data)
    revalidatePath(SERVICES_OFFERED_PATHS.revalidation(stylistId))
    return { success: true, message: SERVICES_OFFERED_MESSAGES.SUCCESS.ADDED }
  } catch (error: any) {
    if (error.message && error.message.includes('există deja')) {
      return handleUniquenessErrors([{ field: 'service_id', message: SERVICES_OFFERED_MESSAGES.ERROR.DUPLICATE }])
    }
    return handleError(error, SERVICES_OFFERED_MESSAGES.ERROR.SERVER.ADD)
  }
}

/**
 * Acțiune pentru actualizarea unui serviciu oferit.
 */
export async function updateOfferedServiceAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('updateOfferedServiceAction invoked', { rawData })

  const validationResult = editOfferedServiceSchema.safeParse(rawData)
  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  const { id, stylist_id, ...dataToUpdate } = validationResult.data

  try {
    await servicesOfferedService.updateOfferedService(id, dataToUpdate)
    revalidatePath(SERVICES_OFFERED_PATHS.revalidation(stylist_id))
    return { success: true, message: SERVICES_OFFERED_MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    return handleError(error, SERVICES_OFFERED_MESSAGES.ERROR.SERVER.UPDATE)
  }
}

/**
 * Acțiune pentru ștergerea unui serviciu oferit.
 */
export async function deleteOfferedServiceAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const id = formData.get('id')
  const stylistId = formData.get('stylist_id_for_revalidation')

  const validationResult = validateDeleteContext(id, stylistId)
  if ('success' in validationResult) {
    return validationResult
  }

  const { id: validId, stylistId: validStylistId } = validationResult

  try {
    await servicesOfferedService.deleteOfferedService(validId)
    revalidatePath(SERVICES_OFFERED_PATHS.revalidation(validStylistId))
    return { success: true, message: SERVICES_OFFERED_MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, SERVICES_OFFERED_MESSAGES.ERROR.SERVER.DELETE)
  }
}
