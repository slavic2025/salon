// src/core/domains/services/service.types.ts
import { z } from 'zod'
import { Tables, TablesInsert } from '@/types/database.types'
import { zBooleanCheckboxDefaultTrue, zIntFromForm, zPriceFromForm, zStringMin } from '@/config/validation/fields'

// Tipul de bază pentru datele unui serviciu
export type Service = Tables<'services'>

// Tipul pentru datele de creare
export type ServiceCreateData = Omit<TablesInsert<'services'>, 'id' | 'created_at' | 'updated_at'>

// Tipul pentru datele de actualizare
export type ServiceUpdateData = Partial<ServiceCreateData>

// Schema Zod pentru adăugarea unui serviciu
export const addServiceSchema = z.object({
  name: zStringMin(1, 'Numele serviciului este obligatoriu.'),
  description: zStringMin(1, 'Descrierea serviciului este obligatorie.').nullable(),
  duration_minutes: zIntFromForm('Durata trebuie să fie un număr întreg pozitiv.'),
  price: zPriceFromForm,
  is_active: zBooleanCheckboxDefaultTrue,
  category: zStringMin(1, 'Categoria serviciului este obligatorie.').nullable(),
})

// Schema Zod pentru editarea unui serviciu
export const editServiceSchema = addServiceSchema.extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

// Schema Zod pentru ștergere
export const deleteServiceSchema = z.string().uuid('ID-ul serviciului trebuie să fie un UUID valid.')
