// src/app/auth/confirm/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Loader2 } from 'lucide-react'

export default function AuthConfirmPage() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Definim o funcție async în interiorul useEffect pentru a putea folosi await
    const processAuthFragment = async () => {
      // Asigurăm că acest cod rulează doar în browser
      if (typeof window !== 'undefined') {
        const hash = window.location.hash

        // Verificăm dacă URL-ul conține token-ul de acces
        if (hash.includes('access_token')) {
          console.log('[AuthConfirm] Fragment de autentificare găsit în URL.')

          const params = new URLSearchParams(hash.substring(1)) // Eliminăm '#' de la început
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')

          if (accessToken && refreshToken) {
            console.log('[AuthConfirm] Token-uri extrase. Se încearcă setarea sesiunii...')

            // Setăm manual sesiunea în clientul Supabase folosind token-urile din URL
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (sessionError) {
              console.error('Eroare la setarea sesiunii:', sessionError)
              router.push('/login') // Redirectare la login în caz de eroare
              return
            }

            console.log('[AuthConfirm] Sesiune setată cu succes. Se preia utilizatorul...')
            // După ce sesiunea este setată, preluăm datele proaspete ale utilizatorului
            const {
              data: { user },
            } = await supabase.auth.getUser()

            if (user) {
              console.log('[AuthConfirm] Utilizator preluat. Metadata:', user.user_metadata)

              // Acum facem redirectarea finală pe baza metadata
              if (user.user_metadata?.password_set === false) {
                router.push('/account-setup')
              } else {
                router.push('/dashboard/schedule') // Sau altă pagină default
              }
            } else {
              console.error('[AuthConfirm] Utilizatorul nu a fost găsit după setarea sesiunii.')
              router.push('/login')
            }
          }
        }
      }
    }

    processAuthFragment()
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Se finalizează autentificarea...</p>
    </div>
  )
}
