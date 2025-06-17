import type { Database } from '@/types/database.types'

/**
 * Definește tipul unui rând din tabela `profiles`.
 * Conține doar ID-ul utilizatorului și rolul său în aplicație.
 */
export type Profile = Database['public']['Tables']['profiles']['Row']

/**
 * Definește tipul datelor necesare pentru a crea un nou profil.
 * De obicei, Supabase creează acest rând automat printr-un trigger la sign-up.
 */
export type ProfileCreateData = Database['public']['Tables']['profiles']['Insert']

/**
 * Definește tipul datelor pentru actualizarea unui profil (ex: schimbarea rolului).
 */
export type ProfileUpdateData = Database['public']['Tables']['profiles']['Update']
