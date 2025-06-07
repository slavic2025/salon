// src/app/admin/stylists/[id]/services/page.tsx
import { createLogger } from '@/lib/logger'
import { fetchServicesOfferedForStylist, fetchAllAvailableSalonServices } from './data'
import { ServicesOfferedPageContent } from './_components/services-offered-page-content'
import { notFound } from 'next/navigation'

// 1. Importăm repository-ul în loc de funcția veche
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
    // Preluăm concurent datele necesare
    const [stylist, servicesOffered, availableServices] = await Promise.all([
      // 2. Apelăm metoda corectă din repository
      stylistRepository.fetchById(stylistId),
      fetchServicesOfferedForStylist(stylistId),
      fetchAllAvailableSalonServices(),
    ])

    if (!stylist) {
      logger.warn(`Stylist with ID: ${stylistId} not found.`)
      notFound()
    }

    logger.debug(`Data fetched for stylist ${stylist.name}`, {
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
    throw new Error(`Failed to load services for stylist ${stylistId}. ${(error as Error).message}`)
  }
}
