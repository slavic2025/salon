// src/core/domains/users/user.repository.ts

import 'server-only'
import { createClient } from '@/lib/supabase-server'
import { createLogger } from '@/lib/logger'
import type { UserProfile } from './user.types'

const logger = createLogger('UserRepository')

export const userRepository = {
  async fetchProfileById(id: string): Promise<UserProfile | null> {
    logger.debug(`Fetching profile for user id: ${id}`)
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('id, role') // Preluam doar ce ne trebuie
      .eq('id', id)
      .single()

    if (error) {
      logger.error('Error fetching user profile', { error })
      return null
    }

    return data
  },

  async update(id: string, data: Partial<UserProfile>): Promise<void> {
    logger.debug(`Updating profile for user id: ${id}`, { data })
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').update(data).eq('id', id)

    if (error) {
      logger.error('Error updating user profile', { error })
      throw error
    }
  },
}
