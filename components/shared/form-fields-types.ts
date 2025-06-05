// components/shared/form-fields-types.ts

// Adaugă 'select' la tipurile existente
export type FormFieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'checkbox'
  | 'textarea'
  | 'password'
  | 'tel'
  | 'url'
  | 'select'

export interface FormFieldOption {
  value: string
  label: string
  disabled?: boolean // Opțional, dacă ai nevoie să dezactivezi anumite opțiuni
}

export interface FormFieldConfig<T extends Record<string, unknown>> {
  id: keyof T
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  step?: string // Pentru inputuri de tip 'number'
  className?: string
  options?: FormFieldOption[] // Noua proprietate pentru câmpurile de tip 'select'
}
