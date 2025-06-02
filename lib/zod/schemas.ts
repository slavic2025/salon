// zod/schemas.ts
import { z } from 'zod'
import {
  zEmailRequired,
  zPasswordRequired,
  zBooleanCheckbox,
  zIntFromForm,
  zPriceFromForm,
  zStringNullableOptional,
  zStringMin,
} from './fields'

// ================= LOGIN =================
export const loginSchema = z.object({
  email: zEmailRequired,
  password: zPasswordRequired,
})

// ================= SERVICE =================
export const serviceInputSchema = z.object({
  name: z.string().min(1, { message: 'Numele serviciului este obligatoriu.' }),
  description: zStringNullableOptional,
  duration_minutes: zIntFromForm('Durata trebuie să fie un număr întreg pozitiv.'),
  price: zPriceFromForm,
  is_active: zBooleanCheckbox,
  category: zStringNullableOptional,
})

// ================= STYLIST =================
export const stylistInputSchema = z.object({
  name: zStringMin(3),
  email: zEmailRequired,
  phone: zStringNullableOptional,
  description: zStringNullableOptional,
  is_active: zBooleanCheckbox,
})

export const DeleteStylistSchema = z.object({
  id: z
    .string()
    .min(1, { message: 'ID-ul stilistului este obligatoriu.' })
    .uuid({ message: 'ID-ul stilistului este invalid.' }),
})
