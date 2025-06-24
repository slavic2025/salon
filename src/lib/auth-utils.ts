'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase-server'
import { createProfileRepository } from '@/core/domains/profiles/profile.repository'
import { AUTH_CONSTANTS } from '@/core/domains/auth/auth.constants'
import { ROLES } from '@/lib/constants'
import type { Profile } from '@/core/domains/profiles/profile.types'

/**
 * Gardă de securitate pentru paginile protejate.
 * Gestionează autentificarea, autorizarea și fluxul de setare a parolei.
 */
export async function protectPage(): Promise<Profile> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Verificarea de bază: trebuie să fii logat
  if (!user) {
    redirect(AUTH_CONSTANTS.PATHS.pages.signIn)
  }

  // --- AICI ESTE LOGICA REFACTORIZATĂ ---
  // 2. Verificăm explicit dacă utilizatorul este un invitat nou.
  // Doar dacă flag-ul este exact `false`, îl trimitem la setup.
  // Pentru admin (unde flag-ul e `undefined`), această condiție va fi falsă.
  if (user.user_metadata?.password_set === false) {
    const headersList = await headers()
    const pathname = headersList.get('x-pathname') || ''
    // Ne asigurăm că nu creăm o buclă de redirectare dacă suntem deja pe pagina corectă.
    if (pathname !== AUTH_CONSTANTS.PATHS.pages.accountSetup) {
      redirect(AUTH_CONSTANTS.PATHS.pages.accountSetup)
    }
  }
  // ------------------------------------

  // 3. Preluăm profilul și verificăm rolul
  const profileRepository = createProfileRepository(supabase)
  const profile = await profileRepository.findById(user.id)

  if (!profile) {
    console.error(`User with ID ${user.id} has no profile. Forcing logout.`)
    await supabase.auth.signOut()
    redirect(AUTH_CONSTANTS.PATHS.pages.signIn)
  }

  // 4. Verificăm autorizarea pe bază de rol (rămâne neschimbat)
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  if (profile.role === ROLES.ADMIN && pathname.startsWith('/stylist')) {
    redirect(AUTH_CONSTANTS.PATHS.redirect.adminHome)
  }

  if (profile.role === ROLES.STYLIST && pathname.startsWith('/admin')) {
    redirect(AUTH_CONSTANTS.PATHS.redirect.stylistHome)
  }

  // Dacă toate verificările trec, returnăm profilul
  return profile
}
