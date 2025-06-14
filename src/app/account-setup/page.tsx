// src/app/account-setup/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SetPasswordForm } from './_components/set-password-form'

export default function AccountSetupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isReset = searchParams.get('reset') === 'true'
  const supabase = createClient()
  const [status, setStatus] = useState('Se verifică sesiunea...')

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        console.log('Account setup - Current session:', session)
        
        if (error) {
          console.error('Session error:', error)
          setStatus('Eroare la verificarea sesiunii. Se redirecționează...')
          window.location.href = '/login?error=session_error'
          return
        }

        if (!session) {
          console.log('No session found')
          setStatus('Sesiunea lipsește. Se redirecționează...')
          window.location.href = '/login?error=session_missing'
          return
        }

        // Dacă nu este o resetare de parolă și utilizatorul are deja parola setată,
        // îl redirecționăm la dashboard
        if (!isReset && session.user.user_metadata.password_set) {
          console.log('Password already set, redirecting to dashboard')
          window.location.href = '/stylist/schedule'
          return
        }

        setStatus('')
      } catch (error) {
        console.error('Unexpected error:', error)
        setStatus('A apărut o eroare neașteptată. Se redirecționează...')
        window.location.href = '/login?error=unexpected'
      }
    }

    checkSession()
  }, [router, supabase, isReset])

  if (status) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg">{status}</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">
        {isReset ? 'Resetează Parola' : 'Setează Parola'}
      </h1>
      <SetPasswordForm />
    </div>
  )
}
