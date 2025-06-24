import { z } from 'zod'
import { User } from '@supabase/supabase-js'
import { zEmailRequired, zPasswordRequired } from '@/config/validation/fields'

// --- A. Scheme de Validare pentru Formularele din UI ---

/**
 * Schema folosită de formularul de login de pe client.
 */
export const signInFormSchema = z.object({
  email: zEmailRequired,
  password: zPasswordRequired,
})

/**
 * Schema folosită de formularul de înregistrare, cu validare pentru potrivirea parolelor.
 */
export const signUpFormSchema = z
  .object({
    email: zEmailRequired,
    password: zPasswordRequired,
    confirmPassword: z.string(), // Câmpul de confirmare
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parolele nu se potrivesc.',
    path: ['confirmPassword'], // Atribuim eroarea câmpului de confirmare
  })

/**
 * Schema folosită de formularul de setare/resetare a parolei, cu validare de potrivire.
 */
export const setPasswordFormSchema = z
  .object({
    password: zPasswordRequired,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Parolele nu se potrivesc.',
    path: ['confirmPassword'],
  })

/**
 * Schema folosită de formularul "Am uitat parola" care trimite email-ul de resetare.
 */
export const sendPasswordResetFormSchema = z.object({
  email: zEmailRequired,
})

// --- B. Scheme de Validare pentru Acțiunile de pe Server ---
// Acestea validează doar datele pe care serverul le primește efectiv.

/**
 * Schema pentru acțiunea de update a parolei. Primește doar parola finală.
 */
export const updatePasswordActionSchema = z.object({
  password: zPasswordRequired,
})

// --- C. Tipuri TypeScript Derivate ---

// Tipuri pentru datele de INTRARE în formulare (ce gestionează react-hook-form)
export type SignInFormInput = z.infer<typeof signInFormSchema>
export type SignUpFormInput = z.infer<typeof signUpFormSchema>
export type SetPasswordFormInput = z.infer<typeof setPasswordFormSchema>
export type SendPasswordResetFormInput = z.infer<typeof sendPasswordResetFormSchema>

// Tipuri pentru PAYLOAD-ul acțiunilor de pe server
export type UpdatePasswordActionInput = z.infer<typeof updatePasswordActionSchema>

// Tip custom pentru rezultatul de succes al acțiunii de signIn
export type SignInResult = {
  user: User
  role: string | null
  redirectPath: string
}
