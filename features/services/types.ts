// app/admin/services/types.ts
import { ActionResponse as GenericActionResponse } from '@/lib/types'
import { zBooleanCheckboxDefaultTrue, zIntFromForm, zPriceFromForm, zStringMin } from '@/lib/zod/fields'
import { Tables, TablesInsert } from '@/types/database.types' // Importă tipurile Supabase
import { z } from 'zod'

export type ServiceData = Tables<'services'>
export type ServiceFormDataType = Omit<TablesInsert<'services'>, 'id' | 'created_at' | 'updated_at'>
export type ServiceActionResponse = GenericActionResponse<Partial<Record<keyof ServiceData, string[]>>>

export const addServiceSchema = z.object({
  name: zStringMin(1, 'Numele serviciului este obligatoriu.'),
  description: zStringMin(1, 'Descrierea serviciului este obligatorie.'),
  duration_minutes: zIntFromForm('Durata trebuie să fie un număr întreg pozitiv.'),
  price: zPriceFromForm,
  is_active: zBooleanCheckboxDefaultTrue,

  category: zStringMin(1, 'Categoria serviciului este obligatorie.'),
})

export const editServiceSchema = addServiceSchema.extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})
