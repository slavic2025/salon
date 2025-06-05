// app/admin/stylists/[id]/services/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { formatZodErrors } from '@/lib/form'
import { addOfferedServiceSchema, editOfferedServiceSchema, DeleteOfferedServiceSchema } from '@/lib/zod/schemas'
import {
  insertServiceOffered,
  updateServiceOffered,
  deleteServiceOffered,
  fetchServicesOfferedByStylist,
  servicesOfferedCrud, // Pentru update și delete, dacă folosim direct din generic
} from '@/lib/db/services-offered-core'
import { ServicesOfferedActionResponse, ServicesOfferedData, ServicesOfferedFormDataType } from './types'
import { extractServicesOfferedDataFromForm } from '@/lib/form'
import { Tables, TablesInsert } from '@/types/database.types'
import { INITIAL_FORM_STATE, ActionResponse } from '@/lib/types' // Import INITIAL_FORM_STATE
import { fetchAllServices } from '@/features/services/data-acces'

const logger = createLogger('ServicesOfferedActions')
const REVALIDATION_PATH = (stylistId: string) => `/admin/stylists/${stylistId}/services`

/**
 * Acțiune pentru adăugarea unui serviciu unui stilist.
 * stylistId este pasat ca argument separat, deoarece provine dinamic din ruta.
 */
export async function addServiceToStylistAction(
  stylistId: string, // ID-ul stilistului din parametrii rutei
  prevState: ServicesOfferedActionResponse,
  formData: FormData
): Promise<ServicesOfferedActionResponse> {
  logger.debug('addServiceToStylistAction invoked', {
    stylistId,
    formDataEntries: Object.fromEntries(formData.entries()),
  })

  if (!stylistId || typeof stylistId !== 'string' || !z.string().uuid().safeParse(stylistId).success) {
    logger.warn('addServiceToStylistAction: Invalid stylistId provided.', { stylistId })
    return {
      success: false,
      message: 'ID-ul stilistului este invalid.',
      errors: { _form: ['ID-ul stilistului este invalid.'] },
    }
  }

  try {
    const rawFormData = extractServicesOfferedDataFromForm(formData)
    // service_id ar trebui să fie în rawFormData dacă formularul include un select pentru servicii

    const validationResult = addOfferedServiceSchema.safeParse(rawFormData)

    if (!validationResult.success) {
      logger.warn('addServiceToStylistAction: Validation failed.', { errors: validationResult.error.flatten() })
      return {
        success: false,
        message: 'Eroare de validare. Verificați câmpurile.',
        errors: formatZodErrors(validationResult.error),
      }
    }

    const dataToInsert: Omit<TablesInsert<'services_offered'>, 'id' | 'created_at' | 'updated_at'> = {
      ...validationResult.data,
      stylist_id: stylistId, // Adaugă stylist_id aici
      // service_id este deja în validationResult.data datorită addOfferedServiceSchema
    }

    // Verificarea de unicitate este acum în interiorul insertServiceOffered
    await insertServiceOffered(dataToInsert)

    logger.info('Service successfully added to stylist.', { stylistId, serviceId: dataToInsert.service_id })
    revalidatePath(REVALIDATION_PATH(stylistId))
    return {
      success: true,
      message: 'Serviciul a fost adăugat cu succes stilistului!',
    }
  } catch (error) {
    logger.error('addServiceToStylistAction: Unexpected error.', {
      stylistId,
      errorMessage: (error as Error).message,
      error,
    })
    // Verificăm dacă mesajul erorii este cel specific de la verificarea de unicitate
    if ((error as Error).message.includes('Acest serviciu este deja oferit de stilist.')) {
      return {
        success: false,
        message: 'Acest serviciu este deja oferit de stilist.',
        errors: { service_id: ['Acest serviciu este deja asociat acestui stilist.'] },
      }
    }
    return {
      success: false,
      message: 'A apărut o eroare la adăugarea serviciului. Vă rugăm să încercați din nou.',
      errors: { _form: ['Eroare server.'] },
    }
  }
}

/**
 * Acțiune pentru actualizarea unui serviciu oferit de un stilist.
 */
export async function updateOfferedServiceAction(
  prevState: ServicesOfferedActionResponse,
  formData: FormData
): Promise<ServicesOfferedActionResponse> {
  const offeredServiceId = formData.get('id') as string | null
  const stylistId = formData.get('stylist_id') as string | null // stylist_id ar trebui să fie în FormData pentru context

  logger.debug('updateOfferedServiceAction invoked', {
    offeredServiceId,
    stylistId,
    formDataEntries: Object.fromEntries(formData.entries()),
  })

  if (!offeredServiceId || !z.string().uuid().safeParse(offeredServiceId).success) {
    logger.warn('updateOfferedServiceAction: Invalid offeredServiceId for update.', { offeredServiceId })
    return { success: false, message: 'ID-ul serviciului oferit este invalid.' }
  }
  if (!stylistId || !z.string().uuid().safeParse(stylistId).success) {
    logger.warn('updateOfferedServiceAction: Invalid stylistId for update context.', { stylistId })
    return { success: false, message: 'ID-ul stilistului este invalid pentru contextul actualizării.' }
  }

  try {
    const rawFormData = extractServicesOfferedDataFromForm(formData)
    // editOfferedServiceSchema așteaptă id (PK-ul lui services_offered) și stylist_id
    const validationResult = editOfferedServiceSchema.safeParse(rawFormData)

    if (!validationResult.success) {
      logger.warn('updateOfferedServiceAction: Validation failed.', {
        offeredServiceId,
        errors: validationResult.error.flatten(),
      })
      return {
        success: false,
        message: 'Eroare de validare. Verificați câmpurile.',
        errors: formatZodErrors(validationResult.error),
      }
    }
    // service_id din validationResult.data nu ar trebui să fie modificat, doar celelalte câmpuri.
    // `updateServiceOffered` este funcția generică din servicesOfferedCrud.update
    await updateServiceOffered(offeredServiceId, validationResult.data)

    logger.info('Offered service successfully updated.', { offeredServiceId, stylistId })
    revalidatePath(REVALIDATION_PATH(stylistId))
    return {
      success: true,
      message: 'Detaliile serviciului oferit au fost actualizate cu succes!',
    }
  } catch (error) {
    logger.error('updateOfferedServiceAction: Unexpected error.', {
      offeredServiceId,
      stylistId,
      errorMessage: (error as Error).message,
      error,
    })
    return {
      success: false,
      message: 'A apărut o eroare la actualizarea serviciului. Vă rugăm să încercați din nou.',
      errors: { _form: ['Eroare server.'] },
    }
  }
}

/**
 * Acțiune pentru ștergerea unui serviciu oferit de un stilist.
 * Necesită stylistId pentru revalidare.
 */
export async function deleteOfferedServiceAction(
  // stylistId este necesar pentru revalidatePath
  // Îl putem adăuga ca un câmp ascuns în formularul de ștergere
  // sau dacă acțiunea este apelată dintr-un context unde stylistId e cunoscut, îl putem pasa.
  // Pentru simplitate, presupunem că va fi în FormData.
  prevState: ActionResponse, // Folosim ActionResponse generic aici
  formData: FormData
): Promise<ActionResponse> {
  const offeredServiceId = formData.get('id') as string | null
  const stylistId = formData.get('stylist_id_for_revalidation') as string | null // Câmp nou pentru revalidare

  logger.debug('deleteOfferedServiceAction invoked', { offeredServiceId, stylistId })

  if (!offeredServiceId || !DeleteOfferedServiceSchema.safeParse(offeredServiceId).success) {
    logger.warn('deleteOfferedServiceAction: Invalid ID for deletion.', { offeredServiceId })
    return { success: false, message: 'ID invalid pentru ștergere.' }
  }
  if (!stylistId || !z.string().uuid().safeParse(stylistId).success) {
    logger.warn('deleteOfferedServiceAction: Invalid stylistId for revalidation.', { stylistId })
    // Chiar dacă ștergerea ar reuși, revalidarea ar eșua sau ar fi incorectă.
    return { success: false, message: 'Context invalid pentru revalidarea paginii.' }
  }

  try {
    await deleteServiceOffered(offeredServiceId) // Funcția din services-offered-core
    logger.info('Offered service successfully deleted.', { offeredServiceId, stylistId })
    revalidatePath(REVALIDATION_PATH(stylistId))
    return {
      success: true,
      message: 'Serviciul a fost eliminat cu succes de la stilist!',
    }
  } catch (error) {
    logger.error('deleteOfferedServiceAction: Unexpected error.', {
      offeredServiceId,
      stylistId,
      errorMessage: (error as Error).message,
      error,
    })
    return {
      success: false,
      message: 'A apărut o eroare la ștergerea serviciului. Vă rugăm să încercați din nou.',
      errors: { _form: ['Eroare server.'] },
    }
  }
}

// --- Acțiuni de Fetch ---

/**
 * Preia toate serviciile oferite de un stilist specific.
 * Include detalii despre serviciul de bază.
 */
export async function getServicesOfferedByStylistAction(stylistId: string): Promise<ServicesOfferedData[]> {
  logger.debug('getServicesOfferedByStylistAction invoked', { stylistId })
  if (!stylistId || typeof stylistId !== 'string' || !z.string().uuid().safeParse(stylistId).success) {
    logger.warn('getServicesOfferedByStylistAction: Invalid stylistId provided.', { stylistId })
    return []
  }
  try {
    const services = await fetchServicesOfferedByStylist(stylistId)
    logger.info('Successfully fetched services offered by stylist.', { stylistId, count: services.length })
    return services
  } catch (error) {
    logger.error('getServicesOfferedByStylistAction: Failed to fetch services for stylist.', {
      stylistId,
      errorMessage: (error as Error).message,
    })
    return [] // Sau aruncă eroarea dacă vrei să o gestionezi explicit în componentă
  }
}

/**
 * Preia toate serviciile generale disponibile în salon.
 * Util pentru a popula un dropdown/select în dialogul de adăugare a unui serviciu la stilist.
 */
export async function getAllAvailableServicesAction(): Promise<Tables<'services'>[]> {
  logger.debug('getAllAvailableServicesAction invoked')
  try {
    // Presupunând că ai o funcție fetchAllServices în service-core.ts
    const services = await fetchAllServices()
    logger.info('Successfully fetched all available services.', { count: services.length })
    return services
  } catch (error) {
    logger.error('getAllAvailableServicesAction: Failed to fetch all available services.', {
      errorMessage: (error as Error).message,
    })
    return []
  }
}
