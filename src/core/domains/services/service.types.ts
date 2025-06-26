import { z } from 'zod'
import { Tables, TablesUpdate } from '@/types/database.types'
import { SERVICE_CONSTANTS } from './service.constants'
import { zBooleanCheckboxDefaultTrue } from '@/config/validation/fields'

// --- Tipuri de Bază Derivate din DB ---

/** Tipul unui serviciu complet, așa cum există în baza de date. */
export type Service = Tables<'services'>

/** Tipul datelor necesare pentru un UPDATE în tabela 'services'. */
export type ServiceUpdateData = TablesUpdate<'services'>

// --- Scheme de Validare Zod ---

/**
 * Schema de bază pentru validarea câmpurilor unui serviciu.
 * Câmpurile corespund cu cele din baza de date pentru a simplifica operațiunile.
 */
export const serviceSchema = z.object({
  name: z.string().trim().min(1, 'Numele este obligatoriu.').max(SERVICE_CONSTANTS.FORM_CONSTRAINTS.NAME_MAX_LENGTH),

  description: z.string().max(SERVICE_CONSTANTS.FORM_CONSTRAINTS.DESCRIPTION_MAX_LENGTH).default(''), // Asigurăm că valoarea este mereu string, niciodată null

  duration_minutes: z.coerce // Convertește automat string-ul din formular în număr
    .number({ invalid_type_error: 'Introduceți o durată validă.' })
    .int()
    .min(SERVICE_CONSTANTS.FORM_CONSTRAINTS.DURATION.MIN),

  price: z.coerce
    .number({ invalid_type_error: 'Introduceți un preț valid.' })
    .nonnegative('Prețul nu poate fi negativ.')
    .max(SERVICE_CONSTANTS.FORM_CONSTRAINTS.PRICE.MAX),

  is_active: zBooleanCheckboxDefaultTrue, // Folosim un helper pentru consistență

  category: z.string().max(SERVICE_CONSTANTS.FORM_CONSTRAINTS.CATEGORY_MAX_LENGTH).default(''),
})

/** Schema pentru crearea unui serviciu este schema de bază. */
export const createServiceSchema = serviceSchema

/** Schema pentru actualizare adaugă ID-ul și face celelalte câmpuri opționale. */
export const updateServiceSchema = serviceSchema.partial().extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

/** Schema pentru ștergerea unui serviciu. */
export const deleteServiceSchema = z.object({
  id: z.string().uuid('ID-ul serviciului trebuie să fie un UUID valid.'),
})

// --- Tipuri Derivate din Schemele Zod ---

/** Tipul datelor de intrare din formularul de creare. */
export type CreateServiceInput = z.infer<typeof createServiceSchema>

/**
 * Tipul datelor pentru payload-ul de creare trimis la repository.
 * În acest caz, este identic cu `CreateServiceInput` deoarece câmpurile se potrivesc
 * cu cele din baza de date și nu necesită transformare.
 */
export type ServiceCreateData = CreateServiceInput

/** Tipul datelor de intrare din formularul de actualizare. */
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>

/** Tipul datelor de intrare din formularul de ștergere. */
export type DeleteServiceInput = z.infer<typeof deleteServiceSchema>

/**
 * Definește payload-ul complet pentru metoda de update din repository.
 */
export type ServiceUpdatePayload = {
  id: string
  data: ServiceUpdateData
}
