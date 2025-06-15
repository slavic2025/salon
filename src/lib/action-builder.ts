// src/lib/action-builder.ts
import { ActionResponse } from '@/types/actions.types'
import { z, ZodSchema } from 'zod'
import { handleError, handleValidationError } from './action-helpers'
import { AUTH_MESSAGES } from '@/core/domains/auth/auth.constants'
import { createLogger } from './logger'
import { formDataToObject } from './form-utils'

const logger = createLogger('ActionBuilder')

interface BuildFormActionOptions {
  /**
   * Mesaj de eroare personalizat care va fi afișat în caz de eroare de server.
   * Dacă nu este furnizat, se va folosi un mesaj generic.
   */
  errorMessage?: string
}

export function buildFormAction<T extends ZodSchema>(
  schema: T,
  actionLogic: (data: z.infer<T>) => Promise<Partial<ActionResponse>>,
  options?: BuildFormActionOptions // Al treilea parametru, opțional
) {
  return async (prevState: ActionResponse, formData: FormData): Promise<ActionResponse> => {
    logger.debug(`Action built with builder started.`)

    try {
      // 1. Parsează și validează datele
      const rawData = formDataToObject(formData)
      const validationResult = schema.safeParse(rawData)

      if (!validationResult.success) {
        logger.warn('Action validation failed', { errors: validationResult.error.flatten() })
        return handleValidationError(validationResult.error)
      }

      // 2. Execută logica de business specifică acțiunii
      const result = await actionLogic(validationResult.data)

      logger.info('Action logic executed successfully.')

      // 3. Returnează răspunsul de succes, combinând rezultatul logicii cu valorile default
      return {
        success: true,
        message: result.message || 'Acțiune finalizată cu succes.',
        ...result,
      }
    } catch (error) {
      // 4. Gestionează erorile de server (aruncate din `actionLogic`)
      logger.error('Action failed with an error', { error })

      // Folosește mesajul de eroare din opțiuni sau un mesaj generic
      const defaultMessage = 'A apărut o eroare neașteptată la procesarea cererii.'
      return handleError(error, options?.errorMessage || defaultMessage)
    }
  }
}

// Helper pentru a reduce repetiția în acțiunile complexe
export async function validateAndExecute<T>(
  formData: FormData,
  schema: ZodSchema<T>,
  logic: (data: T) => Promise<void>
): Promise<ActionResponse | { success: true }> {
  const rawData = Object.fromEntries(formData)
  const validationResult = schema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  try {
    await logic(validationResult.data)
    return { success: true }
  } catch (error) {
    // Aici putem adăuga logica pentru erori customizate, dacă serviciul le aruncă
    // Exemplu: if (error instanceof InvalidSessionError) { ... }
    return handleError(error, AUTH_MESSAGES.ERROR.SERVER.DEFAULT)
  }
}
