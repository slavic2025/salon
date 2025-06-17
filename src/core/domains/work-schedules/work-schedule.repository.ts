// src/core/domains/work-schedules/work-schedule.repository.ts
import 'server-only'

import { createLogger } from '@/lib/logger'
import { executeQuery } from '@/lib/db-helpers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { WorkSchedule, WorkScheduleCreateData } from './work-schedule.types'

export function createWorkScheduleRepository(supabase: SupabaseClient) {
  const logger = createLogger('WorkScheduleRepository')
  const TABLE_NAME = 'work_schedules'

  return {
    async findByStylistId(stylistId: string): Promise<WorkSchedule[]> {
      logger.debug(`Fetching schedules for stylist id: ${stylistId}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('stylist_id', stylistId).order('weekday')
      const result = await executeQuery<WorkSchedule[]>(logger, query, { context: 'findSchedulesByStylistId' })
      return result || []
    },

    async create(data: WorkScheduleCreateData): Promise<WorkSchedule> {
      logger.debug('Creating a new schedule...', { data })
      const query = supabase.from(TABLE_NAME).insert(data).select().single()
      return executeQuery<WorkSchedule>(logger, query, { context: 'createSchedule', throwOnNull: true })
    },

    async delete(id: string): Promise<void> {
      logger.debug(`Deleting schedule with id: ${id}`)
      const query = supabase.from(TABLE_NAME).delete().eq('id', id)
      await executeQuery(logger, query, { context: 'deleteSchedule' })
    },
  }
}
