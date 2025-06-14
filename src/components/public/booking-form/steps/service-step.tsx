import { EmptyState } from '@/components/ui/empty-state'
import type { Service } from '@/core/domains/services/service.types'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

interface ServiceStepProps {
  services: Service[]
  onSelect: (service: Service) => void
}

export function ServiceStep({ services, onSelect }: ServiceStepProps) {
  if (!services?.length) {
    return (
      <EmptyState
        title="Niciun serviciu disponibil"
        description="Momentan nu avem servicii active pentru programări online."
      />
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold leading-6 text-gray-900">Alege un serviciu</h3>
        <p className="mt-1 text-sm text-gray-500">Selectează serviciul dorit din lista de mai jos</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className="group relative rounded-lg border border-gray-300 bg-white p-4 text-left shadow-sm transition-all hover:border-indigo-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="flex flex-col h-full">
              <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {service.name}
              </p>
              <p className="mt-1 text-sm text-gray-500 flex-grow">
                {service.description}
              </p>
              <div className="mt-4 flex justify-between items-center text-sm font-medium">
                <span className="text-indigo-600">{service.price} {DEFAULT_CURRENCY_SYMBOL}</span>
                <span className="text-gray-500">{service.duration_minutes} min</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 