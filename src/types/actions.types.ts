// lib/types.ts

/**
 * Definește structura erorilor de câmp returnate de Zod (`.flatten().fieldErrors`).
 * Permite ca valoarea pentru un câmp să fie `undefined` dacă acel câmp nu are erori.
 */
export type ZodFieldErrors = Record<string, string[] | undefined>

/**
 * Interfața standard și unică pentru răspunsul unei Server Action.
 * Este generică pentru a permite tiparea specifică a datelor (`TData`)
 * și a erorilor (`TErrors`).
 *
 * @template TData - Tipul proprietății `data` returnate în caz de succes.
 * @template TErrors - Tipul proprietății `errors` returnate în caz de eșec de validare.
 */
export interface ActionResponse<TData = unknown, TErrors = ZodFieldErrors> {
  success: boolean
  message?: string
  errors?: TErrors & {
    _form?: string[]
  }
  data?: TData
}

export const INITIAL_FORM_STATE: ActionResponse = {
  success: false,
  message: undefined,
  errors: undefined,
  data: undefined,
}
// Tiparea erorilor de câmp
export type FieldErrors = ActionResponse['errors']
