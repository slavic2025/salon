// src/app/(dashboard)/admin/stylists/[id]/services/_components/service-offered-card.tsx
'use client'

import { GenericDisplayCard } from '@/components/shared/generic-display-card'
import { ActiveBadge } from '@/components/ui/active-badge'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'
import { deleteOfferedServiceAction } from '@/features/services-offered/actions'
import { EditOfferedServiceDialog } from './edit-offered-service-dialog'
import { SERVICE_OFFERED_DISPLAY_FIELDS } from './service-offered-display-fields'
import { Tables } from '@/types/database.types'

interface ServiceOfferedCardProps {
  offeredService: ServiceOffered
  availableServices: Tables<'services'>[]
}

export function ServiceOfferedCard({ offeredService, availableServices }: ServiceOfferedCardProps) {
  const serviceName = offeredService.services?.name || 'Serviciu nedefinit'

  return (
    <GenericDisplayCard<ServiceOffered>
      entity={offeredService}
      displayFieldsConfig={SERVICE_OFFERED_DISPLAY_FIELDS}
      EditDialog={(props) => (
        <EditOfferedServiceDialog {...props} availableServices={availableServices} offeredService={props.entity} />
      )}
      deleteAction={deleteOfferedServiceAction}
      cardTitle={serviceName}
      cardDescription={`Preț standard: ${Math.round(offeredService.services?.price || 0)} MDL`}
      // Nu avem avatar, dar afișăm statusul în header
      headerActions={<ActiveBadge isActive={offeredService.is_active} />}
      // Pasăm și ID-ul stilistului pentru revalidarea corectă la ștergere
      deleteRevalidationId={offeredService.stylist_id}
    />
  )
}
