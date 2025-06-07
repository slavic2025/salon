// lib/types.ts

/**
 * Definește structura generică pentru răspunsurile acțiunilor de server.
 * Permite specificarea tipului pentru câmpurile de eroare (T),
 * defaulting la Record<string, string[]> dacă nu este specificat.
 */
/**
 * Definește structura generică pentru răspunsurile acțiunilor de server.
 * @template TData - Tipul datelor returnate la succes (opțional).
 * @template TErrors - Tipul obiectului de erori de validare.
 */
export interface ActionResponse<TData = unknown, TErrors = Record<string, string[]>> {
  success: boolean
  message?: string
  errors?: TErrors & {
    _form?: string[] // Eroare generală la nivel de formular
  }
  data?: TData // Date returnate la succes
}

export const INITIAL_FORM_STATE: ActionResponse = {
  success: false,
  message: undefined,
  errors: undefined,
  data: undefined,
}
// Tiparea erorilor de câmp
export type FieldErrors = ActionResponse['errors']
