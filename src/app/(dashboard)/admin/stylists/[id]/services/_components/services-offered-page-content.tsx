// src/app/(dashboard)/admin/stylists/[id]/services/_components/services-offered-page-content.tsx
'use client'

import { Tables } from '@/types/database.types'
import { Stylist } from '@/core/domains/stylists/stylist.types'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'
import { AddOfferedServiceDialog } from './add-offered-service-dialog'
import { GenericTableView } from '@/components/shared/generic-table-view'
import { OFFERED_SERVICE_TABLE_HEADERS } from './offered-service-table-headers'
import { OfferedServiceTableRow } from './offered-service-table-row'

interface ServicesOfferedPageContentProps {
  stylist: Stylist
  initialServicesOffered: ServiceOffered[]
  availableServices: Tables<'services'>[]
}

export function ServicesOfferedPageContent({
  stylist,
  initialServicesOffered,
  availableServices,
}: ServicesOfferedPageContentProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Servicii Oferite de {stylist.name}</h1>
          <p className="text-muted-foreground">
            Gestionați serviciile, prețurile și duratele personalizate pentru acest stilist.
          </p>
        </div>
        <AddOfferedServiceDialog stylistId={stylist.id} availableServices={availableServices} />
      </div>

      <GenericTableView
        data={initialServicesOffered}
        headers={OFFERED_SERVICE_TABLE_HEADERS}
        renderRow={(item) => (
          <OfferedServiceTableRow key={item.id} offeredService={item} availableServices={availableServices} />
        )}
        emptyMessage="Acest stilist nu are încă niciun serviciu asociat."
        tableHeadingId={`offered-services-table-${stylist.id}`}
        tableHeadingText={`Tabel cu servicii oferite de ${stylist.name}`}
      />

      {/* Aici poți adăuga varianta de afișare pe carduri pentru mobil, dacă dorești */}
    </div>
  )
}
