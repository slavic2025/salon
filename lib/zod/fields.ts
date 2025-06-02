// zod/fields.ts
import { z } from 'zod'

// ========== ENV ==========
export const zEnvHost = z.enum(['local', 'production'])

export const zEnvNonemptyTrimmed = z.string().trim().min(1)

export const zEnvNonemptyTrimmedRequiredOnNotLocal = zEnvNonemptyTrimmed
  .optional()
  .refine((val) => process.env.HOST_ENV === 'local' || !!val, { message: 'Required on non-local host' })

// ========== STRINGS ==========
export const zStringRequired = z.string({ required_error: 'Please, fill it' }).min(1, 'Please, fill it')

// O versiune explicită pentru string opțional. Este echivalent cu z.string().optional()
export const zStringOptional = z.string().optional()

// O versiune pentru string care poate fi null sau opțional (nedefinit)
export const zStringNullableOptional = z.string().nullable().optional()

export const zStringMin = (min: number) => zStringRequired.min(min, `Text should be at least ${min} characters long`)

export const zNickRequired = zStringRequired.regex(
  /^[a-z0-9-]+$/,
  'Nick may contain only lowercase letters, numbers and dashes'
)

export const zEmailRequired = zStringRequired.email('Invalid email address')

// ========== PASSWORD ==========
export const zPasswordRequired = zStringMin(6)

export const zPasswordsMustBeTheSame =
  <T extends Record<string, string>>(passwordField: string, confirmField: string) =>
  (val: T, ctx: z.RefinementCtx) => {
    if (val[passwordField] !== val[confirmField]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords must be the same',
        path: [confirmField],
      })
    }
  }

// ========== BOOLEAN FROM FORMS ==========
export const zBooleanFromFormDefaultTrue = z.preprocess(
  (val) => val === 'on' || val === true,
  z.boolean().default(true)
)

// Această versiune: Pentru un checkbox standard unde nebifat înseamnă FALSE.
// Dacă valoarea este 'on', este true. Altfel (inclusiv undefined/null pentru nebifat), este false.
export const zBooleanCheckbox = z.preprocess((val) => val === 'on', z.boolean())

// ========== NUMERIC FROM FORMS ==========
export const zIntFromForm = (msg = 'Valoarea trebuie să fie un număr întreg pozitiv.') =>
  z.preprocess((val) => parseInt(String(val), 10), z.number().int().positive({ message: msg }))

export const zPriceFromForm = z.preprocess(
  (val) => parseFloat(String(val)),
  z
    .number()
    .positive({ message: 'Prețul trebuie să fie un număr pozitiv.' })
    .multipleOf(0.01, { message: 'Prețul poate avea maxim două zecimale.' })
)
