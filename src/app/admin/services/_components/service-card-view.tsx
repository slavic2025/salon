// app/admin/services/components/service-card-view.tsx
'use client'

import { ServiceCard } from './service-card'
import { EmptyState } from '../../../../components/ui/empty-state'
import { createLogger } from '@/lib/logger'
import { Service } from '@/core/domains/services/service.types'

const logger = createLogger('ServiceCardView')

interface ServiceCardViewProps {
  services: Service[]
}

export function ServiceCardView({ services }: ServiceCardViewProps) {
  logger.debug('Rendering ServiceCardView', { count: services.length })

  return (
    <section aria-labelledby="services-cards-heading" className="md:hidden grid grid-cols-1 gap-4">
      <h2 id="services-cards-heading" className="sr-only">
        Servicii listate ca și carduri
      </h2>
      {services.length > 0 ? (
        services.map((service) => <ServiceCard key={service.id} service={service} />)
      ) : (
        <EmptyState message="Nu există servicii adăugate încă." />
      )}
    </section>
  )
}
