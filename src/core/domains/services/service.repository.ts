// src/core/domains/services/service.repository.ts (Varianta finală, refactorizată)
import 'server-only'

import { createLogger } from '@/lib/logger'
import { executeQuery } from '@/lib/db-helpers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Service, ServiceCreateData, ServiceUpdatePayload } from './service.types'

/**
 * Factory Function care creează și returnează un obiect repository pentru servicii.
 * @param supabase - O instanță a clientului Supabase.
 * @returns Un obiect cu metode pentru a interacționa cu tabela 'services'.
 */
export function createServiceRepository(supabase: SupabaseClient) {
  const logger = createLogger('ServiceRepository')
  const TABLE_NAME = 'services'

  return {
    /** Găsește toate serviciile, ordonate după nume. */
    async findAll(): Promise<Service[] | null> {
      logger.debug('Fetching all services...')
      const query = supabase.from(TABLE_NAME).select('*').order('name', { ascending: true })
      return executeQuery(logger, query, { context: 'findAllServices' })
    },

    /** Găsește toate serviciile active, ordonate după nume. */
    async findActive(): Promise<Service[] | null> {
      logger.debug('Fetching active services...')
      const query = supabase.from(TABLE_NAME).select('*').eq('is_active', true).order('name', { ascending: true })
      return executeQuery(logger, query, { context: 'findActiveServices' })
    },

    /** Găsește un serviciu după ID. */
    async findById(id: string): Promise<Service | null> {
      logger.debug(`Fetching service by id: ${id}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('id', id).maybeSingle()
      return executeQuery(logger, query, { context: 'findServiceById' })
    },

    /** Creează un nou serviciu. */
    async create(data: ServiceCreateData): Promise<Service> {
      logger.debug('Creating a new service...', { data })
      const query = supabase.from(TABLE_NAME).insert(data).select().single()
      return executeQuery(logger, query, { context: 'createService', throwOnNull: true })
    },

    /** Actualizează un serviciu. */
    async update(payload: ServiceUpdatePayload): Promise<Service> {
      const { id, data } = payload
      logger.debug(`Updating service with id: ${id}`, { data })
      const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
      return executeQuery(logger, query, { context: 'updateService', throwOnNull: true })
    },

    /** Șterge un serviciu. */
    async delete(id: string): Promise<void> {
      logger.debug(`Deleting service with id: ${id}`)
      const query = supabase.from(TABLE_NAME).delete().eq('id', id)
      await executeQuery(logger, query, { context: 'deleteService' })
    },
    /** Găsește un serviciu după nume. */
    async findByName(name: string): Promise<Service | null> {
      logger.debug(`Fetching service by name: ${name}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('name', name).maybeSingle()
      return executeQuery(logger, query, { context: 'findServiceByName' })
    },
  }
}
