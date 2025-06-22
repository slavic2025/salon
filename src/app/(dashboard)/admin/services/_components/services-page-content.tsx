'use client'

import { type Service } from '@/core/domains/services/service.types'
import { AddServiceDialog } from './add-service-dialog'
import { EmptyState } from '@/components/molecules/empty-state'
import { ServiceCardView } from './service-card-view'
import { ServicesTable } from './services-table'

interface ServicesPageContentProps {
  services: Service[]
}

export function ServicesPageContent({ services }: ServicesPageContentProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Management Servicii</h1>
        <AddServiceDialog />
      </div>

      {services.length === 0 ? (
        <EmptyState
          title="Niciun Serviciu Adăugat"
          description="Momentan nu există servicii. Apasă 'Adaugă Serviciu' pentru a crea primul."
        />
      ) : (
        <>
          {/* Pasul 2: Randăm VEDEREA DE CARDURI, dar o ascundem pe ecranele mari (lg și peste) */}
          <div className="lg:hidden">
            <ServiceCardView services={services} />
          </div>

          {/* Pasul 3: Randăm VEDEREA DE TABEL, dar o afișăm doar pe ecranele mari */}
          <div className="hidden lg:block">
            <ServicesTable services={services} />
          </div>
        </>
      )}
    </div>
  )
}
