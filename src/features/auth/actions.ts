// src/features/auth/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ActionResponse } from '@/types/actions.types'
import { formatZodErrors } from '@/lib/form'
import { z } from 'zod'
import { passwordSchema } from './types'
import { PATHS, ROLES } from '@/lib/constants'

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  // Pasul 1: Autentifică utilizatorul
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
    console.error('Login error:', signInError)
    // Returnăm un mesaj de eroare prietenos pentru UI
    return { error: 'Credențiale invalide. Vă rugăm verificați email-ul și parola.' }
  }

  // Pasul 2: După autentificare reușită, preluăm obiectul utilizator
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Pasul 3: Verificăm dacă obiectul utilizator există înainte de a continua
  if (!user) {
    console.error('User object not found after successful sign-in')
    return { error: 'Utilizatorul nu a putut fi verificat după logare. Vă rugăm încercați din nou.' }
  }

  // Pasul 4: Acum că știm sigur că `user` există, putem folosi `user.id` în siguranță
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id) // Acum este garantat un string, fără erori de tipare
    .single()

  if (profileError) {
    console.error('Error fetching profile:', profileError)
    return { error: 'Logare cu succes, dar a apărut o eroare la preluarea rolului.' }
  }

  // Pasul 5: Redirecționăm pe baza rolului folosind constantele definite
  if (profile?.role === ROLES.ADMIN) {
    redirect(PATHS.ADMIN_HOME)
  } else if (profile?.role === ROLES.STYLIST) {
    redirect(PATHS.STYLIST_HOME)
  } else {
    // Pentru orice alt rol sau niciun rol, redirecționăm la pagina principală
    redirect('/')
  }
}

export async function signOut() {
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
    path: ['passwordConfirm'], // Atribuie eroarea câmpului de confirmare
  })

export async function setInitialPasswordAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())

  const validationResult = setPasswordSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { success: false, message: 'Eroare de validare', errors: formatZodErrors(validationResult.error) }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({
    password: validationResult.data.password,
    // AICI ESTE PASUL CRITIC: Actualizăm metadata
    data: { password_set: true },
  })

  if (error) {
    return { success: false, message: error.message }
  }

  // După setarea cu succes a parolei, redirecționăm către dashboard-ul stilistului
  redirect('/dashboard/schedule')
}


export async function updateUserPasswordAction(prevState: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const rawData = Object.fromEntries(formData)
  const validationResult = passwordSchema.safeParse(rawData)

  if (!validationResult.success) {
    // Returnăm prima eroare de validare
    return { error: validationResult.error.errors[0].message }
  }

  const { password } = validationResult.data

  // Clientul de server va prelua sesiunea temporară din cookie-uri
  const supabase = await createClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return { error: 'Sesiune invalidă sau expirată. Te rugăm să accesezi din nou link-ul din email.' }
  }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) {
    return { error: error.message }
  }

  // Marcam parola ca fiind setată în metadata utilizatorului
  await supabase.auth.updateUser({ data: { password_set: true } })

  // Redirecționăm la dashboard după succes
  redirect('/stylist/schedule')
}

export async function sendPasswordResetEmailAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string
    const supabase = await createClient()

    // Trimitem email-ul de resetare a parolei
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/account-setup`,
    })

    if (resetError) {
      console.error('Error sending reset email:', resetError)
      return {
        success: false,
        message: 'Eroare la trimiterea email-ului de resetare',
        errors: {}
      }
    }

    return {
      success: true,
      message: 'Email-ul de resetare a parolei a fost trimis cu succes',
      errors: {}
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      message: 'A apărut o eroare neașteptată',
      errors: {}
    }
  }
}