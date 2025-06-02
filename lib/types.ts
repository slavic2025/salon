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
