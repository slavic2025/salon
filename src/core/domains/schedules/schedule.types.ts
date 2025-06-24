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

export const createScheduleFormSchema = z
  .object({
    stylistId: uuidField('ID-ul stilistului este invalid.'),
    weekday: z.enum(SCHEDULE_CONSTANTS.WEEKDAYS), // Am presupus că ai această constantă
    startTime: timeField('Ora de început este invalidă.'),
    endTime: timeField('Ora de sfârșit este invalidă.'),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'Ora de început trebuie să fie înaintea orei de sfârșit.',
    path: ['endTime'],
  })

/**
 * Schema finală, folosită de Service Layer pe server.
 * Preia schema de formular și îi adaugă pasul de transformare.
 */
export const createSchedulePayloadSchema = createScheduleFormSchema.transform((data) => ({
  stylist_id: data.stylistId,
  weekday: data.weekday,
  start_time: data.startTime,
  end_time: data.endTime,
}))

export const deleteScheduleSchema = z.object({
  id: uuidField('ID-ul programului de lucru este invalid.'),
})

// --- Tipuri Derivate ---
/** Tipul pentru datele din formularul UI (camelCase). */
export type CreateScheduleInput = z.infer<typeof createScheduleFormSchema>

/** Tipul pentru datele gata de a fi inserate în DB (snake_case). */
export type ScheduleCreateData = z.output<typeof createSchedulePayloadSchema>

export type DeleteScheduleInput = z.infer<typeof deleteScheduleSchema>
