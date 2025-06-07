// app/admin/stylists/[id]/services/page.tsx
import { createLogger } from '@/lib/logger'
import { fetchServicesOfferedForStylist, fetchAllAvailableSalonServices } from './data' // Funcțiile create în data.ts
import { ServicesOfferedPageContent } from './_components/services-offered-page-content' // Componenta client (o vom crea ulterior)
import { notFound } from 'next/navigation'
import { fetchStylistById } from '@/features/stylists/data-acces'

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
    notFound() // Sau o altă gestionare a erorii/redirecționare
  }

  try {
    // Preluăm concurent datele necesare
    const [stylist, servicesOffered, availableServices] = await Promise.all([
      fetchStylistById(stylistId),
      fetchServicesOfferedForStylist(stylistId),
      fetchAllAvailableSalonServices(),
    ])

    if (!stylist) {
      logger.warn(`Stylist with ID: ${stylistId} not found.`)
      notFound() // Afișează o pagină 404 dacă stilistul nu există
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
    // Poți afișa o componentă de eroare mai specifică aici sau să lași global error.tsx să preia
    // De exemplu: return <PageErrorState message="Nu am putut încărca serviciile pentru acest stilist." />;
    // Pentru moment, aruncăm eroarea pentru a fi prinsă de error.tsx global.
    throw new Error(`Failed to load services for stylist ${stylistId}. ${(error as Error).message}`)
  }
}
