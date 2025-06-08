// src/core/domains/unavailability/unavailability.repository.ts
'use server'

import { createClient } from '@/lib/supabase-server'
import { Unavailability, UnavailabilityCreateData } from './unavailability.types'
import { TablesUpdate } from '@/types/database.types'

async function handleSupabaseError<T>(promise: PromiseLike<{ data: T; error: any }>): Promise<T> {
  const { data, error } = await promise
  if (error) {
    console.error('Supabase error:', error.message)
    throw error
  }
  return data
}

export const unavailabilityRepository = {
  async fetchByStylistId(stylistId: string): Promise<Unavailability[]> {
    const supabase = await createClient()
    const query = supabase
      .from('unavailability')
      .select('*')
      .eq('stylist_id', stylistId)
      .order('start_datetime', { ascending: true })

    const data = await handleSupabaseError(query)
    return data || []
  },

  async create(data: UnavailabilityCreateData): Promise<Unavailability> {
    const supabase = await createClient()
    const query = supabase.from('unavailability').insert(data).select().single()
    const newRecord = await handleSupabaseError(query)
    if (!newRecord) throw new Error('Failed to create unavailability record.')
    return newRecord
  },

  async update(id: string, data: TablesUpdate<'unavailability'>): Promise<Unavailability> {
    const supabase = await createClient()
    const query = supabase.from('unavailability').update(data).eq('id', id).select().single()
    const updatedRecord = await handleSupabaseError(query)
    if (!updatedRecord) throw new Error('Failed to update unavailability record.')
    return updatedRecord
  },

  async remove(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('unavailability').delete().eq('id', id)
    if (error) throw error
  },
}
