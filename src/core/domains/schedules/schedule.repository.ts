// src/core/domains/schedules/schedule.repository.ts
import 'server-only'

import { createLogger } from '@/lib/logger'
import { executeQuery } from '@/lib/db-helpers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Schedules, ScheduleCreateData } from './schedule.types'

export function createScheduleRepository(supabase: SupabaseClient) {
  const logger = createLogger('SchedulesRepository')
  const TABLE_NAME = 'schedules'

  return {
    async findByStylistId(stylistId: string): Promise<Schedules[]> {
      logger.debug(`Fetching schedules for stylist id: ${stylistId}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('stylist_id', stylistId).order('weekday')
      const result = await executeQuery<Schedules[]>(logger, query, { context: 'findSchedulesByStylistId' })
      return result || []
    },

    async create(data: ScheduleCreateData): Promise<Schedules> {
      logger.debug('Creating a new schedule...', { data })
      const query = supabase.from(TABLE_NAME).insert(data).select().single()
      return executeQuery<Schedules>(logger, query, { context: 'createSchedule', throwOnNull: true })
    },

    async delete(id: string): Promise<void> {
      logger.debug(`Deleting schedule with id: ${id}`)
      const query = supabase.from(TABLE_NAME).delete().eq('id', id)
      await executeQuery(logger, query, { context: 'deleteSchedule' })
    },
    async findForCurrentStylist(): Promise<Schedules[]> {
      logger.debug('Fetching schedule for current stylist via RPC...')
      const rpcPromise = supabase.rpc('get_schedules_for_current_stylist')

      // Folosim helper-ul nostru `executeQuery` și pentru apeluri RPC.
      // În caz de eroare sau rezultat null, returnăm un array gol.
      const result = await executeQuery<Schedules[]>(logger, rpcPromise, {
        context: 'findSchedulesForCurrentStylist',
      })
      return result || []
    },
  }
}
