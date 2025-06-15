// src/core/domains/services/service.types.ts (Varianta refactorizată)

import { z } from 'zod'
import { Tables, TablesUpdate } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue, zIntFromForm, zPriceFromForm, zStringMin } from '@/config/validation/fields'

// --- Tipuri de Bază Derivate din DB ---

/** Tipul unui serviciu complet, așa cum există în baza de date. */
export type Service = Tables<'services'>

/** Tipul datelor necesare pentru un UPDATE în baza de date. */
export type ServiceUpdateData = TablesUpdate<'services'>

// --- Scheme de Validare Zod ---

/** * Schema pentru CREAREA unui nou serviciu.
 * Câmpurile (name, description etc.) se potrivesc cu coloanele din baza de date.
 */
export const createServiceSchema = z.object({
  name: zStringMin(1, 'Numele serviciului este obligatoriu.'),
  description: z.string().nullable(),
  duration_minutes: zIntFromForm('Durata trebuie să fie un număr întreg pozitiv.'),
  price: zPriceFromForm('Prețul este obligatoriu.'), // Presupunem că zPriceFromForm gestionează și validarea de non-null
  is_active: zBooleanCheckboxDefaultTrue,
  category: z.string().nullable(),
})

/** * Schema pentru ACTUALIZAREA unui serviciu. Extinde schema de creare și adaugă ID-ul.
 * Toate câmpurile, în afara ID-ului, ar trebui să fie opționale la update.
 */
export const updateServiceSchema = createServiceSchema.partial().extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

/** Schema pentru ȘTERGEREA unui serviciu, acum ca obiect pentru consistență. */
export const deleteServiceSchema = z.object({
  id: z.string().uuid('ID-ul serviciului trebuie să fie un UUID valid.'),
})

// --- Tipuri Derivate din Schemele Zod ---

// Redenumit din AddServiceInput pentru consistență
export type CreateServiceInput = z.infer<typeof createServiceSchema>
// Tipul pentru creare este acum derivat direct din schema. Nu mai este nevoie de Omit.
export type ServiceCreateData = CreateServiceInput

// Redenumit din EditServiceInput
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
export type DeleteServiceInput = z.infer<typeof deleteServiceSchema>

/**
 * Definește payload-ul complet pentru metoda de update din repository.
 */
export type ServiceUpdatePayload = {
  id: string
  data: ServiceUpdateData
}
