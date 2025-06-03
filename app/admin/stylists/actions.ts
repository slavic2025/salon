// app/admin/stylists/actions.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import {
  insertStylist,
  updateStylist,
  deleteStylist,
  fetchAllStylists,
  checkStylistUniqueness,
  fetchStylistById,
} from '@/lib/db/stylist-core'
import { ActionResponse } from '@/lib/types' // Asigură-te că acest tip `ActionResponse` este definit
import { addStylistSchema, editStylistSchema } from '@/lib/zod/schemas'
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
    const validated = addStylistSchema.parse(data) // `validated.phone` va fi un string aici

    // Efectuează verificarea unicității la nivel de server
    const uniquenessErrors = await checkStylistUniqueness(
      null, // Nu există ID de exclus pentru creare
      validated.name,
      validated.email,
      validated.phone
    )

    if (uniquenessErrors.length > 0) {
      logger.warn('addStylistAction: Unicitatea validării a eșuat.', { uniquenessErrors })
      // Formatează erorile de unicitate pentru a fi afișate în UI
      const formattedErrors = uniquenessErrors.reduce((acc, err) => {
        if (!acc[err.field]) {
          acc[err.field] = []
        }
        acc[err.field]?.push(err.message)
        return acc
      }, {} as Record<string, string[]>) // Asigură-te că tipul corespunde ActionResponse['errors']

      return { success: false, message: 'Eroare de validare a unicității!', errors: formattedErrors }
    }

    await insertStylist(validated)
    logger.info('addStylistAction: Stilistul a fost adăugat cu succes.', { name: validated.name })

    revalidatePath('/admin/stylists') // Revalidează calea după o inserție de succes
    return { success: true, message: 'Stilistul a fost adăugat cu succes!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('addStylistAction: Validarea client-side a eșuat în timpul adăugării stilistului.', {
        errors: error.flatten(),
      })
      // Returnează erorile de validare formatate pentru afișare în UI
      return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
    }

    logger.error('addStylistAction: Eroare neașteptată în timpul adăugării stilistului.', {
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
  const id = formData.get('id')

  if (typeof id !== 'string' || !id) {
    logger.warn('editStylistAction: ID-ul stilistului este invalid pentru actualizare.', { id })
    return {
      success: false,
      message: 'ID-ul stilistului pentru actualizare este invalid.',
      errors: { _form: ['ID invalid pentru actualizare.'] },
    }
  }

  logger.debug('editStylistAction invoked: Se încearcă actualizarea stilistului.', {
    stylistId: id,
    formDataEntries: Object.fromEntries(formData.entries()),
  })
  try {
    const data = extractStylistDataFromForm(formData)
    // Validarea datelor folosind schema Zod specifică pentru editare
    // Notă: editStylistSchema.partial() face câmpurile opționale.
    // Dar vom prelua valorile curente pentru verificarea unicității.
    const validated = editStylistSchema.parse(data)

    // Preia datele curente ale stilistului pentru a le compara și a le combina cu actualizările
    const currentStylist = await fetchStylistById(id)
    if (!currentStylist) {
      logger.warn('editStylistAction: Stilistul nu a fost găsit pentru actualizare.', { stylistId: id })
      return { success: false, message: 'Stilistul nu a fost găsit.' }
    }

    // Combină datele validate (care pot fi parțiale) cu datele curente pentru a face verificarea unicității.
    // Dacă un câmp nu este furnizat în `validated`, se folosește valoarea sa curentă din baza de date.
    const nameForUniqueness = validated.name ?? currentStylist.name
    const emailForUniqueness = validated.email ?? currentStylist.email
    const phoneForUniqueness = validated.phone ?? currentStylist.phone

    // Efectuează verificarea unicității, excluzând ID-ul stilistului curent
    const uniquenessErrors = await checkStylistUniqueness(
      id, // Exclude acest ID de la verificare
      nameForUniqueness,
      emailForUniqueness,
      phoneForUniqueness
    )

    if (uniquenessErrors.length > 0) {
      logger.warn('editStylistAction: Validarea unicității a eșuat.', { stylistId: id, uniquenessErrors })
      const formattedErrors = uniquenessErrors.reduce((acc, err) => {
        if (!acc[err.field]) {
          acc[err.field] = []
        }
        acc[err.field]?.push(err.message)
        return acc
      }, {} as Record<string, string[]>)
      return { success: false, message: 'Eroare de validare a unicității!', errors: formattedErrors }
    }

    // Actualizează stilistul în baza de date cu datele validate (parțiale)
    await updateStylist(id, validated)
    logger.info('editStylistAction: Stilistul a fost actualizat cu succes.', { id })

    revalidatePath('/admin/stylists') // Revalidează calea după o actualizare de succes
    return { success: true, message: 'Stilistul a fost actualizat cu succes!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('editStylistAction: Validarea client-side a eșuat în timpul actualizării stilistului.', {
        stylistId: id,
        errors: error.flatten(),
      })
      return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
    }

    logger.error('editStylistAction: Eroare neașteptată în timpul actualizării stilistului.', {
      stylistId: id,
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
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
