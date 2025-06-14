// src/app/(dashboard)/admin/stylists/[id]/services/page.tsx

import { createLogger } from '@/lib/logger'
import { notFound } from 'next/navigation'
import { ServicesOfferedPageContent } from './_components/services-offered-page-content'

// 1. Importăm direct acțiunile și repository-ul necesar
import { getAllAvailableServicesAction, getServicesOfferedByStylistAction } from '@/features/services-offered/actions'
import { stylistRepository } from '@/core/domains/stylists/stylist.repository'

const logger = createLogger('StylistServicesPage')

interface StylistServicesPageProps {
  params: {
    id: string // ID-ul stilistului din URL
  }
}

export default async function StylistServicesPage({ params }: StylistServicesPageProps) {
  const stylistId = params.id
  logger.info(`Loading StylistServicesPage for stylist ID: ${stylistId}`)

  if (!stylistId) {
    logger.warn('Stylist ID is missing from params.')
    notFound()
  }

  try {
    // 2. Apelăm direct repository-ul și acțiunile, eliminând dependența de './data.ts'
    const [stylist, servicesOffered, availableServices] = await Promise.all([
      stylistRepository.fetchById(stylistId),
      getServicesOfferedByStylistAction(stylistId),
      getAllAvailableServicesAction(),
    ])

    if (!stylist) {
      logger.warn(`Stylist with ID: ${stylistId} not found.`)
      notFound()
    }

    logger.debug(`Data fetched for stylist ${stylist.full_name}`, {
      servicesOfferedCount: servicesOffered.length,
      availableServicesCount: availableServices.length,
    })

    return (
      <ServicesOfferedPageContent
        stylist={stylist}
        initialServicesOffered={servicesOffered}
        availableServices={availableServices}
      />
    )
  } catch (error) {
    logger.error(`Error loading data for StylistServicesPage (stylist ID: ${stylistId}):`, {
      message: (error as Error).message,
      stack: (error as Error).stack,
    })
    // Aruncăm eroarea pentru a fi prinsă de error.tsx global
    throw new Error(`Failed to load services for stylist ${stylistId}.`)
  }
}
