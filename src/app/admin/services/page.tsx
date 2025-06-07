// app/admin/services/page.tsx

import { fetchAllAvailableSalonServices } from '../stylists/[id]/services/data'
import { ServicesPageContent } from './_components/services-page-content'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ServicesPage')

export default async function AdminServicesPage() {
  logger.info('Loading ServicesPage...')
  const services = await fetchAllAvailableSalonServices()
  logger.debug('Services loaded:', { count: services.length })

  return <ServicesPageContent services={services} />
}
