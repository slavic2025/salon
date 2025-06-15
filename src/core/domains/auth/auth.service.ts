import { createClient } from '@/lib/supabase-server'
import { SignInInput, SignUpInput, ResetPasswordInput } from './auth.types'
import { AUTH_MESSAGES } from './auth.constants'
import { PATHS, ROLES } from '@/lib/constants'
import { SetPasswordInput } from './auth.types'

export class AuthService {
  async signIn(data: SignInInput) {
    const supabase = await createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword(data)
    if (signInError) {
      return { success: false, message: AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS }
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, message: AUTH_MESSAGES.ERROR.USER_VERIFICATION_FAILED }
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return { success: false, message: AUTH_MESSAGES.ERROR.ROLE_FETCH_FAILED }
    }

    let redirectPath = '/'
    if (profile?.role === ROLES.ADMIN) {
      redirectPath = PATHS.ADMIN_HOME
    } else if (profile?.role === ROLES.STYLIST) {
      redirectPath = PATHS.STYLIST_HOME
    }

    return { success: true, user, role: profile.role, redirectPath }
  }

  async signUp(data: SignUpInput) {
    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })
    if (error) throw error
  }

  async resetPassword(data: ResetPasswordInput) {
    const supabase = await createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(data.email)
    if (error) throw error
    return { success: true }
  }

  async signOut(): Promise<void> {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }

  async setInitialPassword(data: SetPasswordInput) {
    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
      // Extragem parola din obiectul `data` aici, în interiorul serviciului
      password: data.password,
      data: { password_set: true },
    })

    if (error) {
      throw error
    }
  }

  async updatePassword(data: SetPasswordInput): Promise<void> {
    const supabase = await createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      throw new Error('Sesiune invalidă sau expirată. Te rugăm să accesezi din nou link-ul din email.')
    }

    const { error } = await supabase.auth.updateUser({ password })
    if (error) throw error

    await supabase.auth.updateUser({ data: { password_set: true } })
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    const supabase = await createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/account-setup`,
    })
    if (resetError) throw resetError
  }
}
