// app/admin/stylists/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createLogger } from '@/lib/logger'
import {
  fetchAllStylists,
  insertStylist,
  updateStylist,
  deleteStylist,
  addStylistSchema,
  Stylist,
} from '@/lib/db/stylist-core'

import { extractStylistDataFromForm, formatZodErrors } from '@/utils/form'
import { StylistActionResponse } from './types' // Asigură-te că Stylist este exportat de aici (de fapt ar trebui să fie exportat din stylist-core)
import { DeleteStylistSchema, stylistInputSchema } from '@/lib/zod/schemas'

const logger = createLogger('StylistsActions')

// ---------- GET Stylists ----------
export async function getStylistsAction(): Promise<Stylist[]> {
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
    return [] // Returnează un array gol în caz de eroare pentru a nu bloca UI-ul
  }
}

// ---------- ADD Stylist ----------
export async function addStylistAction(
  _prevState: StylistActionResponse,
  formData: FormData
): Promise<StylistActionResponse> {
  logger.debug('addStylistAction invoked: Attempting to add new stylist.', {
    formDataEntries: Object.fromEntries(formData.entries()),
  })
  try {
    const data = extractStylistDataFromForm(formData) // Extrage datele cu helper-ul
    const validated = addStylistSchema.parse(data) // Validează cu schema din core

    await insertStylist(validated) // Apelează funcția din core
    logger.info('addStylistAction: Successfully inserted new stylist.', { name: validated.name })

    revalidatePath('/admin/stylists')
    return { success: true, message: 'Stilistul a fost adăugat cu succes!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('addStylistAction: Validation failed during stylist addition.', { errors: error.flatten() })
      return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
    }

    logger.error('addStylistAction: Unexpected error during stylist addition.', {
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return { success: false, message: 'A eșuat adăugarea stilistului. Vă rugăm să încercați din nou.' }
  }
}

// ---------- UPDATE Stylist ----------
export async function editStylistAction(
  _prevState: StylistActionResponse,
  formData: FormData
): Promise<StylistActionResponse> {
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
    const data = extractStylistDataFromForm(formData) // Extrage datele cu helper-ul
    // Validăm datele folosind stylistInputSchema (care nu include ID-ul)
    const validated = stylistInputSchema.parse(data)

    await updateStylist(id, validated) // Apelează funcția din core cu ID și datele validate
    logger.info('editStylistAction: Successfully updated stylist.', { id })

    revalidatePath('/admin/stylists')
    return { success: true, message: 'Stilistul a fost actualizat cu succes!' }
  } catch (error) {
    if (error instanceof z.ZodError) {
      logger.warn('editStylistAction: Validation failed during stylist update.', {
        stylistId: id,
        errors: error.flatten(),
      })
      return { success: false, message: 'Eroare de validare!', errors: formatZodErrors(error) }
    }

    logger.error('editStylistAction: Unexpected error during stylist update.', {
      stylistId: id,
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return { success: false, message: 'A eșuat actualizarea stilistului. Vă rugăm să încercați din nou.' }
  }
}

// ---------- DELETE Stylist ----------
export async function deleteStylistAction(
  _prevState: StylistActionResponse,
  formData: FormData
): Promise<StylistActionResponse> {
  const id = formData.get('id')

  // Validare ID înainte de logare detaliată și apel core
  const validation = DeleteStylistSchema.safeParse({ id })
  if (!validation.success) {
    logger.warn('deleteStylistAction: Invalid stylist ID for deletion.', { id, errors: validation.error.flatten() })
    return { success: false, message: 'ID-ul stilistului este invalid.', errors: formatZodErrors(validation.error) }
  }
  const stylistIdToDelete = validation.data.id

  logger.debug('deleteStylistAction invoked: Attempting to delete stylist.', { stylistId: stylistIdToDelete })
  try {
    await deleteStylist(stylistIdToDelete) // Apelează funcția din core
    logger.info('deleteStylistAction: Successfully deleted stylist.', { id: stylistIdToDelete })

    revalidatePath('/admin/stylists')
    return { success: true, message: 'Stilistul a fost șters cu succes!' }
  } catch (error) {
    logger.error('deleteStylistAction: Unexpected error during stylist deletion.', {
      stylistId: stylistIdToDelete,
      message: (error as Error).message,
      errorName: (error as Error).name,
      errorStack: (error as Error).stack,
      originalError: error,
    })
    return { success: false, message: 'A eșuat ștergerea stilistului. Vă rugăm să încercați din nou.' }
  }
}

// ---------- Form Helpers (pentru utilizare directă în <form action={...}>) ----------
export async function deleteStylistActionForm(formData: FormData): Promise<void> {
  // Importă INITIAL_FORM_STATE din types.ts
  const { INITIAL_FORM_STATE } = await import('./types')
  const response = await deleteStylistAction(INITIAL_FORM_STATE, formData)
  logger.debug('deleteStylistActionForm completed', { response })
  // Poți adăuga logică aici pentru a gestiona răspunsul, de exemplu, notificări toast
}

export async function editStylistActionForm(formData: FormData): Promise<void> {
  // Importă INITIAL_FORM_STATE din types.ts
  const { INITIAL_FORM_STATE } = await import('./types')
  const response = await editStylistAction(INITIAL_FORM_STATE, formData)
  logger.debug('editStylistActionForm completed', { response })
  // Poți adăuga logică aici pentru a gestiona răspunsul, de exemplu, notificări toast
}

export async function addStylistActionForm(formData: FormData): Promise<void> {
  // Importă INITIAL_FORM_STATE din types.ts
  const { INITIAL_FORM_STATE } = await import('./types')
  const response = await addStylistAction(INITIAL_FORM_STATE, formData)
  logger.debug('addStylistActionForm completed', { response })
  // Poți adăuga logică aici pentru a gestiona răspunsul, de exemplu, notificări toast
}
