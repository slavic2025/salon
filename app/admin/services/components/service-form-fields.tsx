// app/admin/services/components/service-form-fields.tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { ActionResponse, ServiceData } from '@/app/admin/services/types'
import { SERVICE_FORM_FIELDS } from '@/app/admin/services/components/form-fields'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ServiceFormFields')

type FieldErrors = ActionResponse['errors']

interface ServiceFormFieldsProps {
  initialData?: ServiceData | null
  errors?: FieldErrors
  isEditMode?: boolean
}

export function ServiceFormFields({ initialData, errors, isEditMode = false }: ServiceFormFieldsProps) {
  logger.debug('Rendering ServiceFormFields', { isEditMode, hasInitialData: !!initialData, hasErrors: !!errors })

  return (
    <>
      {SERVICE_FORM_FIELDS.map((field) => {
        const defaultValue = initialData ? (initialData as ServiceData)[field.id] : undefined
        const fieldErrorMessages = errors && errors[field.id] ? errors[field.id] : undefined

        return (
          <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
            <Label htmlFor={isEditMode ? `edit-${String(field.id)}` : String(field.id)} className="text-right">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'checkbox' ? (
              <Checkbox
                id={isEditMode ? `edit-${String(field.id)}` : String(field.id)}
                name={String(field.id)}
                defaultChecked={
                  isEditMode ? (defaultValue as boolean) : defaultValue === undefined ? true : (defaultValue as boolean)
                }
                className="col-span-3"
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                id={isEditMode ? `edit-${String(field.id)}` : String(field.id)}
                name={String(field.id)}
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                placeholder={field.placeholder}
                required={field.required}
                className="col-span-3"
              />
            ) : (
              <Input
                id={isEditMode ? `edit-${String(field.id)}` : String(field.id)}
                name={String(field.id)}
                type={field.type}
                step={field.step}
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                placeholder={field.placeholder}
                required={field.required}
                className="col-span-3"
              />
            )}
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
