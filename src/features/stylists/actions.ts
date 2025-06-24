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
import type { Stylist } from '@/core/domains/stylists/stylist.types'

/**
 * Funcție ajutătoare care asamblează serviciul pentru 'stylists'.
 */
export async function getStylistService() {
  const supabase = await createClient()
  const repository = createStylistRepository(supabase)
  return createStylistService(repository)
}

/**
 * Acțiune pentru obținerea stiliștilor activi.
 */
export async function getActiveStylistsAction(): Promise<{ success: boolean; data?: Stylist[]; error?: string }> {
  try {
    const stylistService = await getStylistService()
    const allStylists = await stylistService.findAllStylists()
    const activeStylists = allStylists.filter((stylist) => stylist.is_active)
    return { success: true, data: activeStylists }
  } catch (error) {
    return { success: false, error: 'Eroare la încărcarea stiliștilor' }
  }
}

/**
 * Acțiune pentru adăugarea unui nou stilist.
 */
export async function addStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const stylistService = await getStylistService()
    await stylistService.createAndInviteStylist(rawData)

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

export async function getStylistsByServiceAction(
  serviceId: string
  // Definim explicit contractul de returnare
): Promise<ActionResponse<Stylist[]>> {
  if (!serviceId) {
    // Returnăm un răspuns de eroare care respectă structura ActionResponse
    return {
      success: false,
      message: 'ID-ul serviciului este invalid.',
    }
  }

  try {
    const stylistService = await getStylistService()
    const stylists = await stylistService.findStylistsByServiceId(serviceId)

    // Returnăm un răspuns de succes care respectă structura ActionResponse
    return {
      success: true,
      data: stylists,
    }
  } catch (error) {
    // handleError returnează deja un ActionResponse consistent
    return handleError(error, STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.DEFAULT)
  }
}
