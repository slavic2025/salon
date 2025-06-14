import { ActionResponse } from '@/types/actions.types'
import { formatZodErrors } from '@/lib/form'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ActionHelpers')

// Constante pentru mesaje comune
export const COMMON_MESSAGES = {
  INVALID_DATA: 'Datele introduse sunt invalide.',
  UNEXPECTED_ERROR: 'A apărut o eroare neașteptată.',
  NOT_FOUND: 'Înregistrarea nu a fost găsită.',
  DUPLICATE_DATA: 'O înregistrare cu aceste date există deja.',
  INVALID_ID: 'ID-ul este invalid.',
  FETCH_ERROR: 'A apărut o eroare la preluarea datelor. Te rugăm să încerci din nou.',
  UPDATE_SUCCESS: 'Înregistrarea a fost actualizată cu succes!',
  DELETE_SUCCESS: 'Înregistrarea a fost ștearsă cu succes.',
  CREATE_SUCCESS: 'Înregistrarea a fost creată cu succes!',
} as const

/**
 * Helper pentru gestionarea erorilor de validare
 */
export const handleValidationError = (error: any): ActionResponse => ({
  success: false,
  message: COMMON_MESSAGES.INVALID_DATA,
  errors: formatZodErrors(error),
})

/**
 * Helper pentru gestionarea erorilor de unicitate
 */
export const handleUniquenessErrors = (errors: Array<{ field: string; message: string }>): ActionResponse => {
  const formattedErrors: Record<string, string[]> = {}
  errors.forEach((err) => {
    formattedErrors[err.field] = [err.message]
  })
  return {
    success: false,
    message: COMMON_MESSAGES.DUPLICATE_DATA,
    errors: formattedErrors,
  }
}

/**
 * Helper pentru gestionarea erorilor generale
 */
export const handleError = (error: unknown, context: string): ActionResponse => {
  logger.error(`Error in ${context}`, { error })
  return {
    success: false,
    message: COMMON_MESSAGES.UNEXPECTED_ERROR + (error as Error).message,
  }
}

/**
 * Helper pentru verificarea existenței unei înregistrări
 */
export const checkRecordExists = async <T>(
  fetchFn: () => Promise<T | null>,
  errorMessage: string = COMMON_MESSAGES.NOT_FOUND
): Promise<{ exists: boolean; data: T | null; error?: string }> => {
  try {
    const data = await fetchFn()
    if (!data) {
      return { exists: false, data: null, error: errorMessage }
    }
    return { exists: true, data }
  } catch (error) {
    logger.error('Error checking record existence', { error })
    return { exists: false, data: null, error: (error as Error).message }
  }
}

/**
 * Helper pentru operațiuni de bază de date
 */
export const dbOperation = async <T>(
  operation: () => Promise<T>,
  context: string
): Promise<{ success: boolean; data?: T; error?: string }> => {
  try {
    const data = await operation()
    return { success: true, data }
  } catch (error) {
    logger.error(`Error in ${context}`, { error })
    return { success: false, error: (error as Error).message }
  }
}
