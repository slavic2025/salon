import 'server-only'
import { createClient } from '@/lib/supabase-server'
import { createLogger } from '@/lib/logger'
import { Schedule, ScheduleCreateData, ScheduleUpdateData } from './schedule.types'

const logger = createLogger('ScheduleRepository')
const TABLE_NAME = 'work_schedules'

async function handleSupabaseError<T>(promise: PromiseLike<{ data: T; error: any }>, context: string): Promise<T> {
  const { data, error } = await promise
  if (error) {
    logger.error(`Supabase query failed in ${context}`, { message: error.message, details: error.details })
    throw new Error(`Database error during ${context}: ${error.message}`)
  }
  return data
}

export const scheduleRepository = {
  async fetchAll(): Promise<Schedule[]> {
    logger.debug('Fetching all schedules...')
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select('*').order('weekday', { ascending: true })
    return (await handleSupabaseError(query, 'fetchAll')) as Schedule[]
  },

  async fetchById(id: string): Promise<Schedule | null> {
    logger.debug(`Fetching schedule with id: ${id}`)
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select('*').eq('id', id).maybeSingle()
    return await handleSupabaseError(query, `fetchById(${id})`)
  },

  async fetchByStylistId(stylistId: string): Promise<Schedule[]> {
    logger.debug(`Fetching schedules for stylist id: ${stylistId}`)
    const supabase = await createClient()
    const query = supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('stylist_id', stylistId)
      .order('weekday', { ascending: true })
    return (await handleSupabaseError(query, `fetchByStylistId(${stylistId})`)) as Schedule[]
  },

  async create(data: ScheduleCreateData): Promise<Schedule> {
    logger.debug('Creating a new schedule...', { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).insert(data).select().single()
    const newSchedule = await handleSupabaseError(query, 'create')
    if (!newSchedule) {
      throw new Error('Database error: Failed to return the new schedule after creation.')
    }
    return newSchedule
  },

  async update(id: string, data: ScheduleUpdateData): Promise<Schedule> {
    logger.debug(`Updating schedule with id: ${id}`, { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
    const updatedSchedule = await handleSupabaseError(query, `update(${id})`)
    if (!updatedSchedule) {
      throw new Error('Database error: Failed to return the schedule after update.')
    }
    return updatedSchedule
  },

  async remove(id: string): Promise<void> {
    logger.debug(`Deleting schedule with id: ${id}`)
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).delete().eq('id', id)
    await handleSupabaseError(query, `remove(${id})`)
  },
}
