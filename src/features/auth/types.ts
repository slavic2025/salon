import { zEmailRequired, zPasswordRequired } from '@/config/validation/fields'
import { z } from 'zod'

// ================= LOGIN =================
export const loginSchema = z.object({
  email: zEmailRequired,
  password: zPasswordRequired,
})

// Schemă Zod pentru validarea parolei
export const passwordSchema = z.object({
  password: z.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere.'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Parolele nu se potrivesc.',
  path: ['confirmPassword'], // Atribuim eroarea câmpului de confirmare
})