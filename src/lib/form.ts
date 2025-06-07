// src/lib/form.ts
import { z } from 'zod'

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
