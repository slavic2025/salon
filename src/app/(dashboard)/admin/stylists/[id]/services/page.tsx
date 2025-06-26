import { createLogger } from '@/lib/logger'
import { AppError } from '@/lib/errors'
// Importăm helperii pentru a crea serviciile necesare
import { getStylistService } from '@/features/stylists/actions'
import { getServiceService } from '@/features/services/actions'
import { getServiceOfferedService } from '@/features/services-offered/actions'
import { ServicesOfferedPageContent } from './_components/services-offered-page-content'

const logger = createLogger('StylistServicesPage')

interface PageProps {
  params: { id: string } // Next.js pasează automat parametrii din URL
}

/**
 * Pagina "Smart" pentru managementul serviciilor unui stilist.
 * Preia toate datele necesare de pe server.
 */
export default async function StylistServicesPage({ params }: PageProps) {
  const stylistId = params.id
  logger.info(`Fetching data for StylistServicesPage for stylistId: ${stylistId}`)

  try {
    // Preluăm în paralel toate datele necesare pentru a fi eficienți
    const stylistService = await getStylistService()
    const serviceService = await getServiceService()
    const serviceOfferedService = await getServiceOfferedService()

    const [stylist, allServices, offeredServices] = await Promise.all([
      stylistService.findStylistById(stylistId),
      serviceService.findAllServices(),
      serviceOfferedService.findServicesOffered(stylistId),
    ])

    if (!stylist) {
      // Poți folosi componenta notFound() de la Next.js pentru un 404 standard
      return <p className="p-4">Stilistul nu a fost găsit.</p>
    }

    return <ServicesOfferedPageContent stylist={stylist} allServices={allServices} offeredServices={offeredServices} />
  } catch (error) {
    logger.error('Failed to fetch data for StylistServicesPage.', { error })
    return <p className="p-4 text-red-500">A apărut o eroare la încărcarea datelor.</p>
  }
}
