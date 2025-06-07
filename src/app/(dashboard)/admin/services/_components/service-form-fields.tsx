// src/app/(dashboard)/admin/services/_components/service-form-fields.tsx
'use client'

// 1. Importă funcția, nu constanta
import { getServiceFormConfig } from './service-form-config'
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { FormFieldConfig } from '@/components/shared/form-fields-types'
import { ActionResponse } from '@/types/actions.types'
import { Service } from '@/core/domains/services/service.types'

interface ServiceFormFieldsProps {
  // Am schimbat FieldErrors cu tipul mai specific din ActionResponse
  errors?: ActionResponse['errors']
  initialData?: Partial<Service> | null
  isEditMode?: boolean
}

export function ServiceFormFields({ initialData, errors, isEditMode = false }: ServiceFormFieldsProps) {
  // 2. Apelează funcția pentru a obține configurația
  const serviceFormConfig = getServiceFormConfig()

  return (
    <GenericFormFields<Partial<Service>>
      fieldsConfig={serviceFormConfig}
      initialData={initialData}
      errors={errors}
      isEditMode={isEditMode}
    />
  )
}
