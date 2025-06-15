import type { Database } from '@/types/database.types'
import { z } from 'zod'
import { uuidField, dateField, timeField } from '@/config/validation/fields'

// Tipul de bază, generat din schema bazei de date
export type Schedule = Database['public']['Tables']['schedule']['Row']

// Tipuri pentru repository
export type ScheduleCreateData = Omit<
  Database['public']['Tables']['schedule']['Insert'],
  'id' | 'created_at' | 'updated_at'
>
export type ScheduleUpdateData = Database['public']['Tables']['schedule']['Update']

// Schema pentru crearea unei programări în program
export const createScheduleSchema = z.object({
  stylistId: uuidField('ID-ul stilistului'),
  date: dateField('Data programării'),
  startTime: timeField('Ora de început'),
  endTime: timeField('Ora de sfârșit'),
})

// Schema pentru actualizarea unei programări în program
export const updateScheduleSchema = createScheduleSchema.extend({
  id: uuidField('ID-ul programării'),
})

// Schema pentru ștergerea unei programări din program
export const deleteScheduleSchema = uuidField('ID-ul programării')
