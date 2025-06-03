// app/admin/stylists/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { insertStylist, updateStylist, deleteStylist, fetchAllStylists } from '@/lib/db/stylist-core'
import { ActionResponse } from '@/lib/types' // Asigură-te că acest tip `ActionResponse` este definit
import { addStylistSchema } from '@/lib/zod/schemas'
import { extractStylistDataFromForm, formatZodErrors } from '@/lib/form'
import { StylistData } from './types'

const logger = createLogger('StylistActions')

// Funcție helper pentru delay (pentru testare, comentată)
// function sleep(ms: number) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export async function getStylistsAction(): Promise<StylistData[]> {
  logger.debug('getStylistsAction invoked: Fetching all stylists.')
  try {
    const stylists = await fetchAllStylists()
    logger.info('getStylistsAction: Successfully retrieved stylists.', { count: stylists.length })
    return stylists
  } catch (error) {
    logger.error('getStylistsAction: Failed to fetch stylists.', {
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return []
  }
}

export async function addStylistAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  logger.debug('addStylistAction invoked: Attempting to add new stylist.', {
    formDataEntries: Object.fromEntries(formData.entries()),
  })
  try {
    const data = extractStylistDataFromForm(formData)
    // Validarea datelor folosind schema Zod specifică pentru adăugare
    const validated = addStylistSchema.parse(data)

    await insertStylist(validated)
    logger.info('addStylistAction: Successfully inserted new stylist.', { name: validated.name })

    revalidatePath('/admin/stylists') // Revalidează calea după o inserție de succes
    return { success: true, message: 'Stilistul a fost adăugat cu succes!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('addStylistAction: Validation failed during stylist addition.', { errors: error.flatten() })
      // Returnează erorile de validare formatate pentru afișare în UI
      return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
    }

    logger.error('addStylistAction: Unexpected error during stylist addition.', {
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    // Returnează un mesaj de eroare generic pentru erori neașteptate
    return { success: false, message: 'A eșuat adăugarea stilistului. Vă rugăm să încercați din nou.' }
  }
}

export async function editStylistAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  // await sleep(5000); // Pentru testare, comentată

  const id = formData.get('id')

  if (typeof id !== 'string' || !id) {
    logger.warn('editStylistAction: Invalid stylist ID for update.', { id })
    return {
      success: false,
      message: 'ID-ul stilistului pentru actualizare este invalid.',
      errors: { _form: ['ID invalid pentru actualizare.'] },
    }
  }

  logger.debug('editStylistAction invoked: Attempting to update stylist.', {
    stylistId: id,
    formDataEntries: Object.fromEntries(formData.entries()),
  })
  try {
    const data = extractStylistDataFromForm(formData)
    // Validarea datelor folosind schema Zod pentru inputul stilistului (care include `id`)
    const validated = addStylistSchema.parse(data)

    // Actualizează stilistul în baza de date
    await updateStylist(id, validated)
    logger.info('editStylistAction: Successfully updated stylist.', { id })

    revalidatePath('/admin/stylists') // Revalidează calea după o actualizare de succes
    return { success: true, message: 'Stilistul a fost actualizat cu succes!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('editStylistAction: Validation failed during stylist update.', {
        stylistId: id,
        errors: error.flatten(),
      })
      // Returnează erorile de validare formatate
      return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
    }

    logger.error('editStylistAction: Unexpected error during stylist update.', {
      stylistId: id,
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    // Returnează un mesaj de eroare generic
    return { success: false, message: 'A eșuat actualizarea stilistului. Vă rugăm să încercați din nou.' }
  }
}

export async function deleteStylistAction(_prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id')

  if (typeof id !== 'string' || !id) {
    logger.warn('deleteStylistAction: Invalid stylist ID for deletion.', { id })
    return {
      success: false,
      message: 'ID-ul stilistului este invalid.',
      errors: { _form: ['ID-ul stilistului este invalid.'] },
    }
  }

  logger.debug('deleteStylistAction invoked: Attempting to delete stylist.', { stylistId: id })
  try {
    await deleteStylist(id)
    logger.info('deleteStylistAction: Successfully deleted stylist.', { id })

    revalidatePath('/admin/stylists') // Revalidează calea după ștergere
    return { success: true, message: 'Stilistul a fost șters cu succes!' }
  } catch (error) {
    logger.error('deleteStylistAction: Unexpected error during stylist deletion.', {
      stylistId: id,
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return { success: false, message: 'A eșuat ștergerea stilistului. Vă rugăm să încercați din nou.' }
  }
}
