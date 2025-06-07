// lib/db/stylist-core.ts
import { createClient } from '@/lib/supabase'
import { z } from 'zod'
import { createLogger } from '@/lib/logger'
import { createGenericCrudService } from '@/lib/db/generic-core'
import { addStylistSchema, editStylistSchema, StylistData } from './types'

const logger = createLogger('DB_StylistCore')

export const stylistCrud = createGenericCrudService<
  'stylists',
  StylistData,
  typeof addStylistSchema,
  typeof editStylistSchema
>('stylists', addStylistSchema, editStylistSchema)

export const fetchAllStylists = stylistCrud.fetchAll
export const fetchStylistById = stylistCrud.fetchById
export const insertStylist = stylistCrud.insert
export const updateStylist = stylistCrud.update
export const deleteStylist = stylistCrud.remove

export async function checkStylistUniqueness(
  idToExclude: string | null,
  name: string,
  email: string,
  phone: string
): Promise<{ field: string; message: string }[]> {
  logger.debug('Checking stylist uniqueness', { idToExclude, name, email, phone })
  const errors: { field: string; message: string }[] = []
  const supabase = await createClient()

  const checkField = async (field: 'name' | 'email' | 'phone', value: string, errorMessage: string) => {
    let query = supabase.from('stylists').select('id', { count: 'exact' }).eq(field, value)
    if (idToExclude) {
      query = query.neq('id', idToExclude)
    }
    const { error: dbError, count } = await query

    if (dbError) {
      logger.error(`Error checking ${field} uniqueness:`, { message: dbError.message })
      throw new Error(`Failed to check ${field} uniqueness.`)
    }
    if (count && count > 0) {
      errors.push({ field, message: errorMessage })
    }
  }

  await Promise.all([
    checkField('name', name, 'Un stilist cu acest nume există deja.'),
    checkField('email', email, 'Un stilist cu acest email există deja.'),
    checkField('phone', phone, 'Un stilist cu acest număr de telefon există deja.'),
  ])

  return errors
}
