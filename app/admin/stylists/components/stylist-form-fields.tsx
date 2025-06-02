// app/admin/stylists/components/stylist-form-fields.tsx
'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Stylist } from '@/lib/db/stylist-core'
import { STYLIST_FORM_FIELDS } from '@/app/admin/stylists/components/form-fields'
import { createLogger } from '@/lib/logger'
import { StylistActionResponse, StylistData } from '@/app/admin/stylists/types'

const logger = createLogger('StylistFormFields')

type FieldErrors = StylistActionResponse['errors']

interface StylistFormFieldsProps {
  initialData?: Stylist | null // Datele inițiale pentru modul de editare
  errors?: FieldErrors // Erori de validare de la Server Action
  isEditMode?: boolean // True dacă formularul este pentru editare
}

export function StylistFormFields({ initialData, errors, isEditMode = false }: StylistFormFieldsProps) {
  logger.debug('Rendering StylistFormFields', { isEditMode, hasInitialData: !!initialData, hasErrors: !!errors })

  return (
    <>
      {STYLIST_FORM_FIELDS.map((field) => {
        // Asigură că defaultValue este de tipul corect al câmpului
        const defaultValue = initialData ? (initialData as StylistData)[field.id] : undefined
        const fieldErrorMessages = errors && errors[field.id] ? errors[field.id] : undefined

        // Folosește un ID unic pentru fiecare câmp, util pentru editare
        const inputId = isEditMode ? `edit-${String(field.id)}` : String(field.id)

        return (
          <div className="grid grid-cols-4 items-center gap-4" key={field.id}>
            <Label htmlFor={inputId} className="text-right">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.type === 'checkbox' ? (
              <Checkbox
                id={inputId}
                name={String(field.id)}
                // defaultChecked: pentru editare ia valoarea existentă, altfel este implicit true (pentru adăugare)
                defaultChecked={
                  isEditMode ? (defaultValue as boolean) : defaultValue === undefined ? true : (defaultValue as boolean)
                }
                className={`col-span-3 ${fieldErrorMessages ? 'border-red-500' : ''}`}
              />
            ) : field.type === 'textarea' ? (
              <Textarea
                id={inputId}
                name={String(field.id)}
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                placeholder={field.placeholder}
                required={field.required}
                className={`col-span-3 ${fieldErrorMessages ? 'border-red-500' : ''}`}
              />
            ) : (
              <Input
                id={inputId}
                name={String(field.id)}
                type={field.type}
                step={field.step} // Va fi definit doar pentru 'number', ignorat pentru altele
                defaultValue={defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : ''}
                placeholder={field.placeholder}
                required={field.required}
                className={`col-span-3 ${fieldErrorMessages ? 'border-red-500' : ''}`}
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
