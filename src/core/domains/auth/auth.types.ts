import { zEmailRequired, zPasswordRequired } from '@/config/validation/fields'
import { z } from 'zod'
import { User } from '@supabase/supabase-js'

// Schema pentru autentificare
export const signInSchema = z.object({
  email: zEmailRequired,
  password: zPasswordRequired,
})

// Schema pentru înregistrare
export const signUpSchema = z
  .object({
    email: zEmailRequired,
    password: zPasswordRequired,
    confirmPassword: zPasswordRequired,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parolele nu se potrivesc.',
    path: ['confirmPassword'],
  })

// Schema pentru resetarea parolei
export const resetPasswordSchema = z.object({
  email: zEmailRequired,
})

// Schema pentru setarea parolei
export const setPasswordSchema = z
  .object({
    password: zPasswordRequired,
    confirmPassword: zPasswordRequired,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parolele nu se potrivesc.',
    path: ['confirmPassword'],
  })

export const sendPasswordResetSchema = z.object({
  email: z.string().email('Adresa de email este invalidă.'),
})

export type SignInResult = {
  user: User
  role: string | null
  redirectPath: string
}
// Tipuri derivate din scheme
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type SetPasswordInput = z.infer<typeof setPasswordSchema>
