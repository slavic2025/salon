// app/admin/services/components/service-form-fields.tsx
'use client'

import { SERVICE_FORM_FIELDS } from '@/app/admin/services/_components/form-fields'
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { FormFieldConfig } from '@/components/shared/form-fields-types'
import { FieldErrors } from '@/types/types'
import { Service } from '@/core/domains/services/service.types'

interface ServiceFormFieldsProps {
  initialData?: Service | null
  errors?: FieldErrors
  isEditMode?: boolean
}

export function ServiceFormFields({ initialData, errors, isEditMode = false }: ServiceFormFieldsProps) {
  const typedServiceFormFields: FormFieldConfig<Service>[] = SERVICE_FORM_FIELDS as FormFieldConfig<Service>[]

  return (
    <GenericFormFields<Service> // Specificăm tipul generic pentru entitatea 'ServiceData'
      fieldsConfig={typedServiceFormFields}
      initialData={initialData}
      errors={errors}
      isEditMode={isEditMode}
    />
  )
}
