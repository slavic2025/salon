// src/features/stylists/actions.ts (Varianta finală, refactorizată)
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createStylistRepository } from '@/core/domains/stylists/stylist.repository'
import { createStylistService } from '@/core/domains/stylists/stylist.service'
import { STYLIST_CONSTANTS } from '@/core/domains/stylists/stylist.constants'
import { UniquenessError } from '@/lib/errors'
import { handleError, handleUniquenessErrors } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import type { ActionResponse } from '@/types/actions.types'

/**
 * Funcție ajutătoare care asamblează serviciul pentru 'stylists'.
 */
async function getStylistService() {
  const supabase = await createClient()
  const repository = createStylistRepository(supabase)
  return createStylistService(repository)
}

/**
 * Acțiune pentru adăugarea unui nou stilist.
 */
export async function addStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const stylistService = await getStylistService()
    await stylistService.createStylist(rawData)

    revalidatePath(STYLIST_CONSTANTS.PATHS.revalidate.list())
    return { success: true, message: STYLIST_CONSTANTS.MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    // Prindem eroarea specifică de unicitate aruncată de serviciu
    if (error instanceof UniquenessError) {
      return handleUniquenessErrors(error.fields)
    }
    return handleError(error, STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.CREATE)
  }
}

/**
 * Acțiune pentru editarea unui stilist existent.
 */
export async function editStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  const id = rawData.id as string

  try {
    const stylistService = await getStylistService()
    await stylistService.updateStylist(rawData)

    revalidatePath(STYLIST_CONSTANTS.PATHS.revalidate.details(id))
    return { success: true, message: STYLIST_CONSTANTS.MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    if (error instanceof UniquenessError) {
      return handleUniquenessErrors(error.fields)
    }
    return handleError(error, STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.UPDATE)
  }
}

/**
 * Acțiune pentru ștergerea unui stilist.
 */
export async function deleteStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const { id } = formDataToObject(formData)
  if (!id || typeof id !== 'string') {
    return handleError(new Error('ID-ul stilistului este invalid.'), STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.DELETE)
  }
  try {
    const stylistService = await getStylistService()
    await stylistService.deleteStylist(id)

    revalidatePath(STYLIST_CONSTANTS.PATHS.revalidate.list())
    return { success: true, message: STYLIST_CONSTANTS.MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.DELETE)
  }
}

/**
 * Acțiune pentru trimiterea email-ului de resetare a parolei.
 */
export async function resetPasswordAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const { id } = formDataToObject(formData)
  if (!id || typeof id !== 'string') {
    return handleError(
      new Error('ID-ul stilistului este invalid.'),
      STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.RESET_PASSWORD
    )
  }
  try {
    const stylistService = await getStylistService()
    await stylistService.sendPasswordResetLink(id)
    return { success: true, message: STYLIST_CONSTANTS.MESSAGES.SUCCESS.PASSWORD_RESET }
  } catch (error) {
    return handleError(error, STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.RESET_PASSWORD)
  }
}
