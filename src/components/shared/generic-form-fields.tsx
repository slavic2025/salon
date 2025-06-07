// components/shared/generic-form-fields.tsx
'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { createLogger } from '@/lib/logger'
import { FormFieldConfig } from './form-fields-types' // Acum include 'options' și 'select'
import { FieldErrors } from '@/lib/types'
// Importă componentele Select de la shadcn/ui
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select' // Asigură-te că shadcn/ui add select a creat acest fișier

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
        // Asigurăm că initialData[field.id] este tratat ca `string` pentru `Select`
        const defaultValue = initialData ? initialData[field.id] : undefined
        const fieldErrorMessages = errors && errors[String(field.id)] ? errors[String(field.id)] : undefined
        const inputId = isEditMode ? `edit-${String(field.id)}` : String(field.id)
        const isInvalid = !!fieldErrorMessages && fieldErrorMessages.length > 0

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
                aria-invalid={isInvalid} // Adaugă aria-invalid
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                id={inputId}
                name={String(field.id)}
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                placeholder={field.placeholder}
                required={field.required}
                className="col-span-3"
                aria-invalid={isInvalid} // Adaugă aria-invalid
              />
            ) : field.type === 'select' && field.options ? (
              // NOU: Randare pentru câmp de tip 'select'
              // Notă: Pentru React Hook Form, adesea Select-ul este înfășurat într-un Controller
              // Aici, gestionăm valoarea implicită manual, similar cu alte input-uri.
              // Dacă folosești FormProvider și Controller direct, abordarea ar fi diferită.
              // Pentru `useActionState` cu FormData, abordarea este mai simplă.
              <Select
                name={String(field.id)} // Important pentru FormData
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : undefined}
                required={field.required}
              >
                <SelectTrigger
                  id={inputId}
                  className={`col-span-3 ${
                    isInvalid
                      ? 'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40'
                      : ''
                  }`}
                  aria-invalid={isInvalid}
                >
                  <SelectValue placeholder={field.placeholder || 'Selectează...'} />
                </SelectTrigger>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              // Randare pentru alte tipuri de input (text, number, email, etc.)
              <Input
                id={inputId}
                name={String(field.id)}
                type={field.type === 'select' ? 'text' : field.type} // Fallback pentru type safety dacă 'select' ajunge aici
                step={field.step}
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                placeholder={field.placeholder}
                required={field.required}
                className="col-span-3"
                aria-invalid={isInvalid} // Adaugă aria-invalid
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
