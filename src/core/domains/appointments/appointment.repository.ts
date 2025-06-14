// src/core/domains/appointments/appointment.repository.ts
import 'server-only'

import { createClient } from '@/lib/supabase-server'
import { createLogger } from '@/lib/logger'
import type { Appointment } from './appointment.types'
import type { Database } from '@/types/database.types'

const logger = createLogger('AppointmentRepository')
const TABLE_NAME = 'appointments'

type AppointmentCreateData = Database['public']['Tables']['appointments']['Insert']

// Funcția de bază pentru a gestiona erorile Supabase
async function handleSupabaseError<T>(promise: PromiseLike<{ data: T; error: any }>, context: string): Promise<T> {
  const { data, error } = await promise
  if (error) {
    logger.error(`Supabase query failed in ${context}`, { message: error.message, details: error.details })
    throw new Error(`Database error during ${context}: ${error.message}`)
  }
  return data
}

export const appointmentRepository = {
  async create(data: AppointmentCreateData): Promise<Appointment> {
    logger.debug('Creating a new appointment...', { data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).insert(data).select().single()

    const newAppointment = await handleSupabaseError(query, 'createAppointment')
    if (!newAppointment) {
      throw new Error('Database did not return the new appointment.')
    }
    return newAppointment
  },

  async get(id: string): Promise<Appointment | null> {
    logger.debug('Getting appointment...', { id })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).select().eq('id', id).single()
    
    return handleSupabaseError(query, 'getAppointment')
  },

  async update(
    id: string, 
    data: Database['public']['Tables']['appointments']['Update']
  ): Promise<Appointment> {
    logger.debug('Updating appointment...', { id, data })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).update(data).eq('id', id).select().single()
    
    const updatedAppointment = await handleSupabaseError(query, 'updateAppointment')
    if (!updatedAppointment) {
      throw new Error('Database did not return the updated appointment.')
    }
    return updatedAppointment
  },

  async delete(id: string): Promise<void> {
    logger.debug('Deleting appointment...', { id })
    const supabase = await createClient()
    const query = supabase.from(TABLE_NAME).delete().eq('id', id)
    
    await handleSupabaseError(query, 'deleteAppointment')
  }
}