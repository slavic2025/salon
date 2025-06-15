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

/**
 * Schema pentru CREAREA unui nou stilist.
 * Câmpurile (full_name, etc.) se potrivesc cu coloanele din baza de date.
 */
export const createStylistSchema = z.object({
  full_name: zStringMin(3, 'Numele stilistului trebuie să aibă minim 3 caractere.'),
  email: zEmailRequired,
  phone: zPhoneRequired.nullable(),
  description: zStringMin(1, 'Descrierea este obligatorie.').nullable(),
  is_active: zBooleanCheckboxDefaultTrue,
  // profile_id, profile_picture, etc. nu sunt incluse aici deoarece
  // sunt gestionate de alte procese (ex: la invitarea user-ului).
})

/**
 * Schema pentru ACTUALIZAREA unui stilist. Extinde schema de creare și adaugă ID-ul.
 * Folosim .partial() pentru a face toate câmpurile din createStylistSchema opționale.
 */
export const updateStylistSchema = createStylistSchema.partial().extend({
  id: z.string().uuid({ message: 'ID-ul stilistului este invalid.' }),
})

/** Schema pentru ȘTERGEREA unui stilist, acum ca obiect pentru consistență. */
export const deleteStylistSchema = z.object({
  id: z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.'),
})

/** Schema pentru trimiterea unei invitații, care este o acțiune separată. */
export const inviteStylistSchema = z.object({
  full_name: z.string().min(3, { message: 'Numele este obligatoriu.' }),
  email: z.string().email({ message: 'Adresa de email este invalidă.' }),
  phone: zPhoneRequired.nullable(),
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
/** Tipul pentru datele de intrare în formularul de invitare. */
export type InviteStylistInput = z.infer<typeof inviteStylistSchema>

/**
 * Definește payload-ul complet pentru metoda de update din repository.
 */
export type StylistUpdatePayload = {
  id: string
  data: StylistUpdateData
}
