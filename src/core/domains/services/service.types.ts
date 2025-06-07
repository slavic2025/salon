// src/core/domains/services/service.types.ts

import { z } from 'zod'
import { Tables } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue, zIntFromForm, zPriceFromForm, zStringMin } from '@/config/validation/fields'

/**
 * Tipul de bază pentru un rând din tabela 'services', generat de Supabase.
 */
export type Service = Tables<'services'>

/**
 * Schema Zod pentru validarea datelor la ADĂUGAREA unui nou serviciu.
 * Aceasta este sursa unică de adevăr pentru regulile de validare.
 */
export const addServiceSchema = z.object({
  name: zStringMin(1, 'Numele serviciului este obligatoriu.'),
  // Descrierea este opțională, dar dacă există, trebuie să fie un string.
  // Folosim .nullable() pentru a permite trimiterea valorii null la baza de date.
  description: z.string().nullable(),
  duration_minutes: zIntFromForm('Durata trebuie să fie un număr întreg pozitiv.'),
  price: zPriceFromForm,
  is_active: zBooleanCheckboxDefaultTrue,
  // Categoria este, de asemenea, opțională și poate fi null.
  category: z.string().nullable(),
})

/**
 * Tipul de date pentru formularul de ADĂUGARE, derivat automat din schema Zod.
 * Asigură că tipul și validatorul sunt mereu sincronizate.
 */
export type AddServiceInput = z.infer<typeof addServiceSchema>

/**
 * Schema Zod pentru validarea datelor la EDITAREA unui serviciu.
 * Extinde schema de adăugare și adaugă câmpul 'id'.
 */
export const editServiceSchema = addServiceSchema.extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

/**
 * Tipul de date pentru formularul de EDITARE, derivat automat.
 */
export type EditServiceInput = z.infer<typeof editServiceSchema>

/**
 * Schema Zod pentru ȘTERGEREA unui serviciu (validează doar ID-ul).
 */
export const deleteServiceSchema = z.string().uuid('ID-ul serviciului trebuie să fie un UUID valid.')
