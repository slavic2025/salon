// app/admin/services/data.ts
import 'server-only'

import { getServicesAction } from './actions'
import { ServiceData } from './types'
import { createLogger } from '@/lib/logger'

const logger = createLogger('DB_ServiceCore')

/**
 * Fetches all service data from the database.
 * This function is designed to be called from Server Components.
 * @returns A Promise that resolves to an array of ServiceData.
 * @throws An error if fetching services fails.
 */
export async function fetchServices(): Promise<ServiceData[]> {
  try {
    const services = await getServicesAction()
    logger.info('Successfully fetched services.', { count: services.length })
    return services
  } catch (error) {
    logger.error('Failed to fetch services:', { error: error instanceof Error ? error.message : String(error) })
    throw new Error('Could not retrieve services. Please try again later.')
  }
}
