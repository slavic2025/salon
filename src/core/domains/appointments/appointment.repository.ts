// src/core/domains/appointments/appointment.repository.ts
import 'server-only' // Asigură că acest cod rulează doar pe server

import { createLogger } from '@/lib/logger'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Appointment, AppointmentCreatePayload, AppointmentUpdatePayload } from './appointment.types'
import { executeQuery } from '@/lib/db-helpers'

/**
 * Factory Function care creează și returnează un obiect repository.
 * @param supabase - O instanță a clientului Supabase.
 * @returns Un obiect cu metode pentru a interacționa cu tabela 'appointments'.
 */
export function createAppointmentRepository(supabase: SupabaseClient) {
  const logger = createLogger('AppointmentRepository')
  const TABLE_NAME = 'appointments'

  return {
    /** Creează o nouă programare. */
    async create(data: AppointmentCreatePayload): Promise<Appointment> {
      logger.debug('Creating a new appointment...', { data })
      const query = supabase.from(TABLE_NAME).insert(data).select().single()
      return executeQuery(logger, query, { context: 'createAppointment', throwOnNull: true })
    },

    /** Găsește o programare după ID. */
    async findById(id: string): Promise<Appointment | null> {
      logger.debug('Finding appointment by id...', { id })
      const query = supabase.from(TABLE_NAME).select().eq('id', id).maybeSingle()
      return executeQuery(logger, query, { context: 'findAppointmentById' })
    },

    /**
     * Găsește programări pe baza unor criterii.
     * Exemplu de metodă pentru a prelua mai multe înregistrări.
     */
    async find(criteria: { stylistId: string; startDate: string; endDate: string }): Promise<Appointment[]> {
      logger.debug('Finding appointments by criteria...', { criteria })
      const query = supabase
        .from(TABLE_NAME)
        .select()
        .eq('stylist_id', criteria.stylistId)
        .gte('start_time', criteria.startDate)
        .lte('end_time', criteria.endDate)
      const result = await executeQuery(logger, query, { context: 'findAppointments' })
      return result || []
    },

    /** Actualizează o programare. */
    async update(payload: AppointmentUpdatePayload): Promise<Appointment> {
      const { id, data } = payload
      logger.debug('Updating appointment...', { id, data })
      const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
      return executeQuery(logger, query, { context: 'updateAppointment', throwOnNull: true })
    },

    /** Șterge o programare. */
    async delete(id: string): Promise<void> {
      logger.debug('Deleting appointment...', { id })
      const query = supabase.from(TABLE_NAME).delete().eq('id', id)
      await executeQuery(logger, query, { context: 'deleteAppointment' })
    },
  }
}
