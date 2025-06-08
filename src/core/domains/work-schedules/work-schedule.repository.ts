import 'server-only'
import { createClient } from '@/lib/supabase-server'
import { WorkSchedule, WorkScheduleInput } from './work-schedule.types'
import { TablesInsert } from '@/types/database.types'

export const workScheduleRepository = {
  async fetchByStylistId(stylistId: string): Promise<WorkSchedule[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('work_schedules')
      .select('*')
      .eq('stylist_id', stylistId)
      .order('weekday')
      .order('start_time')
    if (error) throw error
    return data
  },
  async create(data: TablesInsert<'work_schedules'>): Promise<WorkSchedule> {
    const supabase = await createClient()
    const { data: newRecord, error } = await supabase.from('work_schedules').insert(data).select().single()
    if (error) throw error
    return newRecord
  },
  async remove(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from('work_schedules').delete().eq('id', id)
    if (error) throw error
  },
}
