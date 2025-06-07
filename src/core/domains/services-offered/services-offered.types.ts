// src/core/domains/services-offered/services-offered.types.ts

import { z } from 'zod'
import { Tables, TablesInsert } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue } from '@/config/validation/fields'

/**
 * Tipul de bază pentru un serviciu oferit, inclusiv detaliile (join) de la serviciul principal.
 */
export type ServiceOffered = Tables<'services_offered'> & {
  services?: Pick<
    Tables<'services'>,
    'name' | 'duration_minutes' | 'price' | 'description' | 'category' | 'is_active'
  > | null
}

/**
 * Schema Zod pentru ADĂUGAREA unei legături serviciu-stilist.
 */
export const addOfferedServiceSchema = z.object({
  service_id: z.string().uuid({ message: 'Trebuie să selectezi un serviciu valid.' }),
  // Preprocesăm valorile pentru a le transforma în numere sau null dacă sunt goale.
  custom_price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : parseFloat(String(val))),
    z.number().positive({ message: 'Prețul custom trebuie să fie un număr pozitiv.' }).multipleOf(0.01).nullable()
  ),
  custom_duration: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? null : parseInt(String(val), 10)),
    z.number().int().positive({ message: 'Durata custom trebuie să fie un număr întreg pozitiv.' }).nullable()
  ),
  is_active: zBooleanCheckboxDefaultTrue,
})

/**
 * Tipul pentru formularul de ADĂUGARE, derivat din schema Zod.
 */
export type AddOfferedServiceInput = z.infer<typeof addOfferedServiceSchema>

/**
 * Schema Zod pentru EDITAREA unei legături. Include și ID-urile necesare pentru context.
 */
export const editOfferedServiceSchema = addOfferedServiceSchema.extend({
  id: z.string().uuid({ message: 'ID-ul înregistrării este invalid.' }),
  stylist_id: z.string().uuid({ message: 'ID-ul stilistului este invalid.' }),
})

/**
 * Tipul pentru formularul de EDITARE, derivat din schema Zod.
 */
export type EditOfferedServiceInput = z.infer<typeof editOfferedServiceSchema>

/**
 * Schema Zod pentru ȘTERGEREA unei legături.
 */
export const deleteOfferedServiceSchema = z
  .string()
  .uuid('ID-ul asocierii serviciu-stilist trebuie să fie un UUID valid.')
