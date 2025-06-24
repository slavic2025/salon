'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { AUTH_CONSTANTS } from '@/core/domains/auth/auth.constants' // Importăm constantele pentru căi

/**
 * O componentă "inteligentă" care ascultă schimbările de stare a autentificării
 * și redirecționează utilizatorul în funcție de context.
 */
export function AuthListener() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Când un utilizator se autentifică (inclusiv la acceptarea unei invitații)
      if (event === 'SIGNED_IN' && session) {
        // --- AICI ESTE LOGICA NOUĂ ---
        // Verificăm flag-ul pe care l-am setat la crearea stilistului
        if (session.user.user_metadata?.password_set === false) {
          // Dacă parola nu este setată, forțăm redirectarea către pagina de setup
          console.log('[AuthListener] New user detected. Redirecting to /account-setup...')
          router.push(AUTH_CONSTANTS.PATHS.pages.accountSetup)
        } else {
          // Pentru un login normal, un refresh este suficient pentru a actualiza UI-ul
          console.log('[AuthListener] Existing user signed in. Refreshing page...')
          router.refresh()
        }
      }

      // La logout, facem refresh pentru a curăța UI-ul și a reseta starea de pe server
      if (event === 'SIGNED_OUT') {
        console.log('[AuthListener] User signed out. Refreshing page...')
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return null // Componenta nu afișează nimic
}
