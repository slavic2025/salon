'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createAuthService } from '@/core/domains/auth/auth.service'
import { createProfileRepository } from '@/core/domains/profiles/profile.repository'
import { AUTH_CONSTANTS } from '@/core/domains/auth/auth.constants'
import { handleError } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import type { ActionResponse } from '@/types/actions.types'
import { createSafeAction } from '@/lib/safe-action'
import { signInFormSchema, signUpFormSchema, updatePasswordActionSchema } from '@/core/domains/auth/auth.types'

/**
 * Funcție ajutătoare care asamblează serviciul de autentificare
 * cu toate dependențele sale (client supabase, repository), pentru o singură cerere.
 */
async function getAuthService() {
  const supabase = await createClient()
  const profileRepository = createProfileRepository(supabase)
  // Injectăm dependențele în serviciu
  return createAuthService(supabase, profileRepository)
}

/**
 * Acțiune pentru autentificare.
 */
export const signInAction = createSafeAction(signInFormSchema, async (input) => {
  // Aici scriem doar logica de business pură
  const authService = await getAuthService()
  const result = await authService.signIn(input)

  // La succes, "fabrica" va împacheta acest rezultat în { success: true, data: result }
  return result
})

export const signUpAction = createSafeAction(
  signUpFormSchema,
  async (input) => {
    // Aici rămâne doar logica de business pură
    const authService = await getAuthService()
    await authService.signUp(input)

    // La succes, poți returna un mesaj customizat care va fi adăugat la `data`
    return { successMessage: AUTH_CONSTANTS.MESSAGES.SUCCESS.SIGNED_UP }
  },
  {
    // Aici pasăm mesajul de eroare specific pentru această acțiune
    serverErrorMessage: AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SIGN_UP,
  }
)

/**
 * Acțiune pentru deconectare.
 */
export async function signOutAction(): Promise<ActionResponse> {
  try {
    const authService = await getAuthService()
    await authService.signOut()

    revalidatePath(AUTH_CONSTANTS.PATHS.revalidate.layout(), 'layout')
  } catch (error) {
    return handleError(error, AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SIGN_OUT)
  }

  // După logout, facem redirect către pagina principală.
  return redirect(AUTH_CONSTANTS.PATHS.redirect.afterLogout)
}

// export const sendPasswordResetEmailAction = createSafeAction(
//   sendPasswordResetSchema,
//   async (input) => {
//     const authService = await getAuthService()
//     await authService.sendPasswordResetEmail(input)
//     return { message: AUTH_CONSTANTS.MESSAGES.SUCCESS.PASSWORD_RESET_SENT }
//   },
//   {
//     serverErrorMessage: AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SEND_RESET_EMAIL,
//   }
// )

export const updatePasswordAction = createSafeAction(
  updatePasswordActionSchema,
  async (input) => {
    const authService = await getAuthService()
    await authService.updatePassword(input)
    return { message: AUTH_CONSTANTS.MESSAGES.SUCCESS.PASSWORD_UPDATED }
  },
  {
    serverErrorMessage: AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.UPDATE_PASSWORD,
  }
)
