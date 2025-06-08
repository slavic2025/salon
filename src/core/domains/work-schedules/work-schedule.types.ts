import { z } from 'zod'
import { Tables } from '@/types/database.types'

export type WorkSchedule = Tables<'work_schedules'>

export const workScheduleSchema = z
  .object({
    weekday: z.coerce.number().min(0).max(6), // 0=Duminică, 6=Sâmbătă
    start_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalid (HH:MM)'),
    end_time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalid (HH:MM)'),
  })
  .refine((data) => data.start_time < data.end_time, {
    message: 'Ora de început trebuie să fie înainte de ora de sfârșit',
    path: ['end_time'],
  })

export type WorkScheduleInput = z.infer<typeof workScheduleSchema>
