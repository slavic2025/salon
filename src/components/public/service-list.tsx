// src/components/public/service-list.tsx

import { Service } from '@/core/domains/services/service.types'

import { EmptyState } from '@/components/ui/empty-state'
import { ServiceCard } from './service-card'

interface ServiceListProps {
  services: Service[]
}

export function ServiceList({ services }: ServiceListProps) {
  if (services.length === 0) {
    return (
      <EmptyState
        message="Niciun serviciu disponibil"
        description="Momentan nu sunt servicii active. Te rugăm să revii mai târziu."
        className="mt-16"
      />
    )
  }

  return (
    <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  )
}
