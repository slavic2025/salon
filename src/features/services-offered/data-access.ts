import { createGenericCrudService } from '@/lib/db/generic-core'
import { createLogger } from '@/lib/logger'
import { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database.types' // Tipul Database și Table helpers

import { SupabaseClient } from '@supabase/supabase-js'
import { addOfferedServiceSchema, editOfferedServiceSchema, ServicesOfferedData } from './types'
import { createClient } from '@/lib/supabase'

const logger = createLogger('DB_ServicesOfferedCore')

// Tipuri specifice pentru createGenericCrudService pentru 'services_offered'
// Acestea sunt necesare pentru a se potrivi cu semnătura generică, chiar dacă
// CreateSchema și UpdateSchema sunt deja importate.
// Ne asigurăm că folosim tipurile corecte pentru Insert/Update din Supabase.
type ServicesOfferedInsert = TablesInsert<'services_offered'>
type ServicesOfferedUpdate = TablesUpdate<'services_offered'>

// Definirea operațiunilor CRUD folosind serviciul generic
export const servicesOfferedCrud = createGenericCrudService<
  'services_offered', // Numele tabelei
  ServicesOfferedData, // Tipul pentru un rând din tabelă (Row)
  typeof addOfferedServiceSchema, // Schema Zod pentru creare (adaptată pentru insert direct)
  typeof editOfferedServiceSchema // Schema Zod pentru actualizare
>('services_offered', addOfferedServiceSchema, editOfferedServiceSchema)

// Exportăm metodele CRUD individuale pentru utilizare facilă
export const fetchAllServicesOffered = servicesOfferedCrud.fetchAll
export const fetchServiceOfferedById = servicesOfferedCrud.fetchById
// Pentru insert, va trebui să ne asigurăm că stylist_id este adăugat înainte de validare/insert
// Acest insert generic se așteaptă la toate câmpurile definite în addOfferedServiceSchema.
export const insertServiceOffered = async (
  rawData: Omit<ServicesOfferedInsert, 'id' | 'created_at' | 'updated_at'>
): Promise<ServicesOfferedData> => {
  const supabase = await createClient()
  // Validarea Zod ar trebui să se întâmple în Server Action înainte de a apela această funcție de bază.
  // Sau, dacă schema `addOfferedServiceSchema` ar include `stylist_id`, am putea valida aici.
  // Pentru moment, presupunem că `rawData` este gata de inserție (mai puțin câmpurile auto-generate).

  // Verificare de unicitate (stylist_id, service_id) - important de făcut înainte de inserare
  // Această logică e mai bine plasată în Server Action pentru a returna erori specifice UI-ului.
  const { data: existing } = await supabase
    .from('services_offered')
    .select('id')
    .eq('stylist_id', rawData.stylist_id)
    .eq('service_id', rawData.service_id)
    .maybeSingle()

  if (existing) {
    logger.warn('Attempted to insert duplicate service_offered entry', {
      stylist_id: rawData.stylist_id,
      service_id: rawData.service_id,
    })
    throw new Error('Acest serviciu este deja oferit de stilist.')
  }

  const { data, error } = await supabase.from('services_offered').insert(rawData).select().single()

  if (error) {
    logger.error('Error inserting into "services_offered":', {
      message: error.message,
      details: error.details,
      rawData,
    })
    throw new Error(`Failed to insert into services_offered: ${error.message}`)
  }
  return data as ServicesOfferedData
}

export const updateServiceOffered = servicesOfferedCrud.update
export const deleteServiceOffered = servicesOfferedCrud.remove

// Funcție specifică pentru a prelua toate serviciile oferite de un anumit stilist
export async function fetchServicesOfferedByStylist(stylistId: string): Promise<ServicesOfferedData[]> {
  logger.debug('Fetching services offered by stylist', { stylistId })
  if (!stylistId) {
    logger.warn('fetchServicesOfferedByStylist called with no stylistId')
    return []
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services_offered')
    .select(
      `
      *,
      services (
        name,
        duration_minutes,
        price
      )
    `
    )
    .eq('stylist_id', stylistId)
    .order('created_at', { ascending: false }) // Sau alt criteriu de sortare

  if (error) {
    logger.error('Error fetching services offered by stylist:', {
      stylistId,
      message: error.message,
      details: error.details,
    })
    throw new Error(`Could not retrieve services offered by stylist ${stylistId}.`)
  }

  // Supabase TypeScript generator poate să nu infereze corect tipul pentru relații imbricate.
  // Poate fi necesar un cast sau o procesare ulterioară a datelor dacă `services` este `null`
  // sau dacă tipul nu este cel așteptat.
  return data as ServicesOfferedData[]
}

// Funcție specifică pentru a prelua un serviciu oferit, inclusiv detalii despre serviciul de bază
export async function fetchServiceOfferedWithDetailsService(
  serviceOfferedId: string
): Promise<ServicesOfferedData | null> {
  logger.debug('Fetching service offered with details', { serviceOfferedId })
  if (!serviceOfferedId) {
    logger.warn('fetchServiceOfferedWithDetailsService called with no serviceOfferedId')
    return null
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('services_offered')
    .select(
      `
      *,
      services (
        name,
        description,
        duration_minutes,
        price,
        category,
        is_active
      )
    `
    )
    .eq('id', serviceOfferedId)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = 0 rânduri, ceea ce e ok, înseamnă null
    logger.error('Error fetching service offered with details:', {
      serviceOfferedId,
      message: error.message,
      details: error.details,
    })
    throw new Error(`Could not retrieve service offered with details ${serviceOfferedId}.`)
  }
  return data as ServicesOfferedData | null
}
