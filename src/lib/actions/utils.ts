// lib/actions/utils.ts
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { ActionResponse } from '@/types/types'
import { formatZodErrors } from '@/lib/form'

const commonLogger = createLogger('CommonActions')

/**
 * Gestionează erorile de validare Zod și returnează un răspuns standardizat.
 * @param {z.ZodError} error - Eroarea Zod.
 * @param {string} message - Mesajul de eroare pentru utilizator.
 * @returns {ActionResponse} Răspunsul acțiunii.
 */
export const handleZodError = (error: z.ZodError, message: string): ActionResponse => {
  commonLogger.warn(`Validation error: ${message}`, { errors: error.flatten() })
  return {
    success: false,
    message,
    errors: formatZodErrors(error),
  }
}

/**
 * Gestionează erorile neașteptate și returnează un răspuns standardizat.
 * Loghează detaliile erorii pentru depanare.
 * @param {string} actionName - Numele acțiunii unde a apărut eroarea.
 * @param {unknown} error - Obiectul eroare.
 * @param {Record<string, unknown>} extra - Date suplimentare de logat.
 * @returns {ActionResponse} Răspunsul acțiunii.
 */
export const handleUnexpectedError = (
  actionName: string,
  error: unknown,
  extra: Record<string, unknown> = {}
): ActionResponse => {
  const err = error as Error
  commonLogger.error(`${actionName}: Unexpected error occurred.`, {
    message: err.message,
    name: err.name,
    stack: err.stack,
    originalError: error,
    ...extra,
  })
  return { success: false, message: 'A apărut o eroare. Vă rugăm să încercați din nou.' }
}

/**
 * Validează un ID extras dintr-un FormData folosind o schemă Zod specifică (string).
 * @param {FormData} formData - Datele formularului.
 * @param {z.ZodSchema<string>} idSchema - Schema Zod pentru validarea ID-ului (ex: z.string().uuid()).
 * @param {string} entityName - Numele entității pentru logare (ex: 'service', 'stylist').
 * @returns {string} ID-ul validat.
 * @throws {z.ZodError} Dacă validarea eșuează.
 */
export const validateIdFromFormData = (
  formData: FormData,
  idSchema: z.ZodSchema<string>,
  entityName: string
): string => {
  const id = formData.get('id')
  const validation = idSchema.safeParse(id)

  if (!validation.success) {
    commonLogger.warn(`Invalid ${entityName} ID found in FormData.`, { id, errors: validation.error.flatten() })
    throw validation.error
  }
  return validation.data
}

/**
 * Funcție wrapper generică pentru acțiuni de server (ADD, UPDATE).
 * Gestionează logarea, validarea Zod și gestionarea erorilor comune.
 * Presupune că datele din FormData au fost deja preprocesate (e.g., cu extract...DataFromForm).
 * @param {string} actionName - Numele acțiunii (ex: 'addServiceAction', 'updateStylistAction').
 * @param {T} data - Obiectul de date preprocesat (gata de validare cu schema Zod).
 * @param {z.ZodSchema<T>} schema - Schema Zod pentru validarea datelor.
 * @param {string} revalidatePathValue - Calea de revalidat după succes.
 * @param {(validatedData: T) => Promise<void>} specificOperation - Funcția care execută operațiunea CRUD (insert, update).
 * @param {K} [entityIdForLog] - ID-ul entității pentru logare, dacă este cazul (nu pentru validare).
 * @returns {Promise<ActionResponse>} Răspunsul acțiunii.
 */
export async function runServerAction<T extends object, K extends string>(
  actionName: string,
  data: T, // <-- Acum primește obiectul de date deja extras și preprocesat
  schema: z.ZodType<T>,
  revalidatePathValue: string,
  specificOperation: (validatedData: T) => Promise<void>, // Operația nu mai primește ID separat de data
  entityIdForLog?: K // ID-ul este doar pentru logare, nu pentru validare în schema
): Promise<ActionResponse> {
  commonLogger.debug(`${actionName} invoked.`, {
    ...(entityIdForLog && { id: entityIdForLog }),
    data: data, // Loghează datele preprocesate
  })

  try {
    const validatedData = schema.parse(data) // Validează direct obiectul de date

    await specificOperation(validatedData) // Execută operația specifică cu datele validate

    commonLogger.info(`${actionName}: Operation successful.`, {
      ...(entityIdForLog && { id: entityIdForLog }),
    })
    return { success: true, message: `${actionName.split(' ')[0]} a fost procesat cu succes!` }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, `Eroare de validare la ${actionName.toLowerCase()}!`)
    }
    return handleUnexpectedError(actionName, error, {
      ...(entityIdForLog && { id: entityIdForLog }),
    })
  } finally {
    revalidatePath(revalidatePathValue)
  }
}

/**
 * Funcție wrapper generică pentru acțiunile de server DELETE.
 * Gestionează logarea, validarea ID-ului și gestionarea erorilor comune.
 * @param {string} actionName - Numele acțiunii (ex: 'deleteServiceAction').
 * @param {FormData} formData - Datele formularului (pentru a extrage ID-ul).
 * @param {z.ZodSchema<K>} idSchema - Schema Zod pentru validarea ID-ului.
 * @param {string} revalidatePathValue - Calea de revalidat după succes.
 * @param {(id: K) => Promise<void>} deleteOperation - Funcția care execută operațiunea de ștergere.
 * @param {string} entityName - Numele entității pentru mesaje de logare.
 * @returns {Promise<ActionResponse>} Răspunsul acțiunii.
 */
export async function runDeleteAction<K extends string>(
  actionName: string,
  formData: FormData, // Primește FormData pentru a extrage ID-ul
  idSchema: z.ZodSchema<K>,
  revalidatePathValue: string,
  deleteOperation: (id: K) => Promise<void>,
  entityName: string
): Promise<ActionResponse> {
  let entityId: K | undefined

  commonLogger.debug(`${actionName} invoked.`, {
    formDataEntries: Object.fromEntries(formData.entries()), // Loghează și FormData pentru delete
  })

  try {
    // Validăm ID-ul separat pentru ștergere
    entityId = validateIdFromFormData(formData, idSchema, entityName) as K

    await deleteOperation(entityId)

    commonLogger.info(`${actionName}: Successfully deleted ${entityName}.`, { id: entityId })
    return { success: true, message: `${entityName} a fost șters cu succes!` }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error, `ID-ul ${entityName} este invalid pentru ștergere.`)
    }
    return handleUnexpectedError(actionName, error, { id: entityId })
  } finally {
    revalidatePath(revalidatePathValue)
  }
}
