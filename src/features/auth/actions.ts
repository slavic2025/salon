// src/features/auth/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ActionResponse } from '@/types/actions.types'
import { formatZodErrors } from '@/lib/form'
import { z } from 'zod'

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

  // Pasul 5: Redirecționăm pe baza rolului
  if (profile?.role === 'admin') {
    redirect('/admin') // Adminul merge la dashboard-ul general de admin
  } else if (profile?.role === 'stylist') {
    redirect('/dashboard/schedule') // Stilistul merge direct la programul său
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
