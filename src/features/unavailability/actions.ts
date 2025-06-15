'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { unavailabilityRepository } from '@/core/domains/unavailability/unavailability.repository'
import {
  unavailabilitySchema,
  deleteUnavailabilitySchema,
  updateUnavailabilitySchema,
  Unavailability,
} from '@/core/domains/unavailability/unavailability.types'
import { ActionResponse } from '@/types/actions.types'
import { formDataToObject } from '@/lib/form-utils'
import { UNAVAILABILITY_MESSAGES, UNAVAILABILITY_PATHS } from '@/core/domains/unavailability/unavailability.constants'
import { handleError, handleValidationError } from '@/lib/action-helpers'
import { UnavailabilityService } from '@/core/domains/unavailability/unavailability.service'

const logger = createLogger('UnavailabilityActions')
const unavailabilityService = new UnavailabilityService()

/**
 * Acțiune pentru adăugarea unei noi perioade de indisponibilitate.
 */
export async function addUnavailabilityAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())
  const validationResult = unavailabilitySchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  try {
    const data = {
      ...validationResult.data,
      start_datetime: validationResult.data.start_datetime.toISOString(),
      end_datetime: validationResult.data.end_datetime.toISOString(),
    }
    await unavailabilityService.createUnavailability(data)
    revalidatePath(UNAVAILABILITY_PATHS.revalidation())
    return { success: true, message: UNAVAILABILITY_MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    return handleError(error, 'addUnavailabilityAction')
  }
}

/**
 * Acțiune pentru editarea unei perioade de indisponibilitate existente.
 */
export async function editUnavailabilityAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('editUnavailabilityAction invoked', { rawData })

  const validationResult = updateUnavailabilitySchema.safeParse(rawData)
  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  const { id, ...rest } = validationResult.data
  const dataToUpdate = {
    ...rest,
    start_datetime: rest.start_datetime.toISOString(),
    end_datetime: rest.end_datetime.toISOString(),
  }

  try {
    await unavailabilityService.updateUnavailability(id, dataToUpdate)
    revalidatePath(UNAVAILABILITY_PATHS.revalidation())
    return { success: true, message: UNAVAILABILITY_MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    return handleError(error, 'editUnavailabilityAction')
  }
}

/**
 * Acțiune pentru ștergerea unei perioade de indisponibilitate.
 */
export async function deleteUnavailabilityAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const unavailabilityId = formData.get('id')
  const validationResult = deleteUnavailabilitySchema.safeParse(unavailabilityId)
  if (!validationResult.success) {
    return { success: false, message: UNAVAILABILITY_MESSAGES.ERROR.VALIDATION.INVALID_ID }
  }

  const validUnavailabilityId = validationResult.data

  try {
    await unavailabilityService.deleteUnavailability(validUnavailabilityId)
    revalidatePath(UNAVAILABILITY_PATHS.revalidation())
    return { success: true, message: UNAVAILABILITY_MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, 'deleteUnavailabilityAction')
  }
}

/**
 * Acțiune pentru preluarea tuturor perioadelor de indisponibilitate.
 */
export async function getUnavailabilitiesAction(): Promise<Unavailability[]> {
  try {
    const unavailabilities = await unavailabilityRepository.fetchByStylistId('all')
    logger.info('Unavailabilities retrieved successfully', { count: unavailabilities.length })
    return unavailabilities
  } catch (error) {
    logger.error('Failed to fetch unavailabilities', { error })
    return []
  }
}

/**
 * Acțiune pentru preluarea perioadelor de indisponibilitate după stilist.
 */
export async function getUnavailabilitiesByStylistAction(stylistId: string) {
  if (!stylistId) {
    logger.warn('getUnavailabilitiesByStylistAction called with no stylistId')
    return { success: true, data: [] }
  }

  try {
    const unavailabilities = await unavailabilityRepository.fetchByStylistId(stylistId)
    return { success: true, data: unavailabilities }
  } catch (error) {
    return handleError(error, 'getUnavailabilitiesByStylistAction')
  }
}

/**
 * Acțiune pentru preluarea perioadelor de indisponibilitate după dată.
 */
export async function getUnavailabilitiesByDateAction(date: string) {
  if (!date) {
    logger.warn('getUnavailabilitiesByDateAction called with no date')
    return { success: true, data: [] }
  }

  try {
    const unavailabilities = await unavailabilityRepository.fetchByStylistId('all')
    const filteredUnavailabilities = unavailabilities.filter(
      (u) => u.start_datetime.startsWith(date) || u.end_datetime.startsWith(date)
    )
    return { success: true, data: filteredUnavailabilities }
  } catch (error) {
    return handleError(error, 'getUnavailabilitiesByDateAction')
  }
}

/**
 * Acțiune pentru preluarea perioadelor de indisponibilitate după interval de date.
 */
export async function getUnavailabilitiesByDateRangeAction(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    logger.warn('getUnavailabilitiesByDateRangeAction called with invalid date range', { startDate, endDate })
    return { success: true, data: [] }
  }

  try {
    const unavailabilities = await unavailabilityRepository.fetchByStylistId('all')
    const filteredUnavailabilities = unavailabilities.filter(
      (u) =>
        (u.start_datetime >= startDate && u.start_datetime <= endDate) ||
        (u.end_datetime >= startDate && u.end_datetime <= endDate)
    )
    return { success: true, data: filteredUnavailabilities }
  } catch (error) {
    return handleError(error, 'getUnavailabilitiesByDateRangeAction')
  }
}

/**
 * Acțiune pentru preluarea perioadelor de indisponibilitate recurente.
 */
export async function getRecurringUnavailabilitiesAction() {
  try {
    const unavailabilities = await unavailabilityRepository.fetchByStylistId('all')
    const recurringUnavailabilities = unavailabilities.filter((u) => u.type === 'recurring')
    return { success: true, data: recurringUnavailabilities }
  } catch (error) {
    return handleError(error, 'getRecurringUnavailabilitiesAction')
  }
}
