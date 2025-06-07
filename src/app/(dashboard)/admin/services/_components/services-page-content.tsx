// app/admin/services/components/services-page-content.tsx
'use client'

import { createLogger } from '@/lib/logger'
import { AddServiceDialog } from './add-service-dialog'

// Importuri NOI pentru GenericTableView și elementele sale specifice
import { GenericTableView } from '@/components/shared/generic-table-view'
import { ServiceTableRow } from './service-table-row' // Păstrăm acest import
import { SERVICE_TABLE_HEADERS } from './service-table-headers' // Păstrăm acest import
import { Service } from '@/core/domains/services/service.types'

// Presupunem că vei crea și un ServiceCardView similar
// import { ServiceCardView } from './service-card-view'

const logger = createLogger('ServicesPageContent')

interface ServicesPageContentProps {
  services: Service[]
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

      {/* Utilizează componenta GenericTableView pentru desktop */}
      {/* Vechea linie: <ServiceTableView services={services} /> */}
      <GenericTableView
        data={services}
        headers={SERVICE_TABLE_HEADERS}
        renderRow={(service) => <ServiceTableRow key={service.id} service={service} />}
        emptyMessage="Nu există servicii adăugate încă."
        tableHeadingId="services-table-heading"
        tableHeadingText="Tabel cu servicii"
      />

      {/* Utilizează componenta ServiceCardView pentru mobil (dacă o creezi) */}
      {/* <ServiceCardView services={services} /> */}
    </div>
  )
}
