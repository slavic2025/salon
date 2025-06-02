// lib/db/service-core.ts
import { createClient } from '@/lib/supabase'
import { z } from 'zod'
import { createLogger } from '@/lib/logger'

const logger = createLogger('DB_ServiceCore') // Logger specific pentru logica de bază

// --- Tipuri de Date ---
// Definirea unui tip pentru serviciu pentru a îmbunătăți siguranța tipurilor
// Acesta reflectă structura datelor direct din baza de date
export type Service = {
  id: string // UUID
  created_at: string // String ISO de la baza de date
  updated_at: string // String ISO de la baza de date
  name: string
  description: string | null
  duration_minutes: number
  price: number
  is_active: boolean
  category: string | null
}

// --- Zod Schemas pentru Validare ---
// Schemele Zod definesc forma datelor așteptate pentru inserare/actualizare
export const serviceInputSchema = z.object({
  name: z.string().min(1, { message: 'Numele serviciului este obligatoriu.' }),
  description: z.string().nullable(),
  duration_minutes: z.preprocess(
    (val) => parseInt(String(val), 10),
    z.number().int().positive({ message: 'Durata trebuie să fie un număr întreg pozitiv.' })
  ),
  price: z.preprocess(
    (val) => parseFloat(String(val)),
    z
      .number()
      .positive({ message: 'Prețul trebuie să fie un număr pozitiv.' })
      .multipleOf(0.01, { message: 'Prețul poate avea maxim două zecimale.' })
  ),
  is_active: z.preprocess((val) => val === 'on' || val === true, z.boolean().default(true)), // Handle both 'on' from FormData and boolean from typed input
  category: z.string().nullable(),
})

export const addServiceSchema = serviceInputSchema // Schema pentru adăugare este aceeași ca input
export const editServiceSchema = serviceInputSchema.extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }), // Extinde schema pentru editare cu un ID obligatoriu
})

// --- Funcții de Interacțiune cu Baza de Date ---
// Aceste funcții conțin logica pură de CRUD cu Supabase
export async function fetchAllServices(): Promise<Service[]> {
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

export async function insertService(serviceData: z.infer<typeof addServiceSchema>): Promise<Service> {
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

export async function updateService(id: string, serviceData: z.infer<typeof serviceInputSchema>): Promise<Service> {
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
