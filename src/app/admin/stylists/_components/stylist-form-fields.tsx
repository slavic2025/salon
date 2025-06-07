// app/admin/stylists/components/stylist-form-fields.tsx
'use client'

import { STYLIST_FORM_FIELDS } from '@/app/admin/stylists/_components/form-fields'
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { FormFieldConfig } from '@/components/shared/form-fields-types'
import { FieldErrors } from '@/types/types'
import { StylistData } from '@/features/stylists/types'

interface StylistFormFieldsProps {
  initialData?: StylistData | null
  errors?: FieldErrors
  isEditMode?: boolean
}

export function StylistFormFields({ initialData, errors, isEditMode = false }: StylistFormFieldsProps) {
  const typedStylistFormFields: FormFieldConfig<StylistData>[] = STYLIST_FORM_FIELDS as FormFieldConfig<StylistData>[]
  return (
    <GenericFormFields<StylistData>
      fieldsConfig={typedStylistFormFields}
      initialData={initialData}
      errors={errors}
      isEditMode={isEditMode}
    />
  )
}
