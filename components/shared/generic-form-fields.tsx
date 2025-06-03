// components/shared/generic-form-fields.tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { createLogger } from '@/lib/logger' // Poți păstra logger-ul aici
import { FormFieldConfig } from './form-fields-types'
import { FieldErrors } from '@/lib/types'

const logger = createLogger('GenericFormFields')

interface GenericFormFieldsProps<T extends Record<string, unknown>> {
  fieldsConfig: FormFieldConfig<T>[]
  initialData?: T | null
  errors?: FieldErrors
  isEditMode?: boolean
}

export function GenericFormFields<T extends Record<string, unknown>>({
  fieldsConfig,
  initialData,
  errors,
  isEditMode = false,
}: GenericFormFieldsProps<T>) {
  logger.debug('Rendering GenericFormFields', { isEditMode, hasInitialData: !!initialData, hasErrors: !!errors })

  return (
    <>
      {fieldsConfig.map((field) => {
        const defaultValue = initialData ? initialData[field.id] : undefined
        const fieldErrorMessages = errors && errors[String(field.id)] ? errors[String(field.id)] : undefined
        const inputId = isEditMode ? `edit-${String(field.id)}` : String(field.id)

        return (
          <div className={`grid grid-cols-4 items-center gap-4 ${field.className || ''}`} key={String(field.id)}>
            <Label htmlFor={inputId} className="text-right">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>

            {field.type === 'checkbox' ? (
              <Checkbox
                id={inputId}
                name={String(field.id)}
                defaultChecked={
                  isEditMode ? (defaultValue as boolean) : defaultValue === undefined ? true : (defaultValue as boolean)
                }
                className="col-span-3"
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                id={inputId}
                name={String(field.id)}
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                placeholder={field.placeholder}
                required={field.required}
                className="col-span-3"
              />
            ) : (
              <Input
                id={inputId}
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
      {errors?._form && errors._form.length > 0 && (
        <p className="text-red-500 text-sm text-center col-span-full">{errors._form.join(', ')}</p>
      )}
    </>
  )
}
