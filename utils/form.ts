// lib/utils/form.ts
import { StylistFormDataType } from '@/app/admin/stylists/types'
import { serviceInputSchema } from '@/lib/zod/schemas'
import { z } from 'zod'

/**
 * Extrage datele pentru un serviciu dintr-un obiect FormData.
 * Returnează un obiect parțial, lăsând validarea completă în seama Zod.
 * Valorile string vor fi mereu un string (chiar gol) pentru a evita `null`/`undefined` înainte de Zod.
 */
export function extractServiceDataFromForm(formData: FormData): Partial<z.infer<typeof serviceInputSchema>> {
  // Extrage valorile direct, asigurându-te că sunt string-uri goale dacă lipsesc.
  const name = formData.get('name')?.toString() || ''
  const description = formData.get('description')?.toString() || ''
  const durationMinutesStr = formData.get('duration_minutes')?.toString()
  const priceStr = formData.get('price')?.toString()
  const isActive = formData.get('is_active') === 'on' // Checkbox-urile sunt "on" sau lipsă
  const category = formData.get('category')?.toString() || ''
  const duration_minutes = durationMinutesStr ? parseInt(durationMinutesStr, 10) : undefined
  const price = priceStr ? parseFloat(priceStr) : undefined

  return {
    name,
    description,
    duration_minutes: isNaN(duration_minutes as number) ? undefined : duration_minutes,
    price: isNaN(price as number) ? undefined : price,
    is_active: isActive,
    category,
  }
}

/**
 * Extrage datele pentru un stilist dintr-un obiect FormData.
 * Returnează un obiect de tip StylistFormDataType, asigurând compatibilitatea.
 */
export function extractStylistDataFromForm(formData: FormData): StylistFormDataType {
  // Extrage valorile direct, asigurându-te că sunt string-uri goale dacă lipsesc.
  const name = formData.get('name')?.toString() || ''
  const email = formData.get('email')?.toString() || ''
  const phone = formData.get('phone')?.toString() || ''
  const description = formData.get('description')?.toString() || ''
  const isActive = formData.get('is_active') === 'on' // Checkbox-urile sunt "on" sau lipsă

  return {
    name,
    email,
    phone,
    description,
    is_active: isActive, // Zod-ul tău va gestiona `is_active: zBooleanCheckboxDefaultTrue`
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
