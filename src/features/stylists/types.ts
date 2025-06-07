// app/admin/stylists/types.ts
import { ActionResponse as GenericActionResponse } from '@/types/types'
import { Tables, TablesInsert } from '@/types/database.types'
import { z } from 'zod'
import { zBooleanCheckboxDefaultTrue, zEmailRequired, zPhoneRequired, zStringMin } from '@/config/validation/fields'
import { Stylist } from '@/core/domains/stylists/stylist.types'

export type StylistFormDataType = Omit<
  TablesInsert<'stylists'>,
  'id' | 'created_at' | 'updated_at' | 'profile_id' | 'profile_picture'
> & {
  is_active: boolean // Forțează boolean în loc de boolean | undefined
}
export type StylistActionResponse = GenericActionResponse<Partial<Record<keyof Stylist, string[]>>>

export const addStylistSchema = z.object({
  name: zStringMin(3, 'Numele stilistului trebuie să aibă minim 3 caractere.'),
  email: zEmailRequired,
  phone: zPhoneRequired,
  description: zStringMin(1, 'Descrierea stilistului este obligatorie.'),
  is_active: zBooleanCheckboxDefaultTrue,
})

export const editStylistSchema = addStylistSchema.extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

// ================= DELETE SCHEMAS =================
// Acestea validează direct ID-ul, nu un obiect complex.
export const deleteStylistSchema = z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.')
