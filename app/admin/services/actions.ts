// actions/services.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'

import {
  fetchAllServices,
  insertService,
  updateService,
  deleteService,
  Service,
  addServiceSchema,
  serviceInputSchema,
} from '@/lib/db/services'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ServiceActions')

// Definim un tip de răspuns pentru Server Actions
export type ActionResponse = {
  success: boolean
  message?: string
  errors?: Record<string, string[]> // Pentru erori de validare structurate
}

// Funcție helper pentru extragerea și conversia datelor din FormData
function extractServiceData(formData: FormData): z.infer<typeof addServiceSchema> {
  return {
    name: formData.get('name')?.toString() ?? '',
    description: formData.get('description')?.toString() ?? '',
    duration_minutes: Number(formData.get('duration_minutes') ?? 0),
    price: Number(formData.get('price') ?? 0),
    is_active: formData.get('is_active') === 'on',
    category: formData.get('category')?.toString() ?? '',
  }
}

// Helper pentru a formata erorile Zod
function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  error.errors.forEach((err) => {
    if (err.path && err.path.length > 0) {
      const fieldName = err.path.join('.')
      fieldErrors[fieldName] = fieldErrors[fieldName] ? [...fieldErrors[fieldName], err.message] : [err.message]
    }
  })
  return fieldErrors
}

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
    return [] // Returnează un array gol în caz de eroare pentru a evita blocarea UI-ului
  }
}

// ---------- ADD Service ----------
// NOTĂ: Am adăugat `_prevState: ActionResponse` ca prim argument conform cerințelor useFormState.
// Nu-l folosim direct în logică, de aceea este prefixat cu '_'.
export async function addServiceAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  logger.debug('addServiceAction invoked: Attempting to add new service.', {
    formDataEntries: Object.fromEntries(formData.entries()),
  })
  try {
    const data = extractServiceData(formData)
    const validated = addServiceSchema.parse(data) // Zod va arunca eroarea aici dacă validarea eșuează

    await insertService(validated)
    logger.info('addServiceAction: Successfully inserted new service.', { name: validated.name })

    revalidatePath('/admin/services') // Invalidează cache-ul pentru lista de servicii
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
// NOTĂ: Am adăugat `_prevState: ActionResponse` ca prim argument conform cerințelor useFormState.
// `id` este acum al doilea argument (pasat prin wrapper), iar `formData` este al treilea.
export async function editServiceAction(
  _prevState: ActionResponse,
  id: string,
  formData: FormData
): Promise<ActionResponse> {
  logger.debug('editServiceAction invoked: Attempting to update service.', {
    serviceId: id,
    formDataEntries: Object.fromEntries(formData.entries()),
  })
  try {
    const data = extractServiceData(formData)
    const validated = serviceInputSchema.parse(data) // Zod va arunca eroarea aici

    await updateService(id, validated)
    logger.info('editServiceAction: Successfully updated service.', { id })

    revalidatePath('/admin/services') // Invalidează cache-ul
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
// NOTĂ: Am adăugat `_prevState: ActionResponse` ca prim argument.
export async function deleteServiceAction(_prevState: ActionResponse, id: string): Promise<ActionResponse> {
  logger.debug('deleteServiceAction invoked: Attempting to delete service.', { serviceId: id })
  try {
    await deleteService(id)
    logger.info('deleteServiceAction: Successfully deleted service.', { id })

    revalidatePath('/admin/services') // Invalidează cache-ul
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
