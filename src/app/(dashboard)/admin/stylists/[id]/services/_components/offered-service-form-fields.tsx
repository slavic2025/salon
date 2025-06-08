// src/app/(dashboard)/admin/stylists/[id]/services/_components/offered-service-form-fields.ts
import { FormFieldConfig } from '@/components/shared/form-fields-types'
import { AddOfferedServiceInput, EditOfferedServiceInput } from '@/core/domains/services-offered/services-offered.types'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'
import { Tables } from '@/types/database.types'

// Declarația 1: Pentru modul de EDITARE (isEditMode = true)
// Returnează o configurație bazată pe câmpurile parțiale din EditOfferedServiceInput.
export function getOfferedServiceFormFields(
  isEditMode: true,
  availableServices?: Tables<'services'>[] // Serviciile sunt opționale aici
): FormFieldConfig<Partial<EditOfferedServiceInput>>[]

// Declarația 2: Pentru modul de ADĂUGARE (isEditMode = false)
// Returnează o configurație bazată pe tipul de input pentru adăugare.
export function getOfferedServiceFormFields(
  isEditMode: false,
  availableServices: Tables<'services'>[]
): FormFieldConfig<AddOfferedServiceInput>[]

// Implementarea efectivă a funcției
export function getOfferedServiceFormFields(
  isEditMode: boolean,
  availableServices: Tables<'services'>[] = []
): FormFieldConfig<any>[] {
  // Folosim 'any' în implementare, dar tipajul extern e sigur

  const commonFields: FormFieldConfig<any>[] = [
    {
      id: 'custom_price',
      label: `Preț Custom (${DEFAULT_CURRENCY_SYMBOL})`,
      type: 'number',
      step: '1',
      placeholder: 'Lasă gol pentru prețul standard',
      required: false,
    },
    {
      id: 'custom_duration',
      label: 'Durată Custom (minute)',
      type: 'number',
      step: '1',
      placeholder: 'Lasă gol pentru durata standard',
      required: false,
    },
    {
      id: 'is_active',
      label: 'Activ pentru acest stilist',
      type: 'checkbox',
    },
  ]

  if (isEditMode) {
    return commonFields
  }

  const serviceSelectField: FormFieldConfig<AddOfferedServiceInput> = {
    id: 'service_id',
    label: 'Serviciu',
    type: 'select',
    required: true,
    placeholder: 'Selectează un serviciu de bază',
    options: availableServices.map((service) => ({
      value: service.id,
      // Folosim JSX pentru a formata eticheta
      label: (
        // AICI SUNT MODIFICĂRILE:
        // 1. Folosim items-start pentru a alinia la partea de sus
        // 2. Adăugăm un `gap` pentru spațiere
        <div className="flex justify-between w-full items-start gap-4">
          {/* Partea stângă: Numele, care acum poate fi pe mai multe rânduri */}
          <span className="flex-1 whitespace-normal break-words">{service.name}</span>

          {/* Partea dreaptă: Detaliile, care nu se vor micșora și rămân pe un rând */}
          <span className="flex-shrink-0 text-sm text-muted-foreground">
            {service.duration_minutes} min, {service.price} {DEFAULT_CURRENCY_SYMBOL}
          </span>
        </div>
      ),
    })),
  }

  return [serviceSelectField, ...commonFields]
}
