// lib/utils/form.ts
import { editServiceSchema } from '@/features/services/types'
import { addStylistSchema, editOfferedServiceSchema, editStylistSchema } from '@/lib/zod/schemas'
import { z } from 'zod'

// Tipuri suportate pentru field-uri
type FormFieldType = 'string' | 'number' | 'boolean'

interface FormFieldConfig<K extends PropertyKey> {
  key: K
  type: FormFieldType
}

// Generic helper pentru extragerea valorilor din FormData
function extractFormDataGeneric<T>(formData: FormData, fieldConfigs: FormFieldConfig<keyof T & string>[]): Partial<T> {
  const result = {} as Partial<T>

  for (const { key, type } of fieldConfigs) {
    const raw = formData.get(key)

    if (raw === null) continue

    let value: unknown

    switch (type) {
      case 'string':
        value = raw.toString()
        break
      case 'number':
        value = raw.toString()
        break
      case 'boolean':
        value = raw === 'on'
        break
    }

    result[key] = value as T[typeof key]
  }

  return result
}

// ================= SERVICE =================
export function extractServiceDataFromForm(formData: FormData): Partial<z.infer<typeof editServiceSchema>> {
  const fields: FormFieldConfig<keyof z.infer<typeof editServiceSchema>>[] = [
    { key: 'id', type: 'string' },
    { key: 'name', type: 'string' },
    { key: 'description', type: 'string' },
    { key: 'duration_minutes', type: 'number' },
    { key: 'price', type: 'number' },
    { key: 'is_active', type: 'boolean' },
    { key: 'category', type: 'string' },
  ]
  return extractFormDataGeneric<z.infer<typeof editServiceSchema>>(formData, fields)
}

// ================= STYLIST =================
export function extractStylistDataFromForm(formData: FormData): Partial<z.infer<typeof editStylistSchema>> {
  const fields: FormFieldConfig<keyof z.infer<typeof editStylistSchema>>[] = [
    { key: 'id', type: 'string' },
    { key: 'name', type: 'string' },
    { key: 'email', type: 'string' },
    { key: 'phone', type: 'string' },
    { key: 'description', type: 'string' },
    { key: 'is_active', type: 'boolean' },
  ]
  return extractFormDataGeneric<z.infer<typeof editStylistSchema>>(formData, fields)
}

// ================= SERVICES OFFERED =================
export function extractServicesOfferedDataFromForm(
  formData: FormData
): Partial<z.infer<typeof editOfferedServiceSchema>> {
  // Folosim editOfferedServiceSchema pentru a include 'id' și 'stylist_id'
  const fields: FormFieldConfig<keyof z.infer<typeof editOfferedServiceSchema>>[] = [
    { key: 'id', type: 'string' }, // Pentru editare
    { key: 'stylist_id', type: 'string' }, // Necesar pentru context, deși nu e direct editabil
    { key: 'service_id', type: 'string' },
    { key: 'custom_price', type: 'number' },
    { key: 'custom_duration', type: 'number' },
    { key: 'is_active', type: 'boolean' },
  ]
  return extractFormDataGeneric<z.infer<typeof editOfferedServiceSchema>>(formData, fields)
}

// ================= ZOD ERROR FORMATTER =================
export function formatZodErrors<T>(error: z.ZodError<T>): Record<keyof T | '_form', string[]> {
  const fieldErrors: Record<string, string[]> = {}

  for (const err of error.errors) {
    if (err.path.length > 0) {
      const key = err.path[0] as string
      fieldErrors[key] = fieldErrors[key] || []
      fieldErrors[key].push(err.message)
    } else {
      fieldErrors['_form'] = fieldErrors['_form'] || []
      fieldErrors['_form'].push(err.message)
    }
  }

  return fieldErrors as Record<keyof T | '_form', string[]>
}
