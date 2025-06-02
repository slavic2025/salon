// lib/utils/form.ts
import { serviceInputSchema, stylistInputSchema } from '@/lib/zod/schemas'
import { z } from 'zod'

export function extractServiceDataFromForm(formData: FormData): Partial<z.infer<typeof serviceInputSchema>> {
  const name = formData.get('name')?.toString()
  const description = formData.get('description')?.toString()
  const durationMinutesStr = formData.get('duration_minutes')?.toString()
  const priceStr = formData.get('price')?.toString()
  const isActive = formData.get('is_active') === 'on'
  const category = formData.get('category')?.toString()

  let duration_minutes: number | undefined
  if (durationMinutesStr) {
    const parsed = parseInt(durationMinutesStr, 10)
    duration_minutes = isNaN(parsed) ? undefined : parsed
  } else {
    duration_minutes = undefined
  }

  let price: number | undefined
  if (priceStr) {
    const parsed = parseFloat(priceStr)
    price = isNaN(parsed) ? undefined : parsed
  } else {
    price = undefined
  }

  return {
    name: name || undefined,
    description: description === '' ? null : description || undefined,
    duration_minutes: duration_minutes,
    price: price,
    is_active: isActive,
    category: category === '' ? null : category || undefined,
  }
}

export function extractStylistDataFromForm(formData: FormData): Partial<z.infer<typeof stylistInputSchema>> {
  const name = formData.get('name')?.toString()
  const email = formData.get('email')?.toString()
  const phone = formData.get('phone')?.toString()
  const description = formData.get('description')?.toString()
  const isActive = formData.get('is_active') === 'on'

  return {
    name: name || undefined,
    email: email || undefined,
    phone: phone === '' ? null : phone || undefined,
    description: description === '' ? null : description || undefined,
    is_active: isActive,
  }
}

/**
 * Formatează erorile Zod într-un format prietenos pentru UI.
 * Este generic pentru a putea fi folosit cu diverse scheme Zod.
 * @param error Obiectul ZodError.
 * @returns Un obiect cu erori formatate pe câmpuri.
 */
export function formatZodErrors<T>(error: z.ZodError<T>): Record<keyof T | '_form', string[]> {
  const fieldErrors: Record<string, string[]> = {}

  error.errors.forEach((err) => {
    if (err.path && err.path.length > 0) {
      const fieldName = err.path[0] as keyof T
      const key = fieldName as string

      if (!fieldErrors[key]) {
        fieldErrors[key] = []
      }
      fieldErrors[key]?.push(err.message)
    } else {
      if (!fieldErrors['_form']) {
        fieldErrors['_form'] = []
      }
      fieldErrors['_form']?.push(err.message)
    }
  })
  return fieldErrors as Record<keyof T | '_form', string[]>
}
