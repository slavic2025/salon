// app/admin/services/components/service-card.tsx
'use client'

import { EditServiceDialog } from '@/app/admin/services/_components/edit-service-dialog'
import { SERVICE_DISPLAY_FIELDS } from './service-display-fields' // Configurația specifică serviciului
import { GenericDisplayCard } from '@/components/shared/generic-display-card' // <--- Noul import!
import { DisplayFieldConfig } from '@/components/shared/display-card-types' // Importă tipurile noi
import { deleteServiceAction } from '@/features/services/actions'
import { Service } from '@/core/domains/services/service.types'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  const typedDisplayFields: DisplayFieldConfig<Service>[] = SERVICE_DISPLAY_FIELDS as DisplayFieldConfig<Service>[]

  return (
    <GenericDisplayCard<Service>
      entity={service}
      displayFieldsConfig={typedDisplayFields}
      EditDialog={EditServiceDialog}
      deleteAction={deleteServiceAction}
      cardTitle={service.name}
      cardDescription={service.description}
      deleteLabel="Șterge"
      deleteButtonAriaLabel={`Șterge serviciul ${service.name}`}
    />
  )
}
