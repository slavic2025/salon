// app/admin/services/components/service-form-fields.tsx
'use client'

import { SERVICE_FORM_FIELDS } from '@/app/admin/services/_components/form-fields'
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { FormFieldConfig } from '@/components/shared/form-fields-types'
import { FieldErrors } from '@/lib/types'
import { ServiceData } from '@/features/services/types'

interface ServiceFormFieldsProps {
  initialData?: ServiceData | null
  errors?: FieldErrors
  isEditMode?: boolean
}

export function ServiceFormFields({ initialData, errors, isEditMode = false }: ServiceFormFieldsProps) {
  const typedServiceFormFields: FormFieldConfig<ServiceData>[] = SERVICE_FORM_FIELDS as FormFieldConfig<ServiceData>[]

  return (
    <GenericFormFields<ServiceData> // Specificăm tipul generic pentru entitatea 'ServiceData'
      fieldsConfig={typedServiceFormFields}
      initialData={initialData}
      errors={errors}
      isEditMode={isEditMode}
    />
  )
}
