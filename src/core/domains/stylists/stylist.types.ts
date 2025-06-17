// src/core/domains/stylists/stylist.types.ts (Varianta refactorizată)

import { z } from 'zod'
import { Tables, TablesUpdate } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue, zEmailRequired, zPhoneRequired, zStringMin } from '@/config/validation/fields'

// --- Tipuri de Bază Derivate din DB ---

/** Tipul unui stilist complet, așa cum există în baza de date. */
export type Stylist = Tables<'stylists'>

/** Tipul datelor necesare pentru un UPDATE în baza de date. */
export type StylistUpdateData = TablesUpdate<'stylists'>

// --- Scheme de Validare Zod ---

/** Schema pentru ȘTERGEREA unui stilist, acum ca obiect pentru consistență. */
export const deleteStylistSchema = z.object({
  id: z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.'),
})

export const createStylistSchema = z.object({
  full_name: z.string().min(3, { message: 'Numele este obligatoriu.' }),
  email: z.string().email({ message: 'Adresa de email este invalidă.' }),
  phone: zPhoneRequired.nullable(),
  // Adăugăm și celelalte câmpuri necesare la creare, dar care nu sunt în formularul de invitație
  description: z.string().nullable().default(''), // Putem adăuga valori default
  is_active: z.boolean().default(true),
})

/**
 * Schema pentru ACTUALIZAREA unui stilist. Extinde schema de creare și adaugă ID-ul.
 * Folosim .partial() pentru a face toate câmpurile din createStylistSchema opționale.
 */
export const updateStylistSchema = createStylistSchema.partial().extend({
  id: z.string().uuid({ message: 'ID-ul stilistului este invalid.' }),
})
// --- Tipuri Derivate din Schemele Zod ---

/** Tipul pentru datele de intrare în formularul de creare. */
export type CreateStylistInput = z.infer<typeof createStylistSchema>
/**
 * Tipul pentru datele de CREARE (folosit de repository.create).
 * Acum este derivat direct din schemă, fiind singura sursă de adevăr.
 */
export type StylistCreateData = CreateStylistInput

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
