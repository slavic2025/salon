// src/core/domains/stylists/stylist.repository.ts
import 'server-only'
import { createClient } from '@/lib/supabase-server' // Presupunând că am redenumit lib/supabase.ts
import { createLogger } from '@/lib/logger'
import { Stylist, StylistCreateData, StylistUpdateData } from './stylist.types'

const logger = createLogger('StylistRepository')
const TABLE_NAME = 'stylists'

// Funcție de bază pentru a gestiona erorile Supabase
async function handleSupabaseError<T>(promise: PromiseLike<{ data: T; error: any }>): Promise<T> {
  const { data, error } = await promise
  if (error) {
    logger.error('Supabase query failed', { message: error.message, details: error.details })
    throw new Error(`Database error: ${error.message}`)
  }
  return data
}

// Obiectul Repository care expune metodele de acces la date
export const stylistRepository = {
  /**
   * Preia toți stiliștii din baza de date.
   * @returns A promise that resolves to an array of stylists.
   */
  async fetchAll(): Promise<Stylist[]> {
    logger.debug('Fetching all stylists...')
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select('*').order('name', { ascending: true })
    return handleSupabaseError(query)
  },

  /**
   * Preia un stilist specific după ID.
   * @param id - The ID of the stylist.
   * @returns A promise that resolves to the stylist object or null if not found.
   */
  async fetchById(id: string): Promise<Stylist | null> {
    logger.debug(`Fetching stylist with id: ${id}`)
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select('*').eq('id', id).maybeSingle()
    return handleSupabaseError(query)
  },

  /**
   * Creează un nou stilist.
   * @param data - The data for the new stylist.
   * @returns A promise that resolves to the newly created stylist.
   */
  async create(data: StylistCreateData): Promise<Stylist> {
    logger.debug('Creating a new stylist...', { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).insert(data).select().single()
    return handleSupabaseError(query)
  },

  /**
   * Actualizează un stilist existent.
   * @param id - The ID of the stylist to update.
   * @param data - The data to update.
   * @returns A promise that resolves to the updated stylist.
   */
  async update(id: string, data: StylistUpdateData): Promise<Stylist> {
    logger.debug(`Updating stylist with id: ${id}`, { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
    return handleSupabaseError(query)
  },

  /**
   * Șterge un stilist.
   * @param id - The ID of the stylist to delete.
   * @returns A promise that resolves when the operation is complete.
   */
  async remove(id: string): Promise<void> {
    logger.debug(`Deleting stylist with id: ${id}`)
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).delete().eq('id', id)
    await handleSupabaseError(query)
  },

  /**
   * Verifică unicitatea câmpurilor (name, email, phone) pentru un stilist.
   * Exclude un anumit ID (util la actualizare).
   * @param fields - The fields to check.
   * @param idToExclude - The ID to exclude from the check.
   * @returns A promise that resolves to an array of error messages.
   */
  async checkUniqueness(
    fields: { name: string; email: string; phone: string },
    idToExclude: string | null
  ): Promise<{ field: 'name' | 'email' | 'phone'; message: string }[]> {
    logger.debug('Checking stylist uniqueness...', { fields, idToExclude })
    const supabase = await createClient()
    const errors: { field: 'name' | 'email' | 'phone'; message: string }[] = []

    const checks = (Object.keys(fields) as Array<keyof typeof fields>).map(async (field) => {
      let query = supabase.from(TABLE_NAME).select('id', { count: 'exact' }).eq(field, fields[field])
      if (idToExclude) {
        query = query.neq('id', idToExclude)
      }
      const { error: dbError, count } = await query

      if (dbError) {
        throw new Error(`Failed to check ${field} uniqueness.`)
      }
      if (count && count > 0) {
        errors.push({ field, message: `Un stilist cu acest ${field} există deja.` })
      }
    })

    await Promise.all(checks)
    return errors
  },
}
