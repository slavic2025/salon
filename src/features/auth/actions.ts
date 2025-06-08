// src/features/auth/actions.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'

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
