// src/features/stylists/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { stylistRepository } from '@/core/domains/stylists/stylist.repository'
import {
  addStylistSchema,
  editStylistSchema,
  deleteStylistSchema,
  Stylist,
  inviteSchema,
} from '@/core/domains/stylists/stylist.types'
import { ActionResponse } from '@/types/actions.types'
import { formatZodErrors } from '@/lib/form'
import { createAdminClient } from '@/lib/supabase-admin'
import { z } from 'zod'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { formDataToObject } from '@/lib/form-utils'
import { sendEmail } from '@/lib/email-service'

const logger = createLogger('StylistActions')

/**
 * Acțiune pentru adăugarea unui nou stilist.
 */
export async function addStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())
  const validationResult = addStylistSchema.safeParse(rawData)

  if (!validationResult.success) {
    return {
      success: false,
      message: 'Datele introduse sunt invalide.',
      errors: formatZodErrors(validationResult.error),
    }
  }

  const { full_name, email, phone, description } = validationResult.data
  const supabaseAdmin = createAdminClient()

  let newUserId: string | undefined

  try {
    // --- PASUL 1: Trimitem invitația prin email ---
    logger.debug('Step 1: Inviting user via email...')
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        password_set: false, // Flag esențial pentru ca stilistul să-și seteze parola
        full_name: full_name, // Trimitem datele pentru a fi disponibile la creare
        phone: phone,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    })

    if (inviteError) throw inviteError
    if (!inviteData.user) throw new Error('Nu s-a putut crea utilizatorul invitat.')
    newUserId = inviteData.user.id
    logger.info(`Step 1 successful. User invited with ID: ${newUserId}`)

    // --- PASUL 2: Creăm înregistrarea în public.profiles ---
    logger.debug('Step 2: Creating profile record...')
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: newUserId,
      role: 'stylist',
    })

    if (profileError) throw profileError
    logger.info('Step 2 successful. Profile created.')

    // --- PASUL 3: Creăm înregistrarea în public.stylists ---
    logger.debug('Step 3: Creating stylist record...')
    const { error: stylistError } = await supabaseAdmin.from('stylists').insert({
      profile_id: newUserId,
      full_name: full_name,
      email: email,
      phone: phone,
      description: description,
    })

    if (stylistError) throw stylistError
    logger.info('Step 3 successful. Stylist record created.')

    revalidatePath('/admin/stylists')
    return { success: true, message: `Invitație trimisă cu succes la ${email}!` }
  } catch (error) {
    logger.error('Error in addStylistAction transaction', { error })

    // --- Cleanup / Rollback Manual ---
    if (newUserId) {
      logger.warn(`Attempting cleanup. Deleting orphaned user: ${newUserId}`)
      await supabaseAdmin.auth.admin.deleteUser(newUserId)
    }

    if (
      (error as Error).message.includes('unique constraint') ||
      (error as Error).message.includes('User already exists')
    ) {
      return { success: false, message: 'Un utilizator cu acest email sau telefon există deja.' }
    }

    return { success: false, message: 'A apărut o eroare neașteptată. ' + (error as Error).message }
  }
}

/**
 * Acțiune pentru editarea unui stilist existent.
 */
export async function editStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('editStylistAction invoked', { rawData })

  const validationResult = editStylistSchema.safeParse(rawData)

  if (!validationResult.success) {
    const errors = formatZodErrors(validationResult.error)
    logger.warn('Validation failed for editStylistAction', { errors })
    return { success: false, message: 'Eroare de validare.', errors }
  }

  const { id, ...dataToUpdate } = validationResult.data

  try {
    // Verifică unicitatea, excluzând ID-ul stilistului curent
    const uniquenessErrors = await stylistRepository.checkUniqueness(
      {
        email: dataToUpdate.email,
        full_name: dataToUpdate.full_name,
        phone: dataToUpdate.phone,
      },
      id
    )

    if (uniquenessErrors.length > 0) {
      const errors: Record<string, string[]> = {}
      uniquenessErrors.forEach((err) => {
        errors[err.field] = [err.message]
      })
      logger.warn('Uniqueness check failed on edit', { id, errors })
      return { success: false, message: 'Un alt stilist cu aceste date există deja.', errors }
    }

    await stylistRepository.update(id, dataToUpdate)
    logger.info('Stylist updated successfully', { id })

    revalidatePath('/admin/stylists')

    return { success: true, message: 'Stilistul a fost actualizat cu succes!' }
  } catch (error) {
    logger.error('Error in editStylistAction', { id, error })
    return { success: false, message: (error as Error).message }
  }
}

/**
 * Acțiune pentru ștergerea completă a unui stilist (auth.users, profiles, stylists).
 */
export async function deleteStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const stylistId = formData.get('id')
  
  const validationResult = deleteStylistSchema.safeParse(stylistId)
  if (!validationResult.success) {
    logger.warn('Validation failed for deleteStylistAction', { id: stylistId })
    return { success: false, message: 'ID-ul stilistului este invalid.' }
  }
  
  const validStylistId = validationResult.data
  const supabaseAdmin = createAdminClient()

  try {
    // --- PASUL 1: Preluăm datele stilistului pentru a găsi ID-ul de profil (auth user ID) ---
    logger.debug(`Fetching stylist ${validStylistId} to get profile_id for deletion.`)
    const stylistToDelete = await stylistRepository.fetchById(validStylistId)

    if (!stylistToDelete || !stylistToDelete.profile_id) {
      throw new Error('Stilistul nu a fost găsit sau nu are un profil de autentificare asociat.')
    }

    const authUserId = stylistToDelete.profile_id
    logger.info(`Attempting to delete user with auth ID: ${authUserId}`)

    // --- PASUL 2: Ștergem utilizatorul din `auth.users` ---
    // Datorită constrângerilor 'ON DELETE CASCADE', înregistrările din
    // 'profiles' și 'stylists' vor fi șterse automat de baza de date.
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(authUserId)

    if (deleteError) {
      throw deleteError
    }

    logger.info('User, profile, and stylist records deleted successfully', { stylistId: validStylistId, authUserId })

    revalidatePath('/admin/stylists')
    return { success: true, message: 'Stilistul a fost șters cu succes din tot sistemul.' }
  } catch (error) {
    logger.error('Error in deleteStylistAction', { id: stylistId, error })
    return { success: false, message: (error as Error).message }
  }
}

/**
 * Acțiune pentru preluarea tuturor stiliștilor (nu pentru formulare).
 */
export async function getStylistsAction(): Promise<Stylist[]> {
  logger.debug('getStylistsAction invoked: Fetching all stylists.')
  try {
    const stylists = await stylistRepository.fetchAll()
    logger.info('getStylistsAction: Successfully retrieved stylists.', { count: stylists.length })
    return stylists
  } catch (error) {
    logger.error('getStylistsAction: Failed to fetch stylists.', {
      message: (error as Error).message,
    })
    return [] // Returnează un array gol în caz de eroare
  }
}

export async function setInitialPassword(password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password,
    data: { password_set: true }, // Marcam că parola a fost setată
  })
  if (error) return { error: error.message }
  redirect('/dashboard/schedule') // Redirecționare după succes
}

export async function getStylistsByServiceAction(serviceId: string) {
  // Verificare simplă a input-ului
  if (!serviceId) {
    logger.warn('getStylistsByServiceAction called with no serviceId')
    return { success: true, data: [] }
  }

  try {
    // Apelăm metoda din repository pe care am optimizat-o cu o funcție RPC.
    const stylists = await stylistRepository.fetchByServiceId(serviceId)

    // Returnăm un obiect structurat pentru a fi ușor de procesat pe client.
    return { success: true, data: stylists }
  } catch (error) {
    // Prindem orice eroare care ar putea apărea în repository (ex: eroare de la baza de date).
    logger.error('Failed to fetch stylists by service', { error, serviceId })
    return { success: false, error: 'A apărut o eroare la preluarea stiliștilor. Te rugăm să încerci din nou.' }
  }
}
