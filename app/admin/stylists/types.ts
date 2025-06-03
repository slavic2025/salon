// app/admin/stylists/types.ts
import { ActionResponse as GenericActionResponse } from '@/lib/types'
import { Tables, TablesInsert } from '@/types/database.types'

export type StylistData = Tables<'stylists'>
export type StylistFormDataType = Omit<
  TablesInsert<'stylists'>,
  'id' | 'created_at' | 'updated_at' | 'profile_id' | 'profile_picture'
>

export type StylistActionResponse = GenericActionResponse<Partial<Record<keyof StylistData, string[]>>>
