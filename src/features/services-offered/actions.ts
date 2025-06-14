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
import { SERVICES_OFFERED_MESSAGES, SERVICES_OFFERED_PATHS } from './constants'
import { validateStylistId, validateDeleteContext, handleDuplicateError } from './utils'

const logger = createLogger('ServicesOfferedActions')

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
    const errors = formatZodErrors(validationResult.error)
    logger.warn('Validation failed for addServiceToStylistAction', { errors })
    return {
      success: false,
      message: SERVICES_OFFERED_MESSAGES.ERROR.VALIDATION,
      errors,
    }
  }

  try {
    const isDuplicate = await servicesOfferedRepository.checkUniqueness(stylistId, validationResult.data.service_id)

    if (isDuplicate) {
      return handleDuplicateError()
    }

    await servicesOfferedRepository.create({
      ...validationResult.data,
      stylist_id: stylistId,
    })

    revalidatePath(SERVICES_OFFERED_PATHS.revalidation(stylistId))
    return {
      success: true,
      message: SERVICES_OFFERED_MESSAGES.SUCCESS.ADDED,
    }
  } catch (error) {
    logger.error('Error in addServiceToStylistAction', { error })
    return {
      success: false,
      message: SERVICES_OFFERED_MESSAGES.ERROR.SERVER.ADD,
    }
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
    const errors = formatZodErrors(validationResult.error)
    logger.warn('Validation failed for updateOfferedServiceAction', { errors })
    return {
      success: false,
      message: SERVICES_OFFERED_MESSAGES.ERROR.VALIDATION,
      errors,
    }
  }

  const { id, stylist_id, ...dataToUpdate } = validationResult.data

  try {
    await servicesOfferedRepository.update(id, dataToUpdate)
    revalidatePath(SERVICES_OFFERED_PATHS.revalidation(stylist_id))
    return {
      success: true,
      message: SERVICES_OFFERED_MESSAGES.SUCCESS.UPDATED,
    }
  } catch (error) {
    logger.error('Error in updateOfferedServiceAction', { error })
    return {
      success: false,
      message: SERVICES_OFFERED_MESSAGES.ERROR.SERVER.UPDATE,
    }
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
    await servicesOfferedRepository.remove(validId)
    revalidatePath(SERVICES_OFFERED_PATHS.revalidation(validStylistId))
    return {
      success: true,
      message: SERVICES_OFFERED_MESSAGES.SUCCESS.DELETED,
    }
  } catch (error) {
    logger.error('Error in deleteOfferedServiceAction', { error })
    return {
      success: false,
      message: SERVICES_OFFERED_MESSAGES.ERROR.SERVER.DELETE,
    }
  }
}

// --- Acțiuni de Fetch ---

/**
 * Preia toate serviciile oferite de un stilist specific.
 */
export async function getServicesOfferedByStylistAction(stylistId: string) {
  try {
    return await servicesOfferedRepository.fetchByStylistId(stylistId)
  } catch (error) {
    logger.error('getServicesOfferedByStylistAction failed', { stylistId, error })
    return []
  }
}

/**
 * Preia toate serviciile generale disponibile în salon.
 */
export async function getAllAvailableServicesAction(): Promise<Tables<'services'>[]> {
  try {
    return await serviceRepository.fetchAll()
  } catch (error) {
    logger.error('getAllAvailableServicesAction failed', { error })
    return []
  }
}
