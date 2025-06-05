// app/admin/services/components/edit-service-dialog.tsx
'use client'

import { ServiceData } from '@/features/services/types'
import { EditServiceForm } from './edit-service-form' // Formularul specific serviciilor
import { GenericEditDialog } from '@/components/shared/generic-edit-dialog' // <-- Noul import

interface EditServiceDialogProps {
  entity: ServiceData // Rămâne 'entity' pentru compatibilitatea cu GenericDisplayCard
  children?: React.ReactNode // Rămâne aici, definește că componenta poate primi copii
}

export function EditServiceDialog({ entity, children }: EditServiceDialogProps) {
  return (
    <GenericEditDialog<ServiceData> // Specificăm tipul generic ServiceData
      entity={entity}
      title="Editează Serviciul"
      description="Fă modificări aici. Apasă salvare când ai terminat."
      FormComponent={EditServiceForm}
    >
      {children}
    </GenericEditDialog>
  )
}
