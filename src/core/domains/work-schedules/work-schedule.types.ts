// src/core/domains/work-schedules/work-schedule.types.ts

import { z } from 'zod'
import { Tables, TablesUpdate } from '@/types/database.types'
import { uuidField, timeField } from '@/config/validation/fields'
import { WORK_SCHEDULE_CONSTANTS } from './work-schedule.constants'

/** Tipul unui rând din tabela 'work_schedules'. */
export type WorkSchedule = Tables<'work_schedule'>

/** Tipul datelor pentru un UPDATE în tabela 'work_schedules'. */
export type WorkScheduleUpdateData = TablesUpdate<'work_schedule'>

// --- Scheme de Validare Zod ---

export const createWorkScheduleSchema = z
  .object({
    stylistId: uuidField('ID-ul stilistului este invalid.'),
    weekday: z.nativeEnum(WORK_SCHEDULE_CONSTANTS.WEEKDAYS_ENUM),
    startTime: timeField('Ora de început este invalidă.'),
    endTime: timeField('Ora de sfârșit este invalidă.'),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'Ora de început trebuie să fie înaintea orei de sfârșit.',
    path: ['endTime'],
  })
  .transform((data) => ({
    stylist_id: data.stylistId,
    weekday: data.weekday,
    start_time: data.startTime,
    end_time: data.endTime,
  }))

export const deleteWorkScheduleSchema = z.object({
  id: uuidField('ID-ul programului de lucru este invalid.'),
})

// --- Tipuri Derivate ---

export type CreateWorkScheduleInput = z.input<typeof createWorkScheduleSchema>
export type WorkScheduleCreateData = z.output<typeof createWorkScheduleSchema>
export type DeleteWorkScheduleInput = z.infer<typeof deleteWorkScheduleSchema>
