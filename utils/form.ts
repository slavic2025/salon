// lib/utils/form.ts
import { z } from 'zod'
import { serviceInputSchema } from '@/lib/db/service-core'

/**
 * Extrage și convertește datele din FormData într-un obiect Zod-friendly.
 * Este crucial să mapezi `is_active` de la 'on'/'off' la boolean.
 */
export function extractServiceDataFromForm(formData: FormData): Partial<z.infer<typeof serviceInputSchema>> {
  // Colectează toate câmpurile, asigurându-te că sunt de tipul potrivit pentru Zod
  return {
    name: formData.get('name')?.toString() || undefined,
    description: formData.get('description')?.toString() || undefined,
    duration_minutes: formData.get('duration_minutes') ? Number(formData.get('duration_minutes')) : undefined,
    price: formData.get('price') ? Number(formData.get('price')) : undefined,
    is_active: formData.get('is_active') === 'on' || formData.get('is_active') === 'true',
    category: formData.get('category')?.toString() || undefined,
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
      // Presupunem un singur nivel pentru path-uri pentru simplitate în UI.
      // Dacă ai path-uri imbricate (ex: 'adresa.strada'), ar trebui să ajustezi logica.
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
