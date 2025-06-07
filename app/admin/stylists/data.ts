// app/admin/stylists/data.ts
import 'server-only'

import { createLogger } from '@/lib/logger'
import { StylistData } from '@/features/stylists/types'
import { getStylistsAction } from '@/features/stylists/actions'

const logger = createLogger('DB_stylistCore')

/**
 * Fetches all stylist data from the database.
 * This function is designed to be called from Server Components.
 * @returns A Promise that resolves to an array of stylistData.
 * @throws An error if fetching stylists fails.
 */
export async function fetchstylists(): Promise<StylistData[]> {
  try {
    const stylists = await getStylistsAction()
    logger.info('Successfully fetched stylists.', { count: stylists.length })
    return stylists
  } catch (error) {
    logger.error('Failed to fetch stylists:', { error: error instanceof Error ? error.message : String(error) })
    throw new Error('Could not retrieve stylists. Please try again later.')
  }
}
