// src/core/domains/services-offered/services-offered.repository.ts (Refactorizat)
import 'server-only'
import { createLogger } from '@/lib/logger'
import { executeQuery } from '@/lib/db-helpers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { ServiceOffered, ServiceOfferedCreateData, ServiceOfferedUpdateData } from './services-offered.types'
import type { TablesInsert } from '@/types/database.types'

/**
 * Factory function pentru repository-ul services_offered.
 * @param supabase - Instanță SupabaseClient
 */
export function createServicesOfferedRepository(supabase: SupabaseClient) {
  const logger = createLogger('ServicesOfferedRepository')
  const TABLE_NAME = 'services_offered'

  return {
    /** Găsește toate serviciile oferite. */
    async findAll(): Promise<ServiceOffered[] | null> {
      logger.debug('Fetching all services_offered...')
      const query = supabase.from(TABLE_NAME).select('*').order('created_at', { ascending: false })
      return executeQuery(logger, query, { context: 'findAllServicesOffered' })
    },

    /** Găsește toate serviciile oferite pentru un stilist, cu detalii despre serviciu. */
    async findByStylistId(stylistId: string): Promise<ServiceOffered[] | null> {
      logger.debug(`Fetching services_offered for stylist: ${stylistId}`)
      const query = supabase
        .from(TABLE_NAME)
        .select('*, services(name, duration_minutes, price)')
        .eq('stylist_id', stylistId)
        .order('created_at', { ascending: false })
      return executeQuery(logger, query, { context: 'findByStylistId' })
    },

    /** Creează o legătură serviciu-stilist. */
    async create(data: ServiceOfferedCreateData): Promise<ServiceOffered> {
      logger.debug('Creating a new service_offered...', { data })
      const query = supabase.from(TABLE_NAME).insert(data).select().single()
      return executeQuery(logger, query, { context: 'createServiceOffered', throwOnNull: true })
    },

    /** Actualizează o legătură serviciu-stilist. */
    async update(id: string, data: ServiceOfferedUpdateData): Promise<ServiceOffered> {
      logger.debug(`Updating service_offered with id: ${id}`, { data })
      const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
      return executeQuery(logger, query, { context: 'updateServiceOffered', throwOnNull: true })
    },

    /** Șterge o legătură serviciu-stilist. */
    async delete(id: string): Promise<void> {
      logger.debug(`Deleting service_offered with id: ${id}`)
      const query = supabase.from(TABLE_NAME).delete().eq('id', id)
      await executeQuery(logger, query, { context: 'deleteServiceOffered' })
    },

    /** Verifică dacă există deja o legătură stilist-serviciu (unicitate). */
    async checkUniqueness(stylistId: string, serviceId: string): Promise<boolean> {
      logger.debug(`Checking uniqueness for stylist: ${stylistId}, service: ${serviceId}`)
      const query = supabase
        .from(TABLE_NAME)
        .select('id', { count: 'exact' })
        .eq('stylist_id', stylistId)
        .eq('service_id', serviceId)
      const result = await executeQuery(logger, query, { context: 'checkUniqueness' })
      // Dacă există cel puțin un rând, nu este unic
      return !!(result && Array.isArray(result) && result.length > 0)
    },
  }
}
