'use client'

import { type Stylist } from '@/core/domains/stylists/stylist.types'
import { type Service } from '@/core/domains/services/service.types'
import { type ServiceOffered } from '@/core/domains/services-offered/service-offered.types'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { AddServiceToStylistForm } from './add-service-to-stylist-form'
import { OfferedServiceList } from './offered-service-list'

interface PageContentProps {
  stylist: Stylist
  allServices: Service[]
  offeredServices: ServiceOffered[]
}

/**
 * Componenta "Dumb" care afișează interfața pentru managementul serviciilor unui stilist.
 */
export function ServicesOfferedPageContent({ stylist, allServices, offeredServices }: PageContentProps) {
  // Filtrăm serviciile care nu sunt deja oferite pentru a le afișa în dropdown
  const availableServicesToAdd = allServices.filter(
    (service) => !offeredServices.some((offered) => offered.service_id === service.id)
  )

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Servicii Oferite</h1>
        <p className="text-muted-foreground">
          Gestionează serviciile prestate de <strong>{stylist.full_name}</strong>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Partea din stânga: Adăugarea unui serviciu nou */}
        <Card>
          <CardHeader>
            <CardTitle>Adaugă Serviciu Nou</CardTitle>
            <CardDescription>
              Selectează un serviciu din lista generală pentru a-l atribui acestui stilist.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AddServiceToStylistForm stylistId={stylist.id} availableServices={availableServicesToAdd} />
          </CardContent>
        </Card>

        {/* Partea din dreapta: Lista serviciilor deja oferite */}
        <Card>
          <CardHeader>
            <CardTitle>Servicii Atribuite</CardTitle>
            <CardDescription>Lista serviciilor pe care {stylist.full_name} le poate presta.</CardDescription>
          </CardHeader>
          <CardContent>
            <OfferedServiceList stylistId={stylist.id} offeredServices={offeredServices} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
