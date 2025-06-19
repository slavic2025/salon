import { createLogger } from '@/lib/logger'
import { ServicesPageContent } from './_components/services-page-content'
// Pasul 1: Importăm helper-ul care ne creează serviciul
import { getServiceService } from '@/features/services/actions'
import { AppError } from '@/lib/errors'

const logger = createLogger('AdminServicesPage')

// Pagina este un Server Component, deci poate fi `async`
export default async function AdminServicesPage() {
  logger.info('Fetching data for AdminServicesPage...')

  try {
    // Pasul 2: Apelăm serviciul de business direct pentru a obține datele
    const serviceService = await getServiceService()
    const services = await serviceService.findAllServices()

    logger.debug('Services loaded successfully:', { count: services.length })

    // Pasul 3: Pasăm datele pure către componenta "dumb" care se ocupă de afișare
    return <ServicesPageContent services={services} />
  } catch (error) {
    // Dacă preluarea datelor eșuează, înregistrăm eroarea.
    // Next.js va prinde eroarea și va afișa cel mai apropiat `error.tsx`.
    logger.error('Failed to fetch services for page.', { error })
    if (error instanceof AppError) {
      // Putem afișa un mesaj specific de eroare dacă dorim
      return <p className="p-4 text-red-500">{error.message}</p>
    }
    return <p className="p-4 text-red-500">A apărut o eroare la încărcarea serviciilor.</p>
  }
}
