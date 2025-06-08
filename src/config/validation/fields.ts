// zod/fields.ts
import { z } from 'zod'

// --- ENV ---
// Definește medii de rulare, util pentru configurări condiționate.
export const zEnvHost = z.enum(['local', 'production'])

// Asigură că un șir este non-gol și fără spații la început/sfârșit.
export const zEnvNonemptyTrimmed = z.string().trim().min(1, 'Value cannot be empty or just spaces.')

// O variabilă de mediu este obligatorie doar în medii non-locale.
export const zEnvNonemptyTrimmedRequiredOnNotLocal = zEnvNonemptyTrimmed
  .optional()
  .refine((val) => process.env.HOST_ENV === 'local' || !!val, {
    message: 'This field is required in non-local environments.',
  })

// --- STRINGURI ---
// Un șir obligatoriu, non-gol. Folosește mesajul implicit al lui min(1) dacă este gol.
// `required_error` este pentru când valoarea este `undefined` sau `null` la nivelul obiectului,
// nu pentru un string gol. Am combinat-o pentru claritate, dar `min(1)` gestionează stringurile goale.
export const zStringRequired = z.string().min(1, 'This field is required.')

// Un șir care poate fi absent (`undefined`) dar, dacă este prezent, trebuie să fie un string.
export const zStringOptional = z.string().optional()

// Un șir care poate fi `null` sau absent (`undefined`), dar, dacă este prezent, trebuie să fie un string.
// Aceasta este utilă pentru câmpurile care pot fi lăsate goale în UI și stocate ca `null` în DB.
export const zStringNullableOptional = z.string().nullable().optional()

// Un șir obligatoriu cu o lungime minimă specificată.
export const zStringMin = (min: number, message?: string) =>
  z.string().min(min, message || `Text must be at least ${min} characters long.`)

// Un șir obligatoriu care respectă formatul de "nick" (litere mici, numere, cratime).
export const zNickRequired = zStringRequired.regex(
  /^[a-z0-9-]+$/,
  'Nickname may contain only lowercase letters, numbers, and hyphens.'
)

export const zPhoneRequired = zStringRequired.regex(
  /^\+373 (6|7)\d{7}$/,
  'Număr de telefon invalid. Format așteptat: +373 6/7XXXXXXX'
)

// Un șir obligatoriu care este o adresă de email validă.
export const zEmailRequired = zStringRequired.email('Invalid email address.')

// --- PAROLA ---
// O parolă obligatorie cu o lungime minimă de 6 caractere.
export const zPasswordRequired = zStringMin(6, 'Password must be at least 6 characters long.')

// Funcție de rafinare pentru a verifica dacă două câmpuri de parolă sunt identice.
// Este mai flexibilă deoarece primește numele câmpurilor ca argumente.
export const zPasswordsMustBeTheSame =
  <T extends z.AnyZodObject>(passwordField: keyof T['_input'], confirmField: keyof T['_input']) =>
  (val: T['_input'], ctx: z.RefinementCtx) => {
    if (val[String(passwordField)] !== val[String(confirmField)]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match.',
        path: [confirmField as string | number],
      })
    }
  }

// --- BOOLEAN DIN FORMULAR ---
// Preprocesează valoarea unui checkbox pentru a o transforma în boolean.
// `z.coerce.boolean()` este o metodă Zod excelentă pentru asta.
// 'on', 'true', 1, '1' devin `true`; restul `false`.
export const zBooleanCheckbox = z.coerce.boolean()

// Similar cu zBooleanCheckbox, dar cu o valoare implicită de `true` dacă nu este prezent.
// Utile pentru checkbox-uri care, dacă nu sunt bifate, ar trebui să rămână `true` (ex: `is_active`).
export const zBooleanCheckboxDefaultTrue = z.coerce.boolean().default(true)

// --- NUMERICE DIN FORMULAR ---
// Preprocesează și validează un număr întreg pozitiv dintr-un input de formular.
// Mesajul de eroare poate fi personalizat.
export const zIntFromForm = (msg = 'Value must be a positive integer.') =>
  z.preprocess(
    (val) => (val === null || val === '' ? undefined : parseInt(String(val), 10)), // Transforma null/empty string în undefined
    z.number().int().positive({ message: msg })
  )

// Preprocesează și validează un preț dintr-un input de formular.
// Asigură-te că este un număr pozitiv și cu maxim două zecimale.
export const zPriceFromForm = z.preprocess(
  // Folosim parseInt în loc de parseFloat pentru a ignora zecimalele
  (val) => (val === null || val === '' ? undefined : parseInt(String(val), 10)),
  z
    .number({ invalid_type_error: 'Prețul trebuie să fie un număr.' })
    .int({ message: 'Prețul trebuie să fie un număr întreg.' })
    .positive({ message: 'Prețul trebuie să fie un număr pozitiv.' })
  // Am eliminat .multipleOf(0.01)
)
