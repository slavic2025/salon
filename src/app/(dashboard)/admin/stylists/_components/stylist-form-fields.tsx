// src/app/(dashboard)/admin/stylists/_components/stylist-form-fields.tsx
'use client'

import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { ActionResponse } from '@/types/actions.types'
import { Stylist } from '@/core/domains/stylists/stylist.types'
import { getStylistFormConfig } from './stylist-form-config' // 1. Importăm noua funcție

interface StylistFormFieldsProps {
  initialData?: Partial<Stylist> | null
  errors?: ActionResponse['errors']
  isEditMode?: boolean
}

export function StylistFormFields({ initialData, errors, isEditMode = false }: StylistFormFieldsProps) {
  // 2. Apelăm funcția pentru a obține dinamic configurația
  const stylistFormConfig = getStylistFormConfig()

  return (
    <GenericFormFields<Partial<Stylist>>
      // 3. Pasăm configurația obținută către componenta generică
      fieldsConfig={stylistFormConfig}
      initialData={initialData}
      errors={errors}
      isEditMode={isEditMode}
    />
  )
}
