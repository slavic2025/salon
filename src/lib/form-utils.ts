// src/lib/form-utils.ts
/**
 * Converts FormData into a plain object, handling specific cases for form elements.
 * - Handles checkboxes, converting 'on' to `true` and ensuring a `false` value if not present.
 * - Converts empty strings for specified optional fields to `null`.
 * @param formData The FormData object from the form submission.
 * @param optionalFields An array of keys that should be converted to `null` if they are empty strings.
 * @returns A plain object representation of the form data.
 */
export function formDataToObject(
  formData: FormData,
  optionalFields: string[] = ['description', 'category']
): Record<string, unknown> {
  const object: Record<string, any> = {}

  formData.forEach((value, key) => {
    if (key === 'is_active') {
      object[key] = value === 'on'
    } else if (optionalFields.includes(key) && value === '') {
      // Convert empty strings to null for optional text/textarea fields
      object[key] = null
    } else {
      object[key] = value
    }
  })

  // Ensure 'is_active' is always boolean, even if checkbox is not in FormData
  if (!Object.prototype.hasOwnProperty.call(object, 'is_active')) {
    object.is_active = false
  }

  return object
}

export function objectToFormData(obj: Record<string, any>): FormData {
  const formData = new FormData()

  Object.entries(obj).forEach(([key, value]) => {
    // Adăugăm în FormData doar valorile care nu sunt null sau undefined
    if (value !== null && value !== undefined) {
      formData.append(key, String(value))
    }
  })

  return formData
}
