// src/core/domains/stylists/stylist.types.ts

import { z } from 'zod'
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue, zEmailRequired, zPhoneRequired, zStringMin } from '@/config/validation/fields'

// Tipul de bază pentru datele unui stilist, cum vin din DB
export type Stylist = Tables<'stylists'>

// Tipul pentru datele primite la creare. Omit câmpurile auto-generate.
export type StylistCreateData = Omit<
  TablesInsert<'stylists'>,
  'id' | 'created_at' | 'updated_at' | 'profile_id' | 'profile_picture'
>

// Tipul pentru datele primite la actualizare. Toate câmpurile sunt opționale.
export type StylistUpdateData = TablesUpdate<'stylists'>

// Schema Zod pentru adăugarea unui stilist.
export const addStylistSchema = z.object({
  name: zStringMin(3, 'Numele stilistului trebuie să aibă minim 3 caractere.'),
  email: zEmailRequired,
  phone: zPhoneRequired,
  description: zStringMin(1, 'Descrierea stilistului este obligatorie.'),
  is_active: zBooleanCheckboxDefaultTrue,
})

// Schema Zod pentru editarea unui stilist. Extinde schema de adăugare cu ID.
export const editStylistSchema = addStylistSchema.extend({
  id: z.string().uuid({ message: 'ID-ul stilistului este invalid.' }),
})

// Schema Zod pentru ștergerea unui stilist (validează doar ID-ul).
export const deleteStylistSchema = z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.')
