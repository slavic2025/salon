// src/app/(dashboard)/admin/services/_components/service-card.tsx
'use client'

import { EditServiceDialog } from './edit-service-dialog'
import { SERVICE_DISPLAY_FIELDS } from './service-display-fields'
import { GenericDisplayCard } from '@/components/shared/generic-display-card'
import { DisplayFieldConfig } from '@/components/shared/display-card-types'
import { Service } from '@/core/domains/services/service.types'
import { deleteServiceAction } from '@/features/services/actions'
import { ActiveBadge } from '@/components/ui/active-badge' // Importăm badge-ul
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const typedDisplayFields: DisplayFieldConfig<Service>[] = SERVICE_DISPLAY_FIELDS as any

  // Creăm o descriere mai bogată pentru card
  const description = `${service.duration_minutes} min • ${Math.round(service.price)} ${DEFAULT_CURRENCY_SYMBOL}`

  return (
    <GenericDisplayCard<Service>
      entity={service}
      displayFieldsConfig={typedDisplayFields}
      EditDialog={EditServiceDialog}
      deleteAction={deleteServiceAction}
      cardTitle={service.name}
      cardDescription={description} // Folosim descrierea creată
      // Un serviciu nu are avatar, deci nu pasăm `avatarUrl` sau `entityInitials`
      // Mutăm badge-ul de status în header-ul cardului pentru vizibilitate maximă
      headerActions={<ActiveBadge isActive={service.is_active} />}
    />
  )
}
