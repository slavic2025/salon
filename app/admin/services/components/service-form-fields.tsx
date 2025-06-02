'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ActionResponse, ServiceData } from '@/app/admin/services/types'
import { SERVICE_FORM_FIELDS } from '@/app/admin/services/form-fields'

type FieldErrors = ActionResponse['errors']

interface ServiceFormFieldsProps {
  initialData?: ServiceData | null
  errors?: FieldErrors
  isEditMode?: boolean
}

export function ServiceFormFields({ initialData, errors, isEditMode = false }: ServiceFormFieldsProps) {
  return (
    <>
      {SERVICE_FORM_FIELDS.map((field) => {
        const defaultValue = initialData ? (initialData as ServiceData)[field.id] : undefined
        const fieldErrorMessages = errors && errors[field.id] ? errors[field.id] : undefined
        return (
          <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
            <Label htmlFor={isEditMode ? `edit-${field.id}` : field.id} className="text-right">
              {field.label}
            </Label>
            {field.type === 'checkbox' ? (
              <Checkbox
                id={isEditMode ? `edit-${field.id}` : field.id}
                name={field.id}
                defaultChecked={
                  isEditMode ? (defaultValue as boolean) : defaultValue === undefined ? true : (defaultValue as boolean)
                }
                className="col-span-3"
              />
            ) : (
              <Input
                id={isEditMode ? `edit-${field.id}` : field.id}
                name={field.id}
                type={field.type}
                step={field.step}
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                required={field.required}
                className="col-span-3"
              />
            )}
            {/* Afișăm erorile doar dacă `fieldErrorMessages` există și are elemente */}
            {fieldErrorMessages && fieldErrorMessages.length > 0 && (
              <p className="text-red-500 text-sm col-start-2 col-span-3">{fieldErrorMessages.join(', ')}</p>
            )}
          </div>
        )
      })}
      {/* Eroare generală la nivel de formular, dacă există */}
      {errors?._form && errors._form.length > 0 && (
        <p className="text-red-500 text-sm text-center col-span-full">{errors._form.join(', ')}</p>
      )}
    </>
  )
}
