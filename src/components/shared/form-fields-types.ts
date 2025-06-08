// src/components/shared/form-fields-types.ts
import React from 'react' // Importăm React

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
  label: React.ReactNode
  disabled?: boolean
}

export interface FormFieldConfig<T extends Record<string, unknown>> {
  id: keyof T
  label: string
  type: FormFieldType
  placeholder?: string
  required?: boolean
  step?: string
  className?: string
  options?: FormFieldOption[]
}
