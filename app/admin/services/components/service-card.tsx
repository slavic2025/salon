// app/admin/services/components/service-card.tsx
'use client'

import { ServiceData } from '@/app/admin/services/types'
import { EditServiceDialog } from '@/app/admin/services/components/edit-service-dialog'
import { SERVICE_DISPLAY_FIELDS } from './service-display-fields' // Configurația specifică serviciului
import { deleteServiceAction } from '../actions' // Acțiunea specifică serviciului
import { GenericDisplayCard } from '@/components/shared/generic-display-card' // <--- Noul import!
import { DisplayFieldConfig } from '@/components/shared/display-card-types' // Importă tipurile noi

interface ServiceCardProps {
  service: ServiceData
}

export function ServiceCard({ service }: ServiceCardProps) {
  const typedDisplayFields: DisplayFieldConfig<ServiceData>[] =
    SERVICE_DISPLAY_FIELDS as DisplayFieldConfig<ServiceData>[]

  return (
    <GenericDisplayCard<ServiceData>
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
