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
import { ActionResponse } from '@/types/types'
import { formatZodErrors } from '@/lib/form'

const logger = createLogger('StylistActions')

// Funcție ajutătoare pentru a converti FormData într-un obiect curat pentru validare
function formDataToObject(formData: FormData): Record<string, unknown> {
  const object: Record<string, any> = {}
  formData.forEach((value, key) => {
    // Gestionează checkbox-ul care este 'on' când e bifat și absent când nu e.
    if (key === 'is_active') {
      object[key] = value === 'on'
    } else {
      object[key] = value
    }
  })
  // Asigură că 'is_active' este boolean chiar dacă checkbox-ul nu a fost în FormData
  if (object.is_active === undefined) {
    object.is_active = false
  }
  return object
}

/**
 * Acțiune pentru adăugarea unui nou stilist.
 */
export async function addStylistAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('addStylistAction invoked', { rawData })

  // 1. Validează datele din formular cu schema Zod
  const validationResult = addStylistSchema.safeParse(rawData)

  if (!validationResult.success) {
    const errors = formatZodErrors(validationResult.error)
    logger.warn('Validation failed for addStylistAction', { errors })
    return {
      success: false,
      message: 'Eroare de validare. Vă rugăm corectați câmpurile.',
      errors: errors,
    }
  }

  const validatedData = validationResult.data

  try {
    // 2. Verifică unicitatea datelor înainte de a crea
    const uniquenessErrors = await stylistRepository.checkUniqueness(
      {
        email: validatedData.email,
        name: validatedData.name,
        phone: validatedData.phone,
      },
      null // null pentru idToExclude, deoarece creăm o entitate nouă
    )

    if (uniquenessErrors.length > 0) {
      const errors: Record<string, string[]> = {}
      uniquenessErrors.forEach((err) => {
        errors[err.field] = [err.message]
      })
      logger.warn('Uniqueness check failed', { errors })
      return { success: false, message: 'Un stilist cu aceste date există deja.', errors }
    }

    // 3. Apelează repository-ul pentru a crea stilistul
    await stylistRepository.create(validatedData)
    logger.info('Stylist created successfully', { name: validatedData.name })

    // 4. Revalidează calea pentru a afișa datele noi
    revalidatePath('/admin/stylists')

    return {
      success: true,
      message: `Stilistul "${validatedData.name}" a fost adăugat cu succes!`,
    }
  } catch (error) {
    logger.error('Unexpected error in addStylistAction', { error })
    return {
      success: false,
      message: 'A apărut o eroare de server. Vă rugăm încercați din nou.',
    }
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
