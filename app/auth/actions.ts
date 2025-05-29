// app/auth/actions.ts
'use server'

import { createClient } from '@/lib/supabase' // Clientul Supabase pentru server
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createLogger } from '@/lib/logger'

const logger = createLogger('AuthActions')

/**
 * Server Action pentru autentificarea utilizatorului cu email și parolă.
 */
export async function signIn(email: string, password: string) {
  logger.info('Attempting user sign-in.', { email })

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    logger.error('Sign-in failed.', { email, error: error.message })
    return { error: error.message }
  }

  if (data.user) {
    logger.info(`User ${data.user.id} (${data.user.email}) signed in successfully.`)
    // Revalidăm calea /admin pentru a asigura că datele de sesiune sunt reîncărcate
    revalidatePath('/admin', 'layout') // Revalidează întregul layout /admin
    return { success: true, user: data.user }
  }

  // Cazul în care nu e eroare, dar nici user. (Nu ar trebui să se întâmple în mod normal)
  logger.warn('Sign-in completed without error but no user data returned.', { email })
  return { error: 'A apărut o eroare necunoscută la autentificare.' }
}

/**
 * Server Action pentru deconectarea utilizatorului.
 */
export async function signOut() {
  logger.info('Attempting user sign-out.')

  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    logger.error('Sign-out failed.', { error: error.message })
    // Nu aruncăm eroarea direct, deoarece poate bloca deconectarea
    return { error: 'Eroare la deconectare: ' + error.message }
  }

  logger.info('User signed out successfully. Redirecting to login.')
  revalidatePath('/', 'layout') // Revalidează întregul layout pentru a elimina sesiunea
  redirect('/login') // Redirecționează utilizatorul la pagina de login
}
