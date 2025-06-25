// src/core/domains/schedules/schedule.types.ts

import { z } from 'zod'
import { Tables, TablesUpdate } from '@/types/database.types'
import { uuidField, timeField } from '@/config/validation/fields'
import { SCHEDULE_CONSTANTS } from './schedule.constants'

/** Tipul unui rând din tabela 'schedules'. */
export type Schedules = Tables<'schedules'>

/** Tipul datelor pentru un UPDATE în tabela 'schedules'. */
export type ScheduleUpdateData = TablesUpdate<'schedules'>

// --- Scheme de Validare Zod ---

/**
 * Schema folosită de formularul de pe client (react-hook-form).
 * Validează că `weekday` este unul dintre string-urile permise.
 */
export const createScheduleFormSchema = z
  .object({
    stylistId: uuidField('ID-ul stilistului este invalid.'),

    // Validează că `weekday` este unul dintre string-urile din array-ul nostru de constante
    weekday: z.enum(SCHEDULE_CONSTANTS.WEEKDAY_NAMES, {
      required_error: 'Ziua săptămânii este obligatorie.',
      invalid_type_error: 'Selectează o zi validă a săptămânii.',
    }),

    startTime: timeField('Ora de început este invalidă.'),
    endTime: timeField('Ora de sfârșit este invalidă.'),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'Ora de început trebuie să fie înaintea orei de sfârșit.',
    path: ['endTime'],
  })

/**
 * Schema finală, folosită de Service Layer pe server.
 * Preia schema de formular și îi adaugă pasul de transformare a datelor.
 */
export const createSchedulePayloadSchema = createScheduleFormSchema.transform((data) => {
  // Folosim "dicționarul" pentru a converti string-ul (ex: "Luni") în numărul corespunzător (ex: 1)
  const weekdayAsNumber = SCHEDULE_CONSTANTS.WEEKDAY_MAP[data.weekday]

  return {
    stylist_id: data.stylistId,
    weekday: weekdayAsNumber, // Payload-ul final conține valoarea numerică
    start_time: data.startTime,
    end_time: data.endTime,
  }
})

export const deleteScheduleSchema = z.object({
  id: uuidField('ID-ul programului de lucru este invalid.'),
})

// --- Tipuri Derivate ---
/** Tipul pentru datele din formularul UI (camelCase). */
export type CreateScheduleInput = z.infer<typeof createScheduleFormSchema>

/** Tipul pentru datele gata de a fi inserate în DB (snake_case). */
export type ScheduleCreateData = z.output<typeof createSchedulePayloadSchema>

export type DeleteScheduleInput = z.infer<typeof deleteScheduleSchema>
