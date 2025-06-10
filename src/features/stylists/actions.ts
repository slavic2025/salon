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

const logger = createLogger('StylistActions')

/**
 * Acțiune pentru adăugarea unui nou stilist.
 */
export async function addStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())

  const validationResult = inviteSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { success: false, message: validationResult.error.errors[0].message }
  }

  const { name, email } = validationResult.data
  const supabaseAdmin = createAdminClient()

  let newUserId: string | undefined

  try {
    // Pasul 1: Trimitem invitația. Supabase creează utilizatorul în `auth.users` și îi trimite un email.
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { password_set: false }, // Flag esențial pentru fluxul de onboarding
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`, // Pagina de aterizare client-side
    })

    if (inviteError) throw inviteError
    if (!inviteData.user) throw new Error('Nu s-a putut crea utilizatorul invitat.')

    newUserId = inviteData.user.id

    // Pasul 2: Creăm înregistrarea în tabela `profiles` pentru a asocia rolul
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: newUserId,
      email: email,
      name: name,
      role: 'stylist',
    })

    if (profileError) throw profileError

    // Pasul 3: Creăm înregistrarea în tabela `stylists`
    const { error: stylistError } = await supabaseAdmin.from('stylists').insert({
      profile_id: newUserId,
      name: name,
      email: email,
    })

    if (stylistError) throw stylistError

    revalidatePath('/admin/stylists')
    return { success: true, message: `Invitație trimisă cu succes la ${email}!` }
  } catch (error) {
    logger.error('Error in addStylistAction', { error })

    // Cleanup: Dacă s-a creat un utilizator dar un pas ulterior a eșuat, ștergem user-ul orfan.
    if (newUserId) {
      await supabaseAdmin.auth.admin.deleteUser(newUserId)
    }

    if ((error as Error).message.includes('unique constraint')) {
      return { success: false, message: 'Un utilizator cu acest email există deja.' }
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
        name: dataToUpdate.name,
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
 * Acțiune pentru ștergerea unui stilist.
 */
export async function deleteStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id')

  const validationResult = deleteStylistSchema.safeParse(id)

  if (!validationResult.success) {
    logger.warn('Validation failed for deleteStylistAction', { id })
    return { success: false, message: 'ID-ul stilistului este invalid.' }
  }

  const stylistId = validationResult.data

  try {
    await stylistRepository.remove(stylistId)
    logger.info('Stylist deleted successfully', { id: stylistId })

    revalidatePath('/admin/stylists')

    return { success: true, message: 'Stilistul a fost șters cu succes.' }
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
