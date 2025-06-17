import { createLogger } from '@/lib/logger'
import { AppError } from '@/lib/errors'
import { AUTH_CONSTANTS } from './auth.constants'
import { createProfileRepository } from '../profiles/profile.repository'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  type SignInInput,
  type SignUpInput,
  type SetPasswordInput,
  type SignInResult,
  signInSchema,
  signUpSchema,
  sendPasswordResetSchema,
  setPasswordSchema,
} from './auth.types'
import { ROLES } from '@/lib/constants'

// Definirea tipurilor pentru dependențe
type ProfileRepository = ReturnType<typeof createProfileRepository>

/**
 * Factory Function care creează serviciul de autentificare.
 * @param supabase - Instanța clientului Supabase.
 * @param profileRepository - Repository-ul pentru gestionarea datelor de profil.
 */
export function createAuthService(supabase: SupabaseClient, profileRepository: ProfileRepository) {
  const logger = createLogger('AuthService')

  return {
    /** Gestionează procesul de autentificare, orchestrând apelurile. */
    async signIn(input: Record<string, unknown>): Promise<SignInResult> {
      const validatedData = signInSchema.parse(input)
      const { error: signInError } = await supabase.auth.signInWithPassword(validatedData)
      if (signInError) {
        throw new AppError(AUTH_CONSTANTS.MESSAGES.ERROR.CREDENTIALS.INVALID, signInError)
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        throw new AppError(AUTH_CONSTANTS.MESSAGES.ERROR.CREDENTIALS.INVALID_SESSION)
      }

      // Folosim ProfileRepository pentru a prelua rolul, respectând arhitectura
      const profile = await profileRepository.findById(user.id)
      if (!profile) {
        throw new AppError(AUTH_CONSTANTS.MESSAGES.ERROR.AUTHORIZATION.PROFILE_NOT_FOUND)
      }

      // Stabilim o cale implicită în cazul în care utilizatorul nu are un rol special
      let redirectPath: string = AUTH_CONSTANTS.PATHS.redirect.afterLogin

      // Suprascriem calea dacă utilizatorul are un rol specific
      if (profile.role === ROLES.ADMIN) {
        redirectPath = AUTH_CONSTANTS.PATHS.redirect.adminHome
      } else if (profile.role === ROLES.STYLIST) {
        redirectPath = AUTH_CONSTANTS.PATHS.redirect.stylistHome
      }

      return { user, role: profile.role, redirectPath }
    },

    /** Gestionează înregistrarea unui utilizator nou. */
    async signUp(input: Record<string, unknown>): Promise<void> {
      const validatedData = signUpSchema.parse(input)
      const { error } = await supabase.auth.signUp(validatedData)
      if (error) throw new AppError(AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SIGN_UP, error)
    },

    /** Gestionează deconectarea. */
    async signOut(): Promise<void> {
      const { error } = await supabase.auth.signOut()
      if (error) throw new AppError(AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SIGN_OUT, error)
    },

    /** Actualizează parola unui utilizator autentificat. */
    async updatePassword(input: Record<string, unknown>): Promise<void> {
      try {
        const validatedData = setPasswordSchema.parse(input)
        const { error } = await supabase.auth.updateUser({ password: validatedData.password })
        if (error) {
          throw new AppError(AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.UPDATE_PASSWORD, error)
        }
      } catch (error) {
        logger.error('Update password failed', { error })
        if (error instanceof AppError) throw error
        throw new AppError(AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.UPDATE_PASSWORD, error)
      }
    },

    /** Trimite email-ul de resetare a parolei. */
    async sendPasswordResetEmail(input: Record<string, unknown>): Promise<void> {
      const { email } = sendPasswordResetSchema.parse(input)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}${AUTH_CONSTANTS.PATHS.pages.updatePassword}`,
      })
      if (error) throw new AppError(AUTH_CONSTANTS.MESSAGES.ERROR.SERVER.SEND_RESET_EMAIL, error)
    },
  }
}
