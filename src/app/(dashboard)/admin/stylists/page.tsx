// src/app/(dashboard)/admin/stylists/page.tsx

import { createLogger } from '@/lib/logger'
import { StylistsPageContent } from './_components/stylist-page-content'
import { getStylistService } from '@/features/stylists/actions'
import { AppError } from '@/lib/errors'

const logger = createLogger('AdminStylistsPage')

export default async function AdminStylistsPage() {
  logger.info('Fetching data for AdminStylistsPage...')

  try {
    const stylistService = await getStylistService()
    const stylists = await stylistService.findAllStylists()

    logger.debug('Stylists loaded successfully:', { count: stylists.length })

    return <StylistsPageContent stylists={stylists} />
  } catch (error) {
    logger.error('Failed to fetch stylists for page.', { error })
    if (error instanceof AppError) {
      return <p className="p-4 text-red-500">{error.message}</p>
    }
    return <p className="p-4 text-red-500">A apărut o eroare la încărcarea stiliștilor.</p>
  }
}
