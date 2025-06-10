// src/core/domains/services/service.types.ts

import { z } from 'zod'
import { Tables, TablesInsert, TablesUpdate } from '@/types/database.types' // Corect: importă din alt fișier
import { zBooleanCheckboxDefaultTrue, zIntFromForm, zPriceFromForm, zStringMin } from '@/config/validation/fields'

export type Service = Tables<'services'>
export type ServiceCreateData = Omit<TablesInsert<'services'>, 'id' | 'created_at' | 'updated_at'>
export type ServiceUpdateData = TablesUpdate<'services'>

export const addServiceSchema = z.object({
  name: zStringMin(1, 'Numele serviciului este obligatoriu.'),
  description: z.string().nullable(),
  duration_minutes: zIntFromForm('Durata trebuie să fie un număr întreg pozitiv.'),
  price: zPriceFromForm.refine((val) => val !== null, { message: 'Prețul este obligatoriu.' }),
  is_active: zBooleanCheckboxDefaultTrue,
  category: z.string().nullable(),
})

export type AddServiceInput = z.infer<typeof addServiceSchema>

export const editServiceSchema = addServiceSchema.extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

export type EditServiceInput = z.infer<typeof editServiceSchema>

export const deleteServiceSchema = z.string().uuid('ID-ul serviciului trebuie să fie un UUID valid.')
