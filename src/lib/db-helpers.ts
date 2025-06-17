// src/lib/db-helpers.ts
import 'server-only'

import { DatabaseError } from '@/lib/errors'
import { Logger } from '@/lib/logger'

/**
 * Un helper generic pentru a executa query-uri Supabase și a gestiona erorile.
 * Poate fi folosit în orice repository.
 *
 * @param logger O instanță a logger-ului, specifică contextului (ex: AppointmentRepository).
 * @param promise Query-ul Supabase care trebuie executat.
 * @param options Opțiuni pentru context și gestionarea rezultatelor nule.
 * @returns Datele returnate de query.
 * @throws {DatabaseError} Dacă query-ul eșuează sau dacă returnează null când nu ar trebui.
 */

// --- Semnături de Supraîncărcare ---

// Semnătura 1: Când throwOnNull este true, promitem să returnăm T (niciodată null).
export async function executeQuery<T>(
  logger: Logger,
  promise: PromiseLike<{ data: T | null; error: any }>,
  options: { context: string; throwOnNull: true }
): Promise<T>

// Semnătura 2: Pentru toate celelalte cazuri, promitem să returnăm T sau null.
export async function executeQuery<T>(
  logger: Logger,
  promise: PromiseLike<{ data: T | null; error: any }>,
  options: { context: string; throwOnNull?: boolean }
): Promise<T | null>

// --- Implementarea Unică ---
// Aceasta rămâne neschimbată, dar acum TypeScript o va lega de semnăturile de mai sus.
export async function executeQuery<T>(
  logger: Logger,
  promise: PromiseLike<{ data: T | null; error: any }>,
  options: { context: string; throwOnNull?: boolean }
): Promise<T | null> {
  const { data, error } = await promise

  if (error) {
    logger.error(`Supabase query failed in ${options.context}`, { error })
    throw new DatabaseError(`Database error during ${options.context}`, error)
  }

  if (options.throwOnNull && data === null) {
    logger.error(`Query in ${options.context} returned null when a result was expected.`)
    throw new DatabaseError(`No result found for ${options.context}.`, null)
  }

  return data
}
