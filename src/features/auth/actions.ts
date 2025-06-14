// src/features/auth/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ActionResponse } from '@/types/actions.types'
import { z } from 'zod'
import { passwordSchema } from './types'
import { PATHS, ROLES } from '@/lib/constants'
import { handleValidationError, handleServerError } from '../common/utils'

/**
 * Acțiune pentru autentificare
 */
export async function signInAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    return { success: false, message: 'Credențiale invalide. Vă rugăm verificați email-ul și parola.' }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, message: 'Utilizatorul nu a putut fi verificat după logare. Vă rugăm încercați din nou.' }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return { success: false, message: 'Logare cu succes, dar a apărut o eroare la preluarea rolului.' }
  }

  if (profile?.role === ROLES.ADMIN) {
    redirect(PATHS.ADMIN_HOME)
  } else if (profile?.role === ROLES.STYLIST) {
    redirect(PATHS.STYLIST_HOME)
  } else {
    redirect('/')
  }
  return { success: true, message: 'Autentificare reușită' }
}

/**
 * Acțiune pentru delogare
 */
export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

// Schema de validare pentru formularul de setare a parolei
const setPasswordSchema = z
  .object({
    password: z.string().min(6, 'Parola trebuie să conțină cel puțin 6 caractere.'),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Parolele nu se potrivesc.',
    path: ['passwordConfirm'],
  })

/**
 * Acțiune pentru setarea parolei inițiale
 */
export async function setInitialPasswordAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())
  const validationResult = setPasswordSchema.safeParse(rawData)
  if (!validationResult.success) {
    return handleValidationError(validationResult.error, 'Eroare de validare')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: validationResult.data.password,
    data: { password_set: true },
  })

  if (error) {
    return handleServerError(error, 'Eroare la setarea parolei')
  }

  redirect('/dashboard/schedule')
}

/**
 * Acțiune pentru actualizarea parolei utilizatorului
 */
export async function updateUserPasswordAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData)
  const validationResult = passwordSchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error, 'Eroare de validare')
  }

  const { password } = validationResult.data
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    return { success: false, message: 'Sesiune invalidă sau expirată. Te rugăm să accesezi din nou link-ul din email.' }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return handleServerError(error, 'Eroare la actualizarea parolei')
  }

  await supabase.auth.updateUser({ data: { password_set: true } })
  redirect('/stylist/schedule')
}

/**
 * Acțiune pentru trimiterea email-ului de resetare a parolei
 */
export async function sendPasswordResetEmailAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const email = formData.get('email') as string
    const supabase = await createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/account-setup`,
    })
    if (resetError) {
      return handleServerError(resetError, 'Eroare la trimiterea email-ului de resetare')
    }
    return { success: true, message: 'Email-ul de resetare a parolei a fost trimis cu succes' }
  } catch (error) {
    return handleServerError(error, 'A apărut o eroare neașteptată')
  }
}
