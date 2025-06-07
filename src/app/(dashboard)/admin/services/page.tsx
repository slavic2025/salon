// src/app/(dashboard)/admin/services/page.tsx

import { createLogger } from '@/lib/logger'
import { ServicesPageContent } from './_components/services-page-content'

// 1. Importăm noua Server Action pentru a prelua serviciile
import { getServicesAction } from '@/features/services/actions'

const logger = createLogger('ServicesPage')

export default async function AdminServicesPage() {
  logger.info('Loading ServicesPage...')

  // 2. Apelăm acțiunea refactorizată pentru a obține datele
  const services = await getServicesAction()
  logger.debug('Services loaded:', { count: services.length })

  return <ServicesPageContent services={services} />
}
