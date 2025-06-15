// src/core/domains/stylists/stylist.repository.ts (Varianta finală, refactorizată)
import 'server-only'

import { createLogger } from '@/lib/logger'
import { executeQuery } from '@/lib/db-helpers'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Stylist, StylistCreateData, StylistUpdatePayload } from './stylist.types'
import { DatabaseError } from '@/lib/errors'

/**
 * Factory Function care creează și returnează un obiect repository pentru stiliști.
 * @param supabase - O instanță a clientului Supabase.
 * @returns Un obiect cu metode pentru a interacționa cu tabela 'stylists'.
 */
export function createStylistRepository(supabase: SupabaseClient) {
  const logger = createLogger('StylistRepository')
  const TABLE_NAME = 'stylists'

  return {
    /** Găsește toți stiliștii, ordonați după nume. */
    async findAll(): Promise<Stylist[]> {
      logger.debug('Fetching all stylists...')
      const query = supabase.from(TABLE_NAME).select('*').order('full_name', { ascending: true })
      return executeQuery(logger, query, { context: 'findAllStylists' })
    },

    /** Găsește un stilist după ID. */
    async findById(id: string): Promise<Stylist | null> {
      logger.debug(`Fetching stylist by id: ${id}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('id', id).maybeSingle()
      return executeQuery(logger, query, { context: 'findStylistById' })
    },

    /** Preia stiliștii pentru un serviciu specific folosind o funcție RPC. */
    async findByServiceId(serviceId: string): Promise<Stylist[]> {
      logger.debug(`Fetching stylists for service id via RPC: ${serviceId}`)
      const rpcPromise = supabase.rpc('get_stylists_for_service', { p_service_id: serviceId })
      return executeQuery(logger, rpcPromise, { context: 'findByServiceId' })
    },

    /** Creează un nou stilist. */
    async create(data: StylistCreateData): Promise<Stylist> {
      logger.debug('Creating a new stylist...', { data })
      const query = supabase.from(TABLE_NAME).insert(data).select().single()
      return executeQuery(logger, query, { context: 'createStylist', throwOnNull: true })
    },

    /** Actualizează un stilist. */
    async update(payload: StylistUpdatePayload): Promise<Stylist> {
      const { id, data } = payload
      logger.debug(`Updating stylist with id: ${id}`, { data })
      const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
      return executeQuery(logger, query, { context: 'updateStylist', throwOnNull: true })
    },

    /** Șterge un stilist. */
    async delete(id: string): Promise<void> {
      logger.debug(`Deleting stylist with id: ${id}`)
      const query = supabase.from(TABLE_NAME).delete().eq('id', id)
      await executeQuery(logger, query, { context: 'deleteStylist' })
    },

    /** Găsește un stilist după numele complet. */
    async findByFullName(fullName: string): Promise<Stylist | null> {
      logger.debug(`Fetching stylist by name: ${fullName}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('full_name', fullName).maybeSingle()
      return executeQuery(logger, query, { context: 'findStylistByFullName' })
    },

    /** Găsește un stilist după email. */
    async findByEmail(email: string): Promise<Stylist | null> {
      logger.debug(`Fetching stylist by email: ${email}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('email', email).maybeSingle()
      return executeQuery(logger, query, { context: 'findStylistByEmail' })
    },

    /** Găsește un stilist după telefon. */
    async findByPhone(phone: string): Promise<Stylist | null> {
      logger.debug(`Fetching stylist by phone: ${phone}`)
      const query = supabase.from(TABLE_NAME).select('*').eq('phone', phone).maybeSingle()
      return executeQuery(logger, query, { context: 'findStylistByPhone' })
    },
  }
}
