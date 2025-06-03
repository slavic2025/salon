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

export async function checkStylistUniqueness(
  idToExclude: string | null, // ID-ul stilistului curent (pentru operații de actualizare), null pentru creare
  name: string,
  email: string,
  phone: string // Telefonul este obligatoriu și va fi mereu string
): Promise<{ field: string; message: string }[]> {
  const errors: { field: string; message: string }[] = []
  const supabase = await createClient()

  // Verifică unicitatea numelui
  let nameQuery = supabase.from('stylists').select('id').eq('name', name)
  if (idToExclude) {
    nameQuery = nameQuery.neq('id', idToExclude)
  }
  const { data: existingName, error: nameError } = await nameQuery.limit(1)
  if (nameError) {
    logger.error('Error checking name uniqueness:', { message: nameError.message })
    throw new Error('Failed to check name uniqueness.')
  }
  if (existingName && existingName.length > 0) {
    errors.push({ field: 'name', message: 'Un stilist cu acest nume există deja.' })
  }

  // Verifică unicitatea email-ului
  let emailQuery = supabase.from('stylists').select('id').eq('email', email)
  if (idToExclude) {
    emailQuery = emailQuery.neq('id', idToExclude)
  }
  const { data: existingEmail, error: emailError } = await emailQuery.limit(1)
  if (emailError) {
    logger.error('Error checking email uniqueness:', { message: emailError.message })
    throw new Error('Failed to check email uniqueness.')
  }
  if (existingEmail && existingEmail.length > 0) {
    errors.push({ field: 'email', message: 'Un stilist cu acest email există deja.' })
  }

  // Verifică unicitatea telefonului
  let phoneQuery = supabase.from('stylists').select('id').eq('phone', phone)
  if (idToExclude) {
    phoneQuery = phoneQuery.neq('id', idToExclude)
  }
  const { data: existingPhone, error: phoneError } = await phoneQuery.limit(1)
  if (phoneError) {
    logger.error('Error checking phone uniqueness:', { message: phoneError.message })
    throw new Error('Failed to check phone uniqueness.')
  }
  if (existingPhone && existingPhone.length > 0) {
    errors.push({ field: 'phone', message: 'Un stilist cu acest număr de telefon există deja.' })
  }

  return errors
}

export async function fetchStylistById(id: string): Promise<StylistData | null> {
  logger.debug('Attempting to fetch stylist by ID.', { stylistId: id })
  const supabase = await createClient()
  const { data: stylist, error } = await supabase.from('stylists').select('*').eq('id', id).single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 înseamnă "No rows found"
    logger.error('Error fetching stylist by ID from Supabase:', {
      message: error.message,
      details: error.details,
      stylistId: id,
    })
    throw new Error('Failed to fetch stylist by ID.')
  }

  if (error && error.code === 'PGRST116') {
    logger.info('No stylist found with the given ID.', { stylistId: id })
    return null
  }

  logger.info('Successfully fetched stylist by ID.', { stylistId: id, stylistName: stylist?.name })
  return stylist || null
}
