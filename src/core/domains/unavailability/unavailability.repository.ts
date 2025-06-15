// src/core/domains/unavailability/unavailability.repository.ts
'use server'

import { createClient } from '@/lib/supabase-server'
import { Unavailability, UnavailabilityCreateData } from './unavailability.types'
import { TablesUpdate } from '@/types/database.types'
import { createLogger } from '@/lib/logger'
import { UNAVAILABILITY_MESSAGES } from './unavailability.constants'

const logger = createLogger('UnavailabilityRepository')

async function handleSupabaseError<T>(promise: PromiseLike<{ data: T; error: any }>): Promise<T> {
  const { data, error } = await promise
  if (error) {
    logger.error('Supabase error:', { error })
    throw error
  }
  return data
}

export const unavailabilityRepository = {
  async fetchByStylistId(stylistId: string): Promise<Unavailability[]> {
    logger.debug('Fetching unavailabilities by stylist ID', { stylistId })
    const supabase = await createClient()
    const query = supabase
      .from('unavailability')
      .select('*')
      .eq('stylist_id', stylistId)
      .order('start_datetime', { ascending: true })

    const data = await handleSupabaseError(query)
    logger.info('Unavailabilities fetched successfully', { count: data?.length || 0 })
    return data || []
  },

  async create(data: UnavailabilityCreateData): Promise<Unavailability> {
    logger.debug('Creating unavailability', { data })
    const supabase = await createClient()
    const query = supabase.from('unavailability').insert(data).select().single()
    const newRecord = await handleSupabaseError(query)
    if (!newRecord) {
      logger.error('Failed to create unavailability record')
      throw new Error(UNAVAILABILITY_MESSAGES.ERROR.SERVER)
    }
    logger.info('Unavailability created successfully', { id: newRecord.id })
    return newRecord
  },

  async update(id: string, data: TablesUpdate<'unavailability'>): Promise<Unavailability> {
    logger.debug('Updating unavailability', { id, data })
    const supabase = await createClient()
    const query = supabase.from('unavailability').update(data).eq('id', id).select().single()
    const updatedRecord = await handleSupabaseError(query)
    if (!updatedRecord) {
      logger.error('Failed to update unavailability record', { id })
      throw new Error(UNAVAILABILITY_MESSAGES.ERROR.NOT_FOUND)
    }
    logger.info('Unavailability updated successfully', { id })
    return updatedRecord
  },

  async remove(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('unavailability').delete().eq('id', id)
    if (error) throw error
  },

  async delete(id: string): Promise<void> {
    logger.debug('Deleting unavailability', { id })
    const supabase = await createClient()
    const { error } = await supabase.from('unavailability').delete().eq('id', id)
    if (error) {
      logger.error('Error deleting unavailability', { error, id })
      throw error
    }
    logger.info('Unavailability deleted successfully', { id })
  },
}
