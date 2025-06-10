// src/core/domains/users/user.types.ts

import type { Database } from '@/types/database.types'

// Extragem tipul pentru un rând din tabela 'profiles'
type ProfileRow = Database['public']['Tables']['profiles']['Row']

// Definim UserProfile ca fiind un subset din ProfileRow,
// conținând doar câmpurile de care avem nevoie.
export type UserProfile = Pick<ProfileRow, 'id' | 'role'>
