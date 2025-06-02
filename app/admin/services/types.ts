// app/admin/services/types.ts
import { ActionResponse as GenericActionResponse } from '@/lib/types'
import { Tables, TablesInsert } from '@/types/database.types' // Importă tipurile Supabase

export type ServiceData = Tables<'services'>
export type ServiceFormDataType = Omit<TablesInsert<'services'>, 'id' | 'created_at' | 'updated_at'>
export type ServiceActionResponse = GenericActionResponse<Partial<Record<keyof ServiceData, string[]>>>

export const INITIAL_FORM_STATE: ServiceActionResponse = {
  success: false,
  message: undefined,
  errors: undefined,
}
