// lib/types.ts

/**
 * Definește structura generică pentru răspunsurile acțiunilor de server.
 * Permite specificarea tipului pentru câmpurile de eroare (T),
 * defaulting la Record<string, string[]> dacă nu este specificat.
 */
export interface ActionResponse<T = Record<string, string[]>> {
  success: boolean
  message?: string
  errors?: T & {
    _form?: string[] // Eroare generală la nivel de formular
  }
}

export const INITIAL_FORM_STATE: ActionResponse<Record<string, string[]>> = {
  success: false,
  message: undefined,
  errors: undefined,
}

// Tiparea erorilor de câmp
export type FieldErrors = ActionResponse['errors']

export interface TableHeaderConfig {
  label: string
  className?: string
  hideOnMobile?: boolean
}
