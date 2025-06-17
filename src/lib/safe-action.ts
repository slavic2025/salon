import { z } from 'zod'
import { formDataToObject } from './form-utils'
import { ActionResponse } from '@/types/actions.types'
import { createLogger } from './logger'
import { AppError } from './errors'

const logger = createLogger('SafeAction')

/**
 * Opțiuni pentru configurarea unei acțiuni sigure.
 */
interface SafeActionOptions {
  /** Mesajul de eroare de afișat în caz de eroare de server neașteptată. */
  serverErrorMessage?: string
}

/**
 * O funcție de nivel înalt care creează o Server Action sigură și tipizată.
 */
export function createSafeAction<TInput extends z.ZodType, TOutput>(
  schema: TInput,
  handler: (input: z.infer<TInput>) => Promise<TOutput>,
  // Pasul 1: Adăugăm al treilea parametru, opțional
  options?: SafeActionOptions
) {
  return async (prevState: ActionResponse<TOutput>, formData: FormData): Promise<ActionResponse<TOutput>> => {
    const rawData = formDataToObject(formData)
    const validationResult = schema.safeParse(rawData)

    if (!validationResult.success) {
      return {
        success: false,
        errors: validationResult.error.flatten().fieldErrors,
      }
    }

    try {
      const result = await handler(validationResult.data)
      return { success: true, data: result }
    } catch (error) {
      logger.error('Safe action failed', { error })

      // Pasul 2: Folosim mesajul din opțiuni sau un mesaj de la AppError, sau unul generic
      const message =
        options?.serverErrorMessage || (error instanceof AppError ? error.message : 'A apărut o eroare neașteptată.')

      return { success: false, message }
    }
  }
}
