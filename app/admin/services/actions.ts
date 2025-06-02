// lib/db/service-actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import {
  fetchAllServices,
  insertService,
  updateService,
  deleteService,
  Service,
  addServiceSchema,
} from '@/lib/db/service-core'
import { extractServiceDataFromForm, formatZodErrors } from '@/utils/form'
import { ActionResponse } from '@/lib/types'
import { serviceInputSchema } from '@/lib/zod/schemas'

const logger = createLogger('ServiceActions')

const INITIAL_ACTION_RESPONSE: ActionResponse = {
  success: false,
  message: undefined,
  errors: undefined,
}

// Funcție helper pentru delay (pentru testare)
// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms))
// }

// ---------- GET Services ----------
export async function getServicesAction(): Promise<Service[]> {
  logger.debug('getServicesAction invoked: Fetching all services.')
  try {
    const services = await fetchAllServices()
    logger.info('getServicesAction: Successfully retrieved services.', { count: services.length })
    return services
  } catch (error) {
    logger.error('getServicesAction: Failed to fetch services.', {
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return []
  }
}

// ---------- ADD Service ----------
export async function addServiceAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  logger.debug('addServiceAction invoked: Attempting to add new service.', {
    formDataEntries: Object.fromEntries(formData.entries()),
  })
  try {
    const data = extractServiceDataFromForm(formData)
    const validated = addServiceSchema.parse(data)

    await insertService(validated)
    logger.info('addServiceAction: Successfully inserted new service.', { name: validated.name })

    revalidatePath('/admin/services')
    return { success: true, message: 'Serviciul a fost adăugat cu succes!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('addServiceAction: Validation failed during service addition.', { errors: error.flatten() })
      return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
    }

    logger.error('addServiceAction: Unexpected error during service addition.', {
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return { success: false, message: 'A eșuat adăugarea serviciului. Vă rugăm să încercați din nou.' }
  }
}

// ---------- UPDATE Service ----------
export async function editServiceAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  // await sleep(5000)
  const id = formData.get('id')

  if (typeof id !== 'string' || !id) {
    logger.warn('editServiceAction: Invalid service ID for update.', { id })
    return {
      success: false,
      message: 'ID-ul serviciului pentru actualizare este invalid.',
      errors: { _form: ['ID invalid pentru actualizare.'] },
    }
  }

  logger.debug('editServiceAction invoked: Attempting to update service.', {
    serviceId: id,
    formDataEntries: Object.fromEntries(formData.entries()),
  })
  try {
    const data = extractServiceDataFromForm(formData)
    const validated = serviceInputSchema.parse(data)

    await updateService(id, validated)
    logger.info('editServiceAction: Successfully updated service.', { id })

    revalidatePath('/admin/services')
    return { success: true, message: 'Serviciul a fost actualizat cu succes!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('editServiceAction: Validation failed during service update.', {
        serviceId: id,
        errors: error.flatten(),
      })
      return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
    }

    logger.error('editServiceAction: Unexpected error during service update.', {
      serviceId: id,
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return { success: false, message: 'A eșuat actualizarea serviciului. Vă rugăm să încercați din nou.' }
  }
}

// ---------- DELETE Service ----------
export async function deleteServiceAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id')

  if (typeof id !== 'string' || !id) {
    return {
      success: false,
      message: 'ID-ul serviciului este invalid.',
      errors: { _form: ['ID-ul serviciului este invalid.'] },
    }
  }
  logger.debug('deleteServiceAction invoked: Attempting to delete service.', { serviceId: id })
  try {
    await deleteService(id)
    logger.info('deleteServiceAction: Successfully deleted service.', { id })

    revalidatePath('/admin/services')
    return { success: true, message: 'Serviciul a fost șters cu succes!' }
  } catch (error) {
    logger.error('deleteServiceAction: Unexpected error during service deletion.', {
      serviceId: id,
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return { success: false, message: 'A eșuat ștergerea serviciului. Vă rugăm să încercați din nou.' }
  }
}

export async function deleteServiceActionForm(formData: FormData): Promise<void> {
  const response = await deleteServiceAction(INITIAL_ACTION_RESPONSE, formData)
  logger.debug('deleteServiceActionForm completed', { response })
}

export async function editServiceActionForm(formData: FormData): Promise<void> {
  const response = await editServiceAction(INITIAL_ACTION_RESPONSE, formData)
  logger.debug('editServiceActionForm completed', { response })
}
