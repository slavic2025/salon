// src/app/(dashboard)/admin/services/_components/services-page-content.tsx
'use client'

import { createLogger } from '@/lib/logger'
import { AddServiceDialog } from './add-service-dialog'
import { GenericTableView } from '@/components/shared/generic-table-view'
import { ServiceTableRow } from './service-table-row'
import { SERVICE_TABLE_HEADERS } from './service-table-headers'
import { Service } from '@/core/domains/services/service.types'
import { ServiceCardView } from './service-card-view' // Vom presupune că acest component există
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const logger = createLogger('ServicesPageContent')

interface ServicesPageContentProps {
  services: Service[]
}

export function ServicesPageContent({ services }: ServicesPageContentProps) {
  logger.debug('Rendering ServicesPageContent', { numServices: services.length })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestionare Servicii</h1>
        {/* Butonul clasic, vizibil doar pe desktop */}
        <div className="hidden md:block">
          <AddServiceDialog />
        </div>
      </div>

      <GenericTableView
        data={services}
        headers={SERVICE_TABLE_HEADERS}
        renderRow={(service) => <ServiceTableRow key={service.id} service={service} />}
        emptyMessage="Nu există servicii adăugate încă."
        tableHeadingId="services-table-heading"
        tableHeadingText="Tabel cu servicii"
      />

      <ServiceCardView services={services} />

      {/* Butonul Flotant (FAB), vizibil doar pe mobil */}
      <div className="md:hidden">
        <AddServiceDialog
          trigger={
            <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
              <PlusIcon className="h-6 w-6" />
              <span className="sr-only">Adaugă Serviciu Nou</span>
            </Button>
          }
        />
      </div>
    </div>
  )
}
