// app/admin/services/page.tsx
import { fetchServices } from './data'
import { ServicesPageContent } from './components/services-page-content'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ServicesPage')

export default async function AdminServicesPage() {
  logger.info('Loading ServicesPage...')
  const services = await fetchServices()
  logger.debug('Services loaded:', { count: services.length })

  return <ServicesPageContent services={services} />
}
