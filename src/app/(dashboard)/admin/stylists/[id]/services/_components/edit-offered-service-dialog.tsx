// src/app/(dashboard)/admin/stylists/[id]/services/_components/edit-offered-service-dialog.tsx
'use client'

import React, { useState } from 'react'
import { GenericEditDialog } from '@/components/shared/generic-edit-dialog'
import { EditOfferedServiceForm } from './edit-offered-service-form'
import { Tables } from '@/types/database.types'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'

interface EditOfferedServiceDialogProps {
  offeredService: ServiceOffered
  availableServices: Tables<'services'>[]
  trigger?: React.ReactNode
}

export function EditOfferedServiceDialog({
  offeredService,
  availableServices,
  trigger,
}: EditOfferedServiceDialogProps) {
  // Definim o componentă "wrapper" pentru formular
  // pentru a pasa toate proprietățile necesare.
  const FormComponentWithProps = (props: { entity: ServiceOffered; onSuccess: () => void; onCancel: () => void }) => (
    <EditOfferedServiceForm
      {...props}
      availableServices={availableServices}
      offeredService={props.entity} // Mapăm 'entity' din generic la 'offeredService'
    />
  )

  return (
    // Folosim componenta generică de dialog
    <GenericEditDialog<ServiceOffered>
      entity={offeredService}
      title={`Editează: ${offeredService.services?.name || 'Serviciu Oferit'}`}
      description="Modifică prețul, durata sau statusul de activare pentru acest serviciu."
      FormComponent={FormComponentWithProps} // Pasează componenta wrapper
    >
      {trigger}
    </GenericEditDialog>
  )
}
