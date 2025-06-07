// app/admin/stylists/[id]/services/data.ts
import 'server-only' // Asigură că aceste funcții sunt apelate doar pe server

import { createLogger } from '@/lib/logger'
import { Tables } from '@/types/database.types'
import { ServicesOfferedData } from '@/features/services-offered/types'
import { getAllAvailableServicesAction, getServicesOfferedByStylistAction } from '@/features/services-offered/actions'

const logger = createLogger('ServicesOfferedData')

/**
 * Fetches all services offered by a specific stylist.
 * This function is designed to be called from Server Components.
 * @param stylistId - The ID of the stylist.
 * @returns A Promise that resolves to an array of ServicesOfferedData.
 * @throws An error if fetching data fails (though the underlying action might return an empty array on error).
 */
export async function fetchServicesOfferedForStylist(stylistId: string): Promise<ServicesOfferedData[]> {
  logger.debug('Fetching services offered for stylist via data.ts', { stylistId })
  try {
    // Apelează Server Action-ul corespunzător
    const servicesOffered = await getServicesOfferedByStylistAction(stylistId)
    logger.info('Successfully fetched services offered for stylist.', { stylistId, count: servicesOffered.length })
    return servicesOffered
  } catch (error) {
    logger.error('Failed to fetch services offered for stylist:', {
      stylistId,
      error: error instanceof Error ? error.message : String(error),
    })
    // Poți alege să arunci eroarea mai departe sau să returnezi un array gol,
    // în funcție de cum dorești să gestionezi erorile în componenta de pagină.
    // Având în vedere că getServicesOfferedByStylistAction returnează [] la eroare,
    // probabil că e ok să returnăm direct rezultatul.
    throw new Error(`Could not retrieve services offered for stylist ${stylistId}. Please try again later.`)
  }
}

/**
 * Fetches all available services in the salon.
 * Useful for populating selection lists when adding a service to a stylist.
 * This function is designed to be called from Server Components.
 * @returns A Promise that resolves to an array of general service data.
 * @throws An error if fetching data fails.
 */
export async function fetchAllAvailableSalonServices(): Promise<Tables<'services'>[]> {
  logger.debug('Fetching all available salon services via data.ts')
  try {
    // Apelează Server Action-ul corespunzător
    const availableServices = await getAllAvailableServicesAction()
    logger.info('Successfully fetched all available salon services.', { count: availableServices.length })
    return availableServices
  } catch (error) {
    logger.error('Failed to fetch all available salon services:', {
      error: error instanceof Error ? error.message : String(error),
    })
    throw new Error('Could not retrieve available salon services. Please try again later.')
  }
}
