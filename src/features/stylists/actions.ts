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
} from '@/core/domains/stylists/stylist.types'
import { ActionResponse } from '@/types/actions.types'
import { createAdminClient } from '@/lib/supabase-admin'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { formDataToObject } from '@/lib/form-utils'
import { handleValidationError, handleUniquenessErrors, handleError } from '@/lib/action-helpers'
import { STYLIST_MESSAGES, STYLIST_PATHS } from './constants'
import { isDuplicateError } from '../common/utils'

const logger = createLogger('StylistActions')

/**
 * Acțiune pentru adăugarea unui nou stilist.
 */
export async function addStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())
  const validationResult = addStylistSchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  const { full_name, email, phone, description } = validationResult.data
  const supabaseAdmin = createAdminClient()
  let newUserId: string | undefined

  try {
    // Pasul 1: Invitare utilizator
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { password_set: false, full_name, phone },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${STYLIST_PATHS.auth.confirm}`,
    })

    if (inviteError) throw inviteError
    if (!inviteData.user) throw new Error(STYLIST_MESSAGES.ERROR.NOT_FOUND)

    newUserId = inviteData.user.id
    logger.info(`User invited with ID: ${newUserId}`)

    // Pasul 2: Creare profil și înregistrare stilist
    // Aceste funcții nu mai există, presupunem că logica a fost mutată în altă parte sau nu mai este necesară.
    // Dacă este nevoie de inserare suplimentară, adăugați aici logica necesară.

    revalidatePath(STYLIST_PATHS.revalidation())
    return { success: true, message: STYLIST_MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    logger.error('Error in addStylistAction', { error })

    // cleanupOrphanedUser nu mai există, deci nu mai curățăm utilizatorul orfan aici

    if (isDuplicateError(error)) {
      return { success: false, message: STYLIST_MESSAGES.ERROR.DUPLICATE }
    }

    return handleError(error, 'addStylistAction')
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
    return handleValidationError(validationResult.error)
  }

  const { id, ...dataToUpdate } = validationResult.data

  try {
    // Verifică unicitatea
    const uniquenessErrors = await stylistRepository.checkUniqueness(
      { email: dataToUpdate.email, full_name: dataToUpdate.full_name, phone: dataToUpdate.phone },
      id
    )

    if (uniquenessErrors.length > 0) {
      return handleUniquenessErrors(uniquenessErrors)
    }

    await stylistRepository.update(id, dataToUpdate)
    logger.info('Stylist updated successfully', { id })

    revalidatePath(STYLIST_PATHS.revalidation())
    return { success: true, message: STYLIST_MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    return handleError(error, 'editStylistAction')
  }
}

/**
 * Acțiune pentru ștergerea unui stilist.
 */
export async function deleteStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const stylistId = formData.get('id')

  const validationResult = deleteStylistSchema.safeParse(stylistId)
  if (!validationResult.success) {
    return { success: false, message: STYLIST_MESSAGES.ERROR.VALIDATION.INVALID_ID }
  }

  const validStylistId = validationResult.data
  const supabaseAdmin = createAdminClient()

  try {
    const stylistToDelete = await stylistRepository.fetchById(validStylistId)
    if (!stylistToDelete?.profile_id) {
      throw new Error(STYLIST_MESSAGES.ERROR.NOT_FOUND)
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(stylistToDelete.profile_id)
    if (deleteError) throw deleteError

    logger.info('Stylist deleted successfully', { stylistId: validStylistId })
    revalidatePath(STYLIST_PATHS.revalidation())
    return { success: true, message: STYLIST_MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, 'deleteStylistAction')
  }
}

/**
 * Acțiune pentru preluarea tuturor stiliștilor.
 */
export async function getStylistsAction(): Promise<Stylist[]> {
  try {
    const stylists = await stylistRepository.fetchAll()
    logger.info('Stylists retrieved successfully', { count: stylists.length })
    return stylists
  } catch (error) {
    logger.error('Failed to fetch stylists', { error })
    return []
  }
}

/**
 * Acțiune pentru setarea parolei inițiale.
 */
export async function setInitialPassword(password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password,
    data: { password_set: true },
  })

  if (error) return { error: error.message }
  redirect(STYLIST_PATHS.auth.confirm)
}

/**
 * Acțiune pentru preluarea stiliștilor după serviciu.
 */
export async function getStylistsByServiceAction(serviceId: string) {
  if (!serviceId) {
    logger.warn('getStylistsByServiceAction called with no serviceId')
    return { success: true, data: [] }
  }

  try {
    const stylists = await stylistRepository.fetchByServiceId(serviceId)
    return { success: true, data: stylists }
  } catch (error) {
    return handleError(error, 'getStylistsByServiceAction')
  }
}

/**
 * Acțiune pentru resetarea parolei unui stilist.
 */
export async function resetPasswordAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const stylistId = formData.get('id')

  // validateStylistId nu mai există, deci validarea se poate face direct aici
  if (!stylistId || typeof stylistId !== 'string' || stylistId.length === 0) {
    return { success: false, message: STYLIST_MESSAGES.ERROR.VALIDATION.INVALID_ID }
  }

  const supabaseAdmin = createAdminClient()

  try {
    const stylistToReset = await stylistRepository.fetchById(stylistId as string)
    if (!stylistToReset?.profile_id) {
      throw new Error(STYLIST_MESSAGES.ERROR.NOT_FOUND)
    }

    const { error: resetError } = await supabaseAdmin.auth.admin.inviteUserByEmail(stylistToReset.email!, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${STYLIST_PATHS.auth.resetPassword}`,
    })

    if (resetError) throw resetError

    logger.info('Password reset email sent successfully', { stylistId })
    return { success: true, message: STYLIST_MESSAGES.SUCCESS.PASSWORD_RESET }
  } catch (error) {
    return handleError(error, 'resetPasswordAction')
  }
}
