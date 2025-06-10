// src/lib/auth-utils.ts
'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { userRepository } from '@/core/domains/users/user.repository'
import type { UserProfile } from '@/core/domains/users/user.types'
import { PATHS, ROLES } from '@/lib/constants'

/**
 * Funcție helper care gestionează toată logica de autentificare și autorizare.
 * Verifică sesiunea, parola setată și rolul utilizatorului.
 * Redirecționează dacă este necesar.
 * @returns {Promise<UserProfile>} Profilul utilizatorului validat.
 */
export async function protectPage(): Promise<UserProfile> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect(PATHS.LOGIN)
  }

  if (user.user_metadata?.password_set === false) {
    redirect(PATHS.ACCOUNT_SETUP)
  }

  const userProfile = await userRepository.fetchProfileById(user.id)
  if (!userProfile?.role) {
    console.error(`User with ID ${user.id} has no profile or role. Logging out.`)
    redirect(PATHS.LOGIN)
  }

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  if (userProfile.role === ROLES.ADMIN && pathname.startsWith(PATHS.STYLIST_ROOT)) {
    redirect(PATHS.ADMIN_HOME)
  }

  if (userProfile.role === ROLES.STYLIST && pathname.startsWith(PATHS.ADMIN_HOME)) {
    redirect(PATHS.STYLIST_HOME)
  }

  return userProfile
}
