import { ActionResponse } from '@/types/actions.types'
import { createLogger } from '@/lib/logger'
import { z } from 'zod'

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

/**
 * Validează un ID UUID generic
 */
export function validateId(id: unknown, errorMessage: string): ActionResponse | null {
  if (!id || typeof id !== 'string' || !z.string().uuid().safeParse(id).success) {
    return {
      success: false,
      message: errorMessage,
    }
  }
  return null
}

/**
 * Gestionează erorile de server într-un format standard
 */
export function handleServerError(error: unknown, fallbackMessage = 'Eroare necunoscută'): ActionResponse {
  const errorMessage = error instanceof Error ? error.message : fallbackMessage
  return {
    success: false,
    message: errorMessage,
  }
}

/**
 * Formatează erorile Zod într-un obiect field -> [mesaje]
 */
export function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const formattedErrors: Record<string, string[]> = {}
  for (const [key, value] of Object.entries(error.format())) {
    if (typeof value === 'object' && value !== null && '_errors' in value) {
      formattedErrors[key] = (value as { _errors: string[] })._errors
    }
  }
  return formattedErrors
}

/**
 * Verifică dacă o eroare este de tip duplicat (unique constraint)
 */
export function isDuplicateError(error: unknown): boolean {
  return (
    error instanceof Error && (error.message.includes('unique constraint') || error.message.includes('already exists'))
  )
}
