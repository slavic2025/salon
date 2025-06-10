// src/features/services-offered/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
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

const logger = createLogger('ServicesOfferedActions')
const REVALIDATION_PATH = (stylistId: string) => `/admin/stylists/${stylistId}/services`

/**
 * Acțiune pentru adăugarea unui serviciu la un stilist.
 */
export async function addServiceToStylistAction(
  stylistId: string,
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  logger.debug('addServiceToStylistAction invoked', { stylistId })

  if (!z.string().uuid().safeParse(stylistId).success) {
    return { success: false, message: 'ID-ul stilistului este invalid.' }
  }

  const rawData = formDataToObject(formData)
  const validationResult = addOfferedServiceSchema.safeParse(rawData)

  if (!validationResult.success) {
    const errors = formatZodErrors(validationResult.error)
    logger.warn('Validation failed for addServiceToStylistAction', { errors })
    return { success: false, message: 'Eroare de validare.', errors }
  }

  try {
    const isDuplicate = await servicesOfferedRepository.checkUniqueness(stylistId, validationResult.data.service_id)
    if (isDuplicate) {
      return {
        success: false,
        message: 'Acest serviciu este deja oferit de stilist.',
        errors: { service_id: ['Acest serviciu este deja asociat.'] },
      }
    }

    await servicesOfferedRepository.create({ ...validationResult.data, stylist_id: stylistId })

    revalidatePath(REVALIDATION_PATH(stylistId))
    return { success: true, message: 'Serviciul a fost adăugat cu succes stilistului!' }
  } catch (error) {
    logger.error('Error in addServiceToStylistAction', { error })
    return { success: false, message: 'A apărut o eroare de server la adăugarea serviciului.' }
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
    return { success: false, message: 'Eroare de validare.', errors }
  }

  const { id, stylist_id, ...dataToUpdate } = validationResult.data

  try {
    await servicesOfferedRepository.update(id, dataToUpdate)
    revalidatePath(REVALIDATION_PATH(stylist_id))
    return { success: true, message: 'Serviciul oferit a fost actualizat cu succes!' }
  } catch (error) {
    logger.error('Error in updateOfferedServiceAction', { error })
    return { success: false, message: 'A apărut o eroare de server la actualizarea serviciului.' }
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

  const idValidation = deleteOfferedServiceSchema.safeParse(id)
  if (!idValidation.success) {
    return { success: false, message: 'ID-ul pentru ștergere este invalid.' }
  }
  if (typeof stylistId !== 'string' || !z.string().uuid().safeParse(stylistId).success) {
    return { success: false, message: 'Contextul stilistului este invalid pentru revalidare.' }
  }

  try {
    await servicesOfferedRepository.remove(idValidation.data)
    revalidatePath(REVALIDATION_PATH(stylistId))
    return { success: true, message: 'Serviciul a fost eliminat cu succes de la stilist!' }
  } catch (error) {
    logger.error('Error in deleteOfferedServiceAction', { error })
    return { success: false, message: 'A apărut o eroare de server la ștergerea serviciului.' }
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
