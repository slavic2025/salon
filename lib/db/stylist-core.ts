// lib/db/stylist-core.ts
import { createClient } from '@/lib/supabase'
import { z } from 'zod'
import { createLogger } from '@/lib/logger'
import { StylistData } from '@/app/admin/stylists/types'
import { addStylistSchema } from '../zod/schemas'

const logger = createLogger('DB_StylistCore')

export async function fetchAllStylists(): Promise<StylistData[]> {
  logger.debug('Attempting to fetch all stylists.')
  const supabase = await createClient()
  const { data: stylists, error } = await supabase.from('stylists').select('*').order('name', { ascending: true }) // Ordonează alfabetic

  if (error) {
    logger.error('Error fetching stylists from Supabase:', { message: error.message, details: error.details })
    throw new Error('Failed to fetch stylists.')
  }

  logger.info('Successfully fetched stylists.', { count: stylists?.length })
  return stylists || []
}

export async function insertStylist(stylistData: z.infer<typeof addStylistSchema>): Promise<StylistData> {
  logger.debug('Attempting to insert new stylist.', { stylistData })
  const supabase = await createClient()
  const { data, error } = await supabase.from('stylists').insert(stylistData).select().single() // Ne așteptăm la un singur rând inserat

  if (error) {
    logger.error('Error inserting stylist into Supabase:', {
      message: error.message,
      details: error.details,
      stylistData,
    })
    throw new Error('Failed to create stylist.')
  }

  logger.info('Stylist successfully inserted.', { stylistId: data.id, stylistName: data.name })
  return data
}

export async function updateStylist(id: string, stylistData: z.infer<typeof addStylistSchema>): Promise<StylistData> {
  logger.debug('Attempting to update stylist.', { stylistId: id, stylistData })
  const supabase = await createClient()
  // Nu este necesar să actualizezi `updated_at` manual, Supabase o face automat dacă e configurată.
  // Dacă nu este, atunci ar trebui să o adaugi `updated_at: new Date().toISOString()`.
  const { data, error } = await supabase
    .from('stylists')
    .update(stylistData) // Trimitem doar datele de update
    .eq('id', id)
    .select()
    .single()

  if (error) {
    logger.error('Error updating stylist in Supabase:', {
      message: error.message,
      details: error.details,
      stylistId: id,
      stylistData,
    })
    throw new Error('Failed to update stylist.')
  }

  logger.info('Stylist successfully updated.', { stylistId: data.id, stylistName: data.name })
  return data
}

export async function deleteStylist(id: string): Promise<void> {
  logger.debug('Attempting to delete stylist.', { stylistId: id })
  const supabase = await createClient()
  const { error } = await supabase.from('stylists').delete().eq('id', id)

  if (error) {
    logger.error('Error deleting stylist from Supabase:', {
      message: error.message,
      details: error.details,
      stylistId: id,
    })
    throw new Error('Failed to delete stylist.')
  }

  logger.info('Stylist successfully deleted.', { stylistId: id })
}
