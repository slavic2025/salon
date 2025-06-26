'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createAuthService } from '@/core/domains/auth/auth.service'
import { createProfileRepository } from '@/core/domains/profiles/profile.repository'
import { AUTH_CONSTANTS } from '@/core/domains/auth/auth.constants'
import { handleError, handleValidationError } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import { createSafeAction } from '@/lib/safe-action'
import {
  signInFormSchema,
  signUpFormSchema,
  updatePasswordActionSchema,
  sendPasswordResetFormSchema,
} from '@/core/domains/auth/auth.types'
import type { ActionResponse } from '@/types/actions.types'

/**
 * Funcție ajutătoare care asamblează serviciul de autentificare
 * cu toate dependențele sale, pentru o singură cerere.
 */
async function getAuthService() {
  const supabase = await createClient()
  const profileRepository = createProfileRepository(supabase)
  return createAuthService(supabase, profileRepository)
}

// --- 1. ACȚIUNI CARE FAC REDIRECT (Funcții Standard) ---

/**
 * Acțiune pentru autentificare. La succes, face redirect pe server.
 */
export async function signInAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  // Validarea se face în serviciu
  try {
    const authService = await getAuthService()
    const { redirectPath } = await authService.signIn(rawData)
    // Redirect-ul este efectul final, gestionat de acțiune
    return redirect(redirectPath)
  } catch (error) {
    // --- AICI ESTE MODIFICAREA CHEIE ---
    // Verificăm dacă eroarea este cea de redirectare de la Next.js
    if (error instanceof Error && error.message.includes('NEXT_REDIRECT')) {
      // Dacă da, o re-aruncăm pentru ca Next.js să-și facă treaba.
      throw error
    }
    // Dacă serviciul aruncă o eroare (ex: credențiale invalide), o returnăm la UI
    return handleError(error)
  }
}

/**
 * Acțiune pentru deconectare. La succes, face redirect pe server.
 */
export async function signOutAction(): Promise<ActionResponse> {
  try {
    const authService = await getAuthService()
    await authService.signOut()
    revalidatePath(AUTH_CONSTANTS.PATHS.revalidate.layout(), 'layout')
  } catch (error) {
    return handleError(error, AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SIGN_OUT)
  }
  return redirect(AUTH_CONSTANTS.PATHS.redirect.afterLogout)
}

// --- 2. ACȚIUNI CARE RETURNEAZĂ O STARE LA UI (createSafeAction) ---

/**
 * Acțiune pentru înregistrare, creată cu "fabrica".
 */
export const signUpAction = createSafeAction(
  signUpFormSchema,
  async (input) => {
    const authService = await getAuthService()
    await authService.signUp(input)
    return { message: AUTH_CONSTANTS.MESSAGES.SUCCESS.SIGNED_UP }
  },
  {
    serverErrorMessage: AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SIGN_UP,
  }
)

/**
 * Acțiune pentru actualizarea parolei.
 */
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

/**
 * Acțiune pentru trimiterea email-ului de resetare a parolei.
 */
export const sendPasswordResetEmailAction = createSafeAction(
  sendPasswordResetFormSchema,
  async (input) => {
    const authService = await getAuthService()
    await authService.sendPasswordResetEmail(input)
    return { message: AUTH_CONSTANTS.MESSAGES.SUCCESS.PASSWORD_RESET_SENT }
  },
  {
    serverErrorMessage: AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SEND_RESET_EMAIL,
  }
)
