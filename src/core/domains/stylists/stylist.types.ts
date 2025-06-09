// src/core/domains/stylists/stylist.types.ts

import { z } from 'zod'
// Importăm ajutoarele de tip pentru Insert și Update
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue, zEmailRequired, zPhoneRequired, zStringMin } from '@/config/validation/fields'

// Tipul entității din baza de date (ex: pentru fetch)
export type Stylist = Tables<'stylists'>

// --- TIPURI NOI PENTRU REPOSITORY ---
// Tipul pentru datele de CREARE (folosit de repository.create)
// Omit câmpurile auto-generate de DB și cele care nu vin din formularul de bază.
export type StylistCreateData = Omit<
  TablesInsert<'stylists'>,
  'id' | 'created_at' | 'updated_at' | 'profile_id' | 'profile_picture'
>

// Tipul pentru datele de ACTUALIZARE (folosit de repository.update)
// TablesUpdate are deja toate câmpurile opționale.
export type StylistUpdateData = TablesUpdate<'stylists'>
// ------------------------------------

// Schema Zod pentru ADĂUGARE (folosită în Server Actions pentru validarea formularului)
export const addStylistSchema = z.object({
  name: zStringMin(3, 'Numele stilistului trebuie să aibă minim 3 caractere.'),
  email: zEmailRequired,
  phone: zPhoneRequired.nullable(),
  description: zStringMin(1, 'Descrierea stilistului este obligatorie.').nullable(),
  is_active: zBooleanCheckboxDefaultTrue,
})

// Tipul pentru formularul de ADĂUGARE (derivat din schemă)
export type AddStylistInput = z.infer<typeof addStylistSchema>

// Schema Zod pentru EDITARE
export const editStylistSchema = addStylistSchema.extend({
  id: z.string().uuid({ message: 'ID-ul stilistului este invalid.' }),
})

// Tipul pentru formularul de EDITARE
export type EditStylistInput = z.infer<typeof editStylistSchema>

// Schema Zod pentru ȘTERGERE
export const deleteStylistSchema = z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.')

export const inviteSchema = z.object({
  name: z.string().min(3, { message: 'Numele este obligatoriu.' }),
  email: z.string().email({ message: 'Adresa de email este invalidă.' }),
})
