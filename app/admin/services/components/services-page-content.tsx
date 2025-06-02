// app/admin/services/components/services-page-content.tsx
'use client'

import { AddServiceDialog } from './add-service-dialog'
import { ServiceData } from '@/app/admin/services/types'
import { ServiceTableView } from './service-table-view'
import { ServiceCardView } from './service-card-view'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ServicesPageContent')

interface ServicesPageContentProps {
  services: ServiceData[]
}

export function ServicesPageContent({ services }: ServicesPageContentProps) {
  logger.debug('Rendering ServicesPageContent', { numServices: services.length })

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" id="services-page-title">
          Gestionare Servicii
        </h1>
        <AddServiceDialog />
      </div>

      {/* Utilizează componenta ServiceTableView pentru desktop */}
      <ServiceTableView services={services} />

      {/* Utilizează componenta ServiceCardView pentru mobil */}
      <ServiceCardView services={services} />
    </div>
  )
}
