// src/core/domains/services/service.repository.ts
import 'server-only'
import { createClient } from '@/lib/supabase-server'
import { createLogger } from '@/lib/logger'
import { Service, ServiceCreateData, ServiceUpdateData } from './service.types'

const logger = createLogger('ServiceRepository')
const TABLE_NAME = 'services'

async function handleSupabaseError<T>(promise: PromiseLike<{ data: T; error: any }>, context: string): Promise<T> {
  const { data, error } = await promise
  if (error) {
    logger.error(`Supabase query failed in ${context}`, { message: error.message })
    throw new Error(`Database error during ${context}: ${error.message}`)
  }
  return data
}

export const serviceRepository = {
  async fetchAll(): Promise<Service[]> {
    logger.debug('Fetching all services...')
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select('*').order('name', { ascending: true })
    return (await handleSupabaseError(query, 'fetchAllServices')) as Service[]
  },

  async fetchById(id: string): Promise<Service | null> {
    logger.debug(`Fetching service with id: ${id}`)
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select('*').eq('id', id).maybeSingle()
    return await handleSupabaseError(query, `fetchServiceById(${id})`)
  },

  async getActiveServices(): Promise<Service[]> {
    logger.debug('Fetching active services for public page...')
    const supabase = await createClient()
    const query = supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('is_active', true) // Filtram doar serviciile active
      .order('name', { ascending: true })

    // Folosim acelasi handler de erori
    return (await handleSupabaseError(query, 'getActiveServices')) as Service[]
  },

  async create(data: ServiceCreateData): Promise<Service> {
    logger.debug('Creating a new service...', { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).insert(data).select().single()
    const newService = await handleSupabaseError(query, 'createService')
    if (!newService) {
      throw new Error('Database error: Failed to return the new service after creation.')
    }
    return newService
  },

  async update(id: string, data: ServiceUpdateData): Promise<Service> {
    logger.debug(`Updating service with id: ${id}`, { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
    const updatedService = await handleSupabaseError(query, `updateService(${id})`)
    if (!updatedService) {
      throw new Error('Database error: Failed to return the service after update.')
    }
    return updatedService
  },

  async remove(id: string): Promise<void> {
    logger.debug(`Deleting service with id: ${id}`)
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).delete().eq('id', id)
    await handleSupabaseError(query, `removeService(${id})`)
  },
}
