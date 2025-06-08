// src/core/domains/unavailability/unavailability.types.ts

import { z } from 'zod'
import { Tables, TablesInsert } from '@/types/database.types'

/**
 * Tipul de bază pentru un rând din tabela 'unavailability', generat de Supabase.
 */
export type Unavailability = Tables<'unavailability'>

/**
 * Tipul de date pentru crearea unei noi înregistrări, fără câmpurile auto-generate.
 */
export type UnavailabilityCreateData = Omit<TablesInsert<'unavailability'>, 'id' | 'created_at' | 'updated_at'>

/**
 * Schema Zod pentru validarea datelor la ADĂUGAREA/EDITAREA unei perioade de indisponibilitate.
 */
export const unavailabilitySchema = z
  .object({
    // `coerce` convertește automat string-urile din formular în obiecte Date
    start_datetime: z.coerce.date({
      required_error: 'Data de început este obligatorie.',
    }),
    end_datetime: z.coerce.date({
      required_error: 'Data de sfârșit este obligatorie.',
    }),
    is_all_day: z.boolean().default(false),
    reason: z.string().nullable(),
    // 'type' poate fi folosit pentru a categorisi (ex: 'Vacanță', 'Concediu Medical')
    type: z.string().nullable(),
  })
  .refine((data) => data.start_datetime < data.end_datetime, {
    message: 'Data de început trebuie să fie înainte de data de sfârșit.',
    path: ['end_datetime'], // Atribuie eroarea câmpului de sfârșit
  })

/**
 * Tipul de date pentru formular, derivat automat din schema Zod.
 */
export type UnavailabilityInput = z.infer<typeof unavailabilitySchema>

/**
 * Schema Zod pentru ȘTERGEREA unei perioade (validează doar ID-ul).
 */
export const deleteUnavailabilitySchema = z.string().uuid('ID-ul este invalid.')
