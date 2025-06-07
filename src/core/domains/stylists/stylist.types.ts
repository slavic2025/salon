// src/core/domains/stylists/stylist.types.ts
import { z } from 'zod'
import { Tables } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue, zEmailRequired, zPhoneRequired, zStringMin } from '@/config/validation/fields'

// 1. Tipul entității din baza de date
export type Stylist = Tables<'stylists'>

// 2. Schema Zod pentru ADĂUGARE este sursa de adevăr
export const addStylistSchema = z.object({
  name: zStringMin(3, 'Numele stilistului trebuie să aibă minim 3 caractere.'),
  email: zEmailRequired,
  phone: zPhoneRequired.nullable(),
  description: zStringMin(1, 'Descrierea stilistului este obligatorie.').nullable(),
  is_active: zBooleanCheckboxDefaultTrue,
})

// 3. Tipul pentru formularul de ADĂUGARE este derivat direct din schemă
export type AddStylistInput = z.infer<typeof addStylistSchema>

// 4. Schema Zod pentru EDITARE extinde schema de adăugare
export const editStylistSchema = addStylistSchema.extend({
  id: z.string().uuid({ message: 'ID-ul stilistului este invalid.' }),
})

// 5. Tipul pentru formularul de EDITARE este derivat direct din schemă
export type EditStylistInput = z.infer<typeof editStylistSchema>

// 6. Schema Zod pentru ȘTERGERE
export const deleteStylistSchema = z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.')
