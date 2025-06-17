// src/features/services/actions.ts (Varianta finală, refactorizată)
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createServiceRepository } from '@/core/domains/services/service.repository'
import { createServiceService } from '@/core/domains/services/service.service'
import { createServiceSchema, deleteServiceSchema, updateServiceSchema } from '@/core/domains/services/service.types'
import { SERVICE_CONSTANTS } from '@/core/domains/services/service.constants'
import { handleError, handleValidationError } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import type { ActionResponse } from '@/types/actions.types'

/**
 * Funcție ajutătoare care asamblează serviciul pentru 'services'
 * cu toate dependențele sale, pentru o singură cerere.
 */
async function getServiceService() {
  const supabase = await createClient()
  const repository = createServiceRepository(supabase)
  return createServiceService(repository)
}

/**
 * Acțiune pentru adăugarea unui nou serviciu.
 * Nu mai validează datele, ci doar le pasează serviciului.
 */
export async function addServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  // `formDataToObject` este mai bun decât `Object.fromEntries` deoarece poate gestiona valori multiple
  const rawData = formDataToObject(formData)

  try {
    const serviceService = await getServiceService()
    // Pasăm datele brute; serviciul este responsabil de validare.
    await serviceService.createService(rawData)

    revalidatePath(SERVICE_CONSTANTS.PATHS.revalidate.list())
    return { success: true, message: SERVICE_CONSTANTS.MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    // Prindem atât erorile de validare, cât și cele de business/server din serviciu.
    return handleError(error, SERVICE_CONSTANTS.MESSAGES.ERROR.SERVER.CREATE)
  }
}

/**
 * Acțiune pentru editarea unui serviciu existent.
 */
export async function editServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  // Validarea se va face în serviciu, dar putem extrage ID-ul aici
  const { id } = rawData
  if (!id || typeof id !== 'string') {
    return handleError(
      new Error(SERVICE_CONSTANTS.MESSAGES.ERROR.VALIDATION.INVALID_ID),
      SERVICE_CONSTANTS.MESSAGES.ERROR.VALIDATION.INVALID_ID
    )
  }

  try {
    const serviceService = await getServiceService()
    // Pasăm datele brute; serviciul va valida și va separa ce e de actualizat.
    await serviceService.updateService(rawData)

    revalidatePath(SERVICE_CONSTANTS.PATHS.revalidate.details(id))
    return { success: true, message: SERVICE_CONSTANTS.MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    return handleError(error, SERVICE_CONSTANTS.MESSAGES.ERROR.SERVER.UPDATE)
  }
}

/**
 * Acțiune pentru ștergerea unui serviciu.
 */
export async function deleteServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const { id } = formDataToObject(formData)
  if (!id || typeof id !== 'string') {
    return handleError(
      new Error(SERVICE_CONSTANTS.MESSAGES.ERROR.VALIDATION.INVALID_ID),
      SERVICE_CONSTANTS.MESSAGES.ERROR.VALIDATION.INVALID_ID
    )
  }

  try {
    const serviceService = await getServiceService()
    await serviceService.deleteService(id)

    revalidatePath(SERVICE_CONSTANTS.PATHS.revalidate.list())
    return { success: true, message: SERVICE_CONSTANTS.MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, SERVICE_CONSTANTS.MESSAGES.ERROR.SERVER.DELETE)
  }
}
