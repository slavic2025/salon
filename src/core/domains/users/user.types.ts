// src/core/domains/users/user.types.ts

import type { Database } from '@/types/database.types'
import { z } from 'zod'

// Extragem tipul pentru un rând din tabela 'profiles'
type ProfileRow = Database['public']['Tables']['profiles']['Row']

// Definim UserProfile ca fiind un subset din ProfileRow,
// conținând doar câmpurile de care avem nevoie.
export type UserProfile = Pick<ProfileRow, 'id' | 'role'> & {
  role: 'admin' | 'stylist' | 'client'
}

export const updateUserProfileSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['admin', 'stylist', 'client']),
})

export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>
