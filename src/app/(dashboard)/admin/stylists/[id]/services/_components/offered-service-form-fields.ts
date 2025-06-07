// app/admin/stylists/[id]/services/components/offered-service-form-fields.ts
import { FormFieldConfig, FormFieldOption } from '@/components/shared/form-fields-types'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'
import { Tables } from '@/types/database.types'

// Tip specific pentru câmpurile formularului de editare (doar câmpurile editabile)
type EditFormFieldsType = Pick<ServiceOffered, 'custom_price' | 'custom_duration' | 'is_active'>
// Tip specific pentru câmpurile formularului de adăugare (include service_id și câmpurile editabile)
// ServicesOfferedFormDataType este deja potrivit pentru adăugare.

// --- Supraîncărcarea funcțiilor ---

// Declarație pentru cazul isEditMode = true
export function getOfferedServiceFormFields(
  isEditMode: true,
  availableServices: Tables<'services'>[] // Poate fi opțional sau neutilizat aici, dar îl păstrăm pentru consistență
): FormFieldConfig<EditFormFieldsType>[]

// Declarație pentru cazul isEditMode = false
export function getOfferedServiceFormFields(
  isEditMode: false,
  availableServices: Tables<'services'>[]
): FormFieldConfig<ServiceOffered>[]

// Implementarea efectivă a funcției
export function getOfferedServiceFormFields(
  isEditMode: boolean,
  availableServices: Tables<'services'>[]
): FormFieldConfig<EditFormFieldsType>[] | FormFieldConfig<ServiceOffered>[] {
  // Definirea câmpurilor care sunt comune sau specifice modului de editare
  const fieldsForEdit: FormFieldConfig<EditFormFieldsType>[] = [
    {
      id: 'custom_price',
      label: `Preț Custom (${DEFAULT_CURRENCY_SYMBOL})`,
      type: 'number',
      step: '0.01',
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
    return fieldsForEdit
  } else {
    // Pentru modul de adăugare, includem și selectorul pentru service_id
    const serviceSelectField: FormFieldConfig<ServiceOffered> = {
      id: 'service_id', // Cheia este parte din ServicesOfferedFormDataType
      label: 'Serviciu',
      type: 'select',
      required: true,
      options: availableServices.map((service) => ({
        value: service.id,
        label: `${service.name} (${service.duration_minutes} min, ${service.price.toFixed(
          2
        )} ${DEFAULT_CURRENCY_SYMBOL})`,
      })),
      placeholder: 'Selectează un serviciu',
    }

    // Câmpurile din fieldsForEdit sunt, de asemenea, parte din ServicesOfferedFormDataType.
    // Trebuie să ne asigurăm că tipul generic se potrivește.
    const commonFieldsCastedForAdd: FormFieldConfig<ServiceOffered>[] = fieldsForEdit.map(
      (field) => field as FormFieldConfig<ServiceOffered>
    )

    return [serviceSelectField, ...commonFieldsCastedForAdd]
  }
}
