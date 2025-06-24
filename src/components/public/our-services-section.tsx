import { type Service } from '@/core/domains/services/service.types'
import { ServiceCard } from './service-card' // Componenta existentă pentru un singur card

interface OurServicesSectionProps {
  services: Service[]
}

export function OurServicesSection({ services }: OurServicesSectionProps) {
  return (
    <section id="servicii" className="w-full py-16 lg:py-24">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Serviciile Noastre</h2>
          <p className="mt-4 text-lg text-muted-foreground">Calitate excepțională, rezultate pe măsură.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map(
            (
              service // Afișăm maxim 6 servicii pe prima pagină
            ) => (
              <ServiceCard key={service.id} service={service} />
            )
          )}
        </div>
      </div>
    </section>
  )
}
