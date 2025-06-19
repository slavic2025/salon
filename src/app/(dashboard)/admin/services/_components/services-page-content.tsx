'use client'

import { Service } from '@/core/domains/services/service.types'
import { AddServiceDialog } from './add-service-dialog'
import { ServiceCard } from './service-card'
import { EmptyState } from '@/components/molecules/empty-state'

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
          title="Niciun Serviciu Găsit"
          description="Momentan nu ai niciun serviciu adăugat. Apasă butonul de mai sus pentru a crea primul serviciu."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}
