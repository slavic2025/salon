'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
// Pasul 1: Importăm "fabrica" de repository, nu instanța
import { createProfileRepository } from '@/core/domains/profiles/profile.repository'
import { AUTH_CONSTANTS } from '@/core/domains/auth/auth.constants'
import { ROLES } from '@/lib/constants'
import type { Profile } from '@/core/domains/profiles/profile.types'

/**
 * Funcție helper care protejează paginile, gestionând logica de autentificare și autorizare.
 * Respectă arhitectura "per-cerere".
 * @returns {Promise<Profile>} Profilul utilizatorului validat.
 */
export async function protectPage(): Promise<Profile> {
  // Creează clientul Supabase specific acestei cereri
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    // Folosim căile din constantele de auth
    redirect(AUTH_CONSTANTS.PATHS.pages.signIn)
  }

  // Verificăm dacă parola a fost setată (dacă e cazul)
  if (user.user_metadata?.password_set === false) {
    redirect(AUTH_CONSTANTS.PATHS.pages.accountSetup)
  }

  // Pasul 2: Creăm o instanță a repository-ului DOAR pentru această cerere
  const profileRepository = createProfileRepository(supabase)

  // Pasul 3: Folosim noua instanță și metoda standardizată `findById`
  const profile = await profileRepository.findById(user.id)

  if (!profile?.role) {
    // Dacă nu există profil sau rol, delogăm utilizatorul forțat
    console.error(`User with ID ${user.id} has no profile or role. Redirecting to login.`)
    redirect(AUTH_CONSTANTS.PATHS.pages.signIn)
  }

  // Logica de autorizare bazată pe rută rămâne aceeași, dar folosește constantele corecte
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  if (profile.role === ROLES.ADMIN && pathname.startsWith(AUTH_CONSTANTS.PATHS.redirect.stylistHome)) {
    redirect(AUTH_CONSTANTS.PATHS.redirect.adminHome)
  }

  if (profile.role === ROLES.STYLIST && pathname.startsWith(AUTH_CONSTANTS.PATHS.redirect.adminHome)) {
    redirect(AUTH_CONSTANTS.PATHS.redirect.stylistHome)
  }

  return profile
}
