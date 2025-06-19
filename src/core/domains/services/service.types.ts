import { z } from 'zod'
import { Tables, TablesUpdate } from '@/types/database.types'
import { SERVICE_CONSTANTS } from './service.constants'

// --- Tipuri de Bază Derivate din DB ---
/** Tipul unui serviciu complet, așa cum există în baza de date. */
export type Service = Tables<'services'>
/** Tipul datelor necesare pentru un UPDATE în tabela 'services'. */
export type ServiceUpdateData = TablesUpdate<'services'>

/**
 * Schema pentru CREAREA/VALIDAREA unui serviciu.
 */
export const serviceSchema = z.object({
  name: z.string().trim().min(1, 'Numele este obligatoriu').max(SERVICE_CONSTANTS.FORM_CONSTRAINTS.NAME_MAX_LENGTH),
  description: z.string().max(SERVICE_CONSTANTS.FORM_CONSTRAINTS.DESCRIPTION_MAX_LENGTH),
  duration_minutes: z.coerce
    .number({ invalid_type_error: 'Introduceți o durată validă.' })
    .int()
    .min(SERVICE_CONSTANTS.FORM_CONSTRAINTS.DURATION.MIN),
  price: z.coerce
    .number({ invalid_type_error: 'Introduceți un preț valid.' })
    .nonnegative('Prețul nu poate fi negativ.')
    .max(SERVICE_CONSTANTS.FORM_CONSTRAINTS.PRICE.MAX),
  is_active: z.boolean(),
  category: z.string().max(SERVICE_CONSTANTS.FORM_CONSTRAINTS.CATEGORY_MAX_LENGTH),
})

/** Schema pentru creare este direct schema de bază */
export const createServiceSchema = serviceSchema

/** Schema pentru actualizare adaugă ID-ul și face celelalte câmpuri opționale */
export const updateServiceSchema = serviceSchema.partial().extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

/** Schema pentru ștergere */
export const deleteServiceSchema = z.object({
  id: z.string().uuid('ID-ul serviciului este invalid.'),
})

// --- Tipuri Derivate din Schemele Zod ---
export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type ServiceCreateData = CreateServiceInput

export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
export type DeleteServiceInput = z.infer<typeof deleteServiceSchema>

export type ServiceUpdatePayload = {
  id: string
  data: ServiceUpdateData
}
