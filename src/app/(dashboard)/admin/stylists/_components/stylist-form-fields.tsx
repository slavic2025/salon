// app/admin/stylists/components/stylist-form-fields.tsx
'use client'

import { STYLIST_FORM_FIELDS } from '@/app/(dashboard)/admin/stylists/_components/form-fields'
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { FormFieldConfig } from '@/components/shared/form-fields-types'
import { FieldErrors } from '@/types/actions.types'
import { Stylist } from '@/core/domains/stylists/stylist.types'

interface StylistFormFieldsProps {
  initialData?: Stylist | null
  errors?: FieldErrors
  isEditMode?: boolean
}

export function StylistFormFields({ initialData, errors, isEditMode = false }: StylistFormFieldsProps) {
  const typedStylistFormFields: FormFieldConfig<Stylist>[] = STYLIST_FORM_FIELDS as FormFieldConfig<Stylist>[]
  return (
    <GenericFormFields<Stylist>
      fieldsConfig={typedStylistFormFields}
      initialData={initialData}
      errors={errors}
      isEditMode={isEditMode}
    />
  )
}
