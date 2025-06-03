// components/shared/form-fields-types.ts

export type FormFieldType = 'text' | 'email' | 'number' | 'checkbox' | 'textarea' | 'password' | 'tel' | 'url'

export interface FormFieldConfig<T extends Record<string, unknown>> {
  id: keyof T
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  step?: string
  className?: string
}
