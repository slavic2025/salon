// src/core/domains/stylists/stylist.types.ts (Varianta refactorizată)

import { z } from 'zod'
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue, zEmailRequired, zPhoneRequired, zStringMin } from '@/config/validation/fields'
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from '@/lib/constants'

// --- Tipuri de Bază Derivate din DB ---

/** Tipul unui stilist complet, așa cum există în baza de date (un rând). */
export type Stylist = Tables<'stylists'>

/**
 * Tipul datelor necesare pentru a CREA un stilist (folosit de .insert()).
 * Acesta este tipul corect, derivat direct din structura tabelei.
 */
export type StylistCreateData = TablesInsert<'stylists'>

/** Tipul datelor necesare pentru a ACTUALIZA un stilist (folosit de .update()). */
export type StylistUpdateData = TablesUpdate<'stylists'>

/** Schema pentru ȘTERGEREA unui stilist, acum ca obiect pentru consistență. */
export const deleteStylistSchema = z.object({
  id: z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.'),
})

export const createStylistFormSchema = z.object({
  id: z.string().uuid({ message: 'ID-ul stilistului este invalid.' }).optional(),
  full_name: z.string().min(3, { message: 'Numele este obligatoriu.' }),
  email: z.string().email({ message: 'Adresa de email este invalidă.' }),
  phone: zPhoneRequired,
  description: z.string(),
  is_active: z.boolean(),
  profile_picture: z
    .instanceof(File, { message: 'Te rugăm să încarci o imagine.' })
    .optional() // Facem câmpul opțional
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Dimensiunea maximă este 5MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Doar formatele .jpg, .jpeg, .png și .webp sunt acceptate.'
    ),
})

/**
 * Schema pentru ACTUALIZAREA unui stilist. Extinde schema de creare și adaugă ID-ul.
 * Folosim .partial() pentru a face toate câmpurile din createStylistSchema opționale.
 */
// Schema pentru actualizare
export const updateStylistSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(3).optional(),
  phone: z.string().nullable().optional(),
  email: z.string().email({ message: 'Adresa de email este invalidă.' }),
  is_active: z.boolean().optional(),
  profile_picture: z.instanceof(File).optional(),
  description: z.string(),
})
// --- Tipuri Derivate din Schemele Zod ---

/** Tipul pentru datele de intrare în formularul de creare. */
export type CreateStylistFormInput = z.infer<typeof createStylistFormSchema>
/**
 * Tipul pentru datele de CREARE (folosit de repository.create).
 * Acum este derivat direct din schemă, fiind singura sursă de adevăr.
 */

/** Tipul pentru datele de intrare în formularul de actualizare. */
export type UpdateStylistInput = z.infer<typeof updateStylistSchema>
/** Tipul pentru datele de intrare în formularul de ștergere. */
export type DeleteStylistInput = z.infer<typeof deleteStylistSchema>

/**
 * Definește payload-ul complet pentru metoda de update din repository.
 */
export type StylistUpdatePayload = {
  id: string
  data: StylistUpdateData
}
