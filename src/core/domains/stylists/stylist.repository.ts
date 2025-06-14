// src/core/domains/stylists/stylist.repository.ts
import 'server-only'
import { createClient } from '@/lib/supabase-server'
import { createLogger } from '@/lib/logger'
import { Stylist, StylistCreateData, StylistUpdateData } from './stylist.types'

const logger = createLogger('StylistRepository')
const TABLE_NAME = 'stylists'

async function handleSupabaseError<T>(promise: PromiseLike<{ data: T; error: any }>, context: string): Promise<T> {
  const { data, error } = await promise
  if (error) {
    logger.error(`Supabase query failed in ${context}`, { message: error.message, details: error.details })
    throw new Error(`Database error during ${context}: ${error.message}`)
  }
  return data
}

export const stylistRepository = {
  /**
   * Preia toți stiliștii din baza de date, ordonați după nume
   */
  async fetchAll(): Promise<Stylist[]> {
    logger.debug('Fetching all stylists...')
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select('*').order('full_name', { ascending: true })
    return (await handleSupabaseError(query, 'fetchAll')) as Stylist[]
  },

  /**
   * Preia un stilist specific după ID
   */
  async fetchById(id: string): Promise<Stylist | null> {
    logger.debug(`Fetching stylist with id: ${id}`)
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select('*').eq('id', id).maybeSingle()
    return await handleSupabaseError(query, `fetchById(${id})`)
  },

  /**
   * Preia stiliștii pentru un serviciu specific folosind o funcție RPC
   */
  async fetchByServiceId(serviceId: string): Promise<Stylist[]> {
    logger.debug(`Fetching stylists for service id via RPC: ${serviceId}`)
    const supabase = await createClient()

    const { data, error } = await supabase.rpc('get_stylists_for_service', {
      p_service_id: serviceId,
    })

    if (error) {
      logger.error('Error in RPC get_stylists_for_service', { error })
      throw new Error(`Database RPC error: ${error.message}`)
    }

    return (data as Stylist[]) || []
  },

  /**
   * Creează un nou stilist
   */
  async create(data: StylistCreateData): Promise<Stylist> {
    logger.debug('Creating a new stylist...', { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).insert(data).select().single()
    const newStylist = await handleSupabaseError(query, 'create')

    if (!newStylist) {
      logger.error('Failed to create stylist, received null data from Supabase.', { data })
      throw new Error('Database error: Failed to return the new stylist after creation.')
    }
    return newStylist
  },

  /**
   * Actualizează un stilist existent
   */
  async update(id: string, data: StylistUpdateData): Promise<Stylist> {
    logger.debug(`Updating stylist with id: ${id}`, { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
    const updatedStylist = await handleSupabaseError(query, `update(${id})`)

    if (!updatedStylist) {
      logger.error('Failed to update stylist, received null data from Supabase.', { id, data })
      throw new Error('Database error: Failed to return the stylist after update.')
    }
    return updatedStylist
  },

  /**
   * Șterge un stilist
   */
  async remove(id: string): Promise<void> {
    logger.debug(`Deleting stylist with id: ${id}`)
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).delete().eq('id', id)
    await handleSupabaseError(query, `remove(${id})`)
  },

  /**
   * Verifică unicitatea câmpurilor (name, email, phone)
   */
  async checkUniqueness(
    fields: Partial<Pick<Stylist, 'full_name' | 'email' | 'phone'>>,
    idToExclude: string | null
  ): Promise<{ field: keyof typeof fields; message: string }[]> {
    logger.debug('Checking stylist uniqueness...', { fields, idToExclude })
    const supabase = await createClient()
    const errors: { field: keyof typeof fields; message: string }[] = []

    for (const [field, value] of Object.entries(fields)) {
      if (!value) continue

      let query = supabase.from(TABLE_NAME).select('id', { count: 'exact' }).eq(field, value)
      if (idToExclude) {
        query = query.neq('id', idToExclude)
      }
      const { count, error } = await query

      if (error) {
        throw new Error(`Failed to check uniqueness for ${field}.`)
      }
      if (count && count > 0) {
        errors.push({ field: field as keyof typeof fields, message: `Un stilist cu acest ${field} există deja.` })
      }
    }
    return errors
  },
}
