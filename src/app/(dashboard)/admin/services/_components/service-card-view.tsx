'use client'

import { ServiceCard } from './service-card'
import { EmptyState } from '@/components/molecules/empty-state'
import type { Service } from '@/core/domains/services/service.types'

interface ServiceCardViewProps {
  services: Service[]
}

/**
 * O componentă "dumb" responsabilă exclusiv cu afișarea unei liste
 * de servicii sub formă de carduri.
 */
export function ServiceCardView({ services }: ServiceCardViewProps) {
  // Am eliminat logger-ul. Componenta este acum pur prezentațională.
  return (
    <section aria-labelledby="services-cards-heading">
      <h2 id="services-cards-heading" className="sr-only">
        Listă de servicii
      </h2>

      {services.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        // Folosim noua componentă EmptyState cu props-uri descriptive
        <EmptyState
          title="Niciun Serviciu Adăugat"
          description="Momentan nu există servicii. Apasă 'Adaugă Serviciu' pentru a crea primul."
        />
      )}
    </section>
  )
}
