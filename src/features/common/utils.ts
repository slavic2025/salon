import { z } from 'zod'
import { ActionResponse } from '@/types/actions.types'

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
 * Gestionează erorile de validare Zod într-un format standard
 */
export function handleValidationError(error: z.ZodError, errorMessage: string): ActionResponse {
  return {
    success: false,
    message: errorMessage,
    errors: error.errors.reduce(
      (acc, err) => {
        const path = err.path.join('.')
        acc[path] = [err.message]
        return acc
      },
      {} as Record<string, string[]>
    ),
  }
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
