// app/admin/services/page.tsx
import { fetchAllServices } from '@/features/services/data-acces'
import { ServicesPageContent } from './_components/services-page-content'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ServicesPage')

export default async function AdminServicesPage() {
  logger.info('Loading ServicesPage...')
  const services = await fetchAllServices()
  logger.debug('Services loaded:', { count: services.length })

  return <ServicesPageContent services={services} />
}
