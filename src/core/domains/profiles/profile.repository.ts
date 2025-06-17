import 'server-only'
import { createLogger } from '@/lib/logger'
import { executeQuery } from '@/lib/db-helpers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from './profile.types'

export function createProfileRepository(supabase: SupabaseClient) {
  const logger = createLogger('ProfileRepository')
  const TABLE_NAME = 'profiles'

  return {
    /**
     * Găsește un profil după ID pentru a-i verifica existența și rolul.
     */
    async findById(id: string): Promise<Profile | null> {
      logger.debug(`Fetching profile by id: ${id}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('id', id).maybeSingle()
      return executeQuery<Profile>(logger, query, { context: 'findProfileById' })
    },
  }
}
