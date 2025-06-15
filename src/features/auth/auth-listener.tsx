// src/features/auth/auth-listener.tsx (Varianta refactorizată)
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
// Pasul 1: Importăm funcția centralizată în loc de clientul Supabase direct.
import { createClient } from '@/lib/supabase-browser'
import { AUTH_EVENTS } from '@/core/domains/auth/auth.constants'

export function AuthListener() {
  const router = useRouter()

  useEffect(() => {
    // Pasul 2: Folosim funcția noastră pentru a crea clientul.
    // Fără variabile de mediu sau logică duplicată.
    const supabase = createClient()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // La orice login sau logout...
      if (event === AUTH_EVENTS.SIGNED_IN || event === AUTH_EVENTS.SIGNED_OUT) {
        // ... facem un refresh la pagină pentru a actualiza componentele de pe server.
        router.refresh()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return null // Componenta nu afișează nimic
}
