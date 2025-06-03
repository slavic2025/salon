// lib/db/service-core.ts
import { createClient } from '@/lib/supabase'
import { z } from 'zod'
import { createLogger } from '@/lib/logger'
import { ServiceData } from '@/app/admin/services/types'
import { addServiceSchema, editServiceSchema } from '../zod/schemas'

const logger = createLogger('DB_ServiceCore') // Logger specific pentru logica de bază

// --- Funcții de Interacțiune cu Baza de Date ---
// Aceste funcții conțin logica pură de CRUD cu Supabase
export async function fetchAllServices(): Promise<ServiceData[]> {
  logger.debug('Attempting to fetch all services.')
  const supabase = await createClient()
  const { data: services, error } = await supabase.from('services').select('*')

  if (error) {
    logger.error('Error fetching services from Supabase:', { message: error.message, details: error.details })
    throw new Error('Failed to fetch services.')
  }

  logger.info('Successfully fetched services.', { count: services?.length })
  return services || []
}

export async function insertService(serviceData: z.infer<typeof addServiceSchema>): Promise<ServiceData> {
  logger.debug('Attempting to insert new service.', { serviceData })
  const supabase = await createClient()
  const { data, error } = await supabase.from('services').insert(serviceData).select().single()

  if (error) {
    logger.error('Error inserting service into Supabase:', {
      message: error.message,
      details: error.details,
      serviceData,
    })
    throw new Error('Failed to create service.')
  }

  logger.info('Service successfully inserted.', { serviceId: data.id, serviceName: data.name })
  return data
}

export async function updateService(id: string, serviceData: z.infer<typeof editServiceSchema>): Promise<ServiceData> {
  logger.debug('Attempting to update service.', { serviceId: id, serviceData })
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services')
    .update({ ...serviceData, updated_at: new Date().toISOString() }) // Actualizează timestamp-ul
    .eq('id', id)
    .select()
    .single()

  if (error) {
    logger.error('Error updating service in Supabase:', {
      message: error.message,
      details: error.details,
      serviceId: id,
      serviceData,
    })
    throw new Error('Failed to update service.')
  }

  logger.info('Service successfully updated.', { serviceId: data.id, serviceName: data.name })
  return data
}

export async function deleteService(id: string): Promise<void> {
  logger.debug('Attempting to delete service.', { serviceId: id })
  const supabase = await createClient()
  const { error } = await supabase.from('services').delete().eq('id', id)

  if (error) {
    logger.error('Error deleting service from Supabase:', {
      message: error.message,
      details: error.details,
      serviceId: id,
    })
    throw new Error('Failed to delete service.')
  }

  logger.info('Service successfully deleted.', { serviceId: id })
}
