// src/app/auth/confirm/page.tsx
'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Loader2 } from 'lucide-react'
import { PATHS } from '@/lib/constants'

export default function AuthConfirmPage() {
  const router = useRouter()

  const processAuth = useCallback(async () => {
    // Ne asigurăm că acest cod rulează doar în browser
    if (typeof window === 'undefined') {
      return
    }

    const supabase = createClient()
    const hash = window.location.hash

    // Verificăm dacă URL-ul conține token-ul de acces
    if (hash.includes('access_token') && hash.includes('refresh_token')) {
      console.log('[AuthConfirm] Fragment de autentificare găsit. Se procesează...')

      const params = new URLSearchParams(hash.substring(1)) // Eliminăm '#'
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')

      if (!accessToken || !refreshToken) {
        console.error('[AuthConfirm] Token-uri lipsă în fragmentul URL.')
        router.push('/login?error=token_missing')
        return
      }

      // --- PASUL CHEIE: Setăm manual sesiunea în clientul Supabase ---
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (sessionError) {
        console.error('[AuthConfirm] Eroare la setarea sesiunii:', sessionError.message)
        router.push(`/login?error=${sessionError.message}`)
        return
      }

      console.log('[AuthConfirm] Sesiune setată cu succes. Se preia utilizatorul...')
      
      // După ce sesiunea este setată, preluăm datele proaspete ale utilizatorului
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        console.log('[AuthConfirm] Utilizator preluat. Metadata:', user.user_metadata)

        // Acum facem redirectarea finală pe baza metadata, lăsând layout-ul principal să decidă.
        // Orice pagină protejată este bună, ex: /stylist/schedule
        // Layout-ul va verifica 'password_set' și va redirecționa la /account-setup dacă este cazul.
        router.push(PATHS.STYLIST_HOME)
      } else {
        console.error('[AuthConfirm] Utilizatorul nu a fost găsit după setarea sesiunii.')
        router.push('/login?error=user_not_found')
      }
    } else {
      console.warn('[AuthConfirm] Nu s-a găsit niciun fragment de autentificare în URL. Se redirecționează la login.')
      router.push('/login')
    }
  }, [router])


  useEffect(() => {
    processAuth()
  }, [processAuth])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
        <p className="mt-4 text-muted-foreground">Se finalizează autentificarea...</p>
      </div>
    </div>
  )
}