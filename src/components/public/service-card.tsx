// src/components/public/service-card.tsx

import { Service } from '@/core/domains/services/service.types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Tag } from 'lucide-react'
import Image from 'next/image'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-xl">
      {/* Containerul pentru imagine trebuie sa fie 'relative' cand folosim 'fill' pe imagine */}
      <div className="relative h-56 w-full">
        <Image
          src={`https://picsum.photos/seed/${service.id}/400/300`}
          alt={service.name}
          fill // <-- NOU: Inlocuieste layout="fill"
          className="object-cover" // <-- NOU: Inlocuieste objectFit="cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{service.description || 'Fără descriere.'}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-gray-50 px-6 py-4">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Tag className="h-4 w-4 text-gray-500" />
          <span>{service.price} RON</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Clock className="h-4 w-4 text-gray-500" />
          <span>{service.duration_minutes} min</span>
        </div>
      </CardFooter>
    </Card>
  )
}
