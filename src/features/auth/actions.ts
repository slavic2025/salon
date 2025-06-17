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
export async function signInAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const authService = await getAuthService()
    const { redirectPath } = await authService.signIn(rawData)

    // Redirect-ul este acum gestionat aici, în acțiune.
    return redirect(redirectPath)
  } catch (error) {
    // Serviciul aruncă erori (inclusiv de validare), iar acțiunea le prinde
    // și le formatează pentru UI.
    return handleError(error, AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SIGN_IN)
  }
}

/**
 * Acțiune pentru înregistrare.
 */
export async function signUpAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const authService = await getAuthService()
    await authService.signUp(rawData)

    // La înregistrare, de obicei nu facem redirect, ci afișăm un mesaj de succes.
    return { success: true, message: AUTH_CONSTANTS.MESSAGES.SUCCESS.SIGNED_UP }
  } catch (error) {
    return handleError(error, AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SIGN_UP)
  }
}

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

/**
 * Acțiune pentru trimiterea email-ului de resetare a parolei.
 */
export async function sendPasswordResetEmailAction(
  prevState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const authService = await getAuthService()
    await authService.sendPasswordResetEmail(rawData)
    return { success: true, message: AUTH_CONSTANTS.MESSAGES.SUCCESS.PASSWORD_RESET_SENT }
  } catch (error) {
    return handleError(error, AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SEND_RESET_EMAIL)
  }
}

/**
 * Acțiune pentru actualizarea parolei (când utilizatorul este deja logat).
 */
export async function updatePasswordAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const authService = await getAuthService()
    await authService.updatePassword(rawData)
    return { success: true, message: AUTH_CONSTANTS.MESSAGES.SUCCESS.PASSWORD_UPDATED }
  } catch (error) {
    return handleError(error, AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.UPDATE_PASSWORD)
  }
}
