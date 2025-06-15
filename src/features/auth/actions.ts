// src/features/auth/actions.ts (Varianta finală, refactorizată)
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ZodSchema } from 'zod'
import { AuthService } from '@/core/domains/auth/auth.service'
import { signInSchema, signUpSchema, resetPasswordSchema, setPasswordSchema } from '@/core/domains/auth/auth.types'
import { AUTH_MESSAGES, AUTH_PATHS } from '@/core/domains/auth/auth.constants'
import { handleError, handleValidationError } from '@/lib/action-helpers'
import { buildFormAction, validateAndExecute } from '@/lib/action-builder'
import { ActionResponse } from '@/types/actions.types'

const authService = new AuthService()

/**
 * Acțiuni simple, perfecte pentru action-builder
 */
export const signInAction = buildFormAction(signInSchema, async (data) => {
  await authService.signIn(data)
  return { message: AUTH_MESSAGES.SUCCESS.SIGNED_IN }
})

export const signUpAction = buildFormAction(signUpSchema, async (data) => {
  await authService.signUp(data)
  return { message: AUTH_MESSAGES.SUCCESS.SIGNED_UP }
})

export const resetPasswordAction = buildFormAction(resetPasswordSchema, async (data) => {
  await authService.resetPassword(data)
  return { message: AUTH_MESSAGES.SUCCESS.PASSWORD_RESET_SENT }
})

/**
 * Acțiune simplă fără formular, acum consistentă
 */
export async function signOutAction(): Promise<ActionResponse> {
  try {
    await authService.signOut()
    // Revalidăm întregul layout, deoarece starea de autentificare s-a schimbat
    revalidatePath(AUTH_PATHS.revalidate.layout(), 'layout')
    return { success: true, message: AUTH_MESSAGES.SUCCESS.SIGNED_OUT }
  } catch (error) {
    return handleError(error, AUTH_MESSAGES.ERROR.SERVER.SIGN_OUT)
  }
}

/**
 * Acțiuni cu redirect, acum folosind helper-ul pentru a elimina repetiția
 */
export async function setInitialPasswordAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const result = await validateAndExecute(formData, setPasswordSchema, (data) => authService.setInitialPassword(data))

  if (!result.success) return result

  redirect(AUTH_PATHS.redirect.stylist.schedule)
}

export async function updateUserPasswordAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const result = await validateAndExecute(formData, setPasswordSchema, (data) => authService.updatePassword(data))

  if (!result.success) return result

  redirect(AUTH_PATHS.redirect.stylist.schedule)
}
