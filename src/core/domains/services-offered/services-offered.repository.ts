// src/core/domains/services-offered/services-offered.repository.ts
import 'server-only'
import { createClient } from '@/lib/supabase-server'
import { createLogger } from '@/lib/logger'
import { ServicesOfferedData } from './services-offered.types'
import { TablesInsert, TablesUpdate } from '@/types/database.types'

const logger = createLogger('ServicesOfferedRepository')
const TABLE_NAME = 'services_offered'

type ServiceOfferedInsert = Omit<TablesInsert<'services_offered'>, 'id' | 'created_at' | 'updated_at'>
type ServiceOfferedUpdate = TablesUpdate<'services_offered'>

export const servicesOfferedRepository = {
  async create(data: ServiceOfferedInsert): Promise<ServicesOfferedData> {
    const supabase = await createClient()
    const { data: newRecord, error } = await supabase.from(TABLE_NAME).insert(data).select().single()
    if (error) {
      logger.error('Error creating service offered', { error })
      throw new Error(error.message)
    }
    return newRecord
  },

  async update(id: string, data: ServiceOfferedUpdate): Promise<ServicesOfferedData> {
    const supabase = await createClient()
    const { data: updatedRecord, error } = await supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
    if (error) {
      logger.error('Error updating service offered', { id, error })
      throw new Error(error.message)
    }
    return updatedRecord
  },

  async remove(id: string): Promise<void> {
    const supabase = await createClient()
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id)
    if (error) {
      logger.error('Error removing service offered', { id, error })
      throw new Error(error.message)
    }
  },

  async fetchByStylistId(stylistId: string): Promise<ServicesOfferedData[]> {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*, services(name, duration_minutes, price)')
      .eq('stylist_id', stylistId)
      .order('created_at', { ascending: false })

    if (error) {
      logger.error('Error fetching services for stylist', { stylistId, error })
      throw new Error(error.message)
    }
    return data as ServicesOfferedData[]
  },

  async checkUniqueness(stylistId: string, serviceId: string): Promise<boolean> {
    const supabase = await createClient()
    const { count, error } = await supabase
      .from(TABLE_NAME)
      .select('id', { count: 'exact' })
      .eq('stylist_id', stylistId)
      .eq('service_id', serviceId)

    if (error) {
      logger.error('Error checking uniqueness', { stylistId, serviceId, error })
      throw new Error('Database error during uniqueness check.')
    }
    return (count ?? 0) > 0
  },
}
