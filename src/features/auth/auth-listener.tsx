// src/components/features/auth/auth-listener.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export function AuthListener() {
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      // La orice login sau logout...
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
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
