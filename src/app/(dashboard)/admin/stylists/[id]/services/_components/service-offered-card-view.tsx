// src/app/(dashboard)/admin/stylists/[id]/services/_components/service-offered-card-view.tsx
'use client'

import { EmptyState } from '@/components/ui/empty-state'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'
import { ServiceOfferedCard } from './service-offered-card'
import { Tables } from '@/types/database.types'

interface ServiceOfferedCardViewProps {
  servicesOffered: ServiceOffered[]
  availableServices: Tables<'services'>[]
}

export function ServiceOfferedCardView({ servicesOffered, availableServices }: ServiceOfferedCardViewProps) {
  return (
    <section aria-labelledby="offered-services-cards-heading" className="md:hidden grid grid-cols-1 gap-4">
      <h2 id="offered-services-cards-heading" className="sr-only">
        Servicii oferite listate ca și carduri
      </h2>
      {servicesOffered.length > 0 ? (
        servicesOffered.map((service) => (
          <ServiceOfferedCard key={service.id} offeredService={service} availableServices={availableServices} />
        ))
      ) : (
        <EmptyState message="Acest stilist nu are încă niciun serviciu asociat." />
      )}
    </section>
  )
}
