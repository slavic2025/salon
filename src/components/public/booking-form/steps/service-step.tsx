// Această componentă poate fi definită direct în page.tsx sau într-un fișier separat
'use client'

import { useBookingStore } from '@/stores/use-booking-store'
import { type Service } from '@/core/domains/services/service.types'

interface ServiceStepProps {
  services: Service[]
}

export function ServiceStep({ services }: ServiceStepProps) {
  const selectService = useBookingStore((state) => state.selectService)

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Pasul 1: Alege un serviciu</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => selectService(service)}
            className="p-4 border rounded-lg text-center hover:bg-gray-100"
          >
            {service.name}
          </button>
        ))}
      </div>
    </div>
  )
}
