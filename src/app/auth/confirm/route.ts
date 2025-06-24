import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

// Această funcție rulează pe server și gestionează link-urile de confirmare/invitație
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  // `next` este calea unde vrem să ajungă utilizatorul după confirmare
  const next = searchParams.get('next') ?? '/'

  // Dacă nu avem token sau tip, este o eroare
  if (!token_hash || !type) {
    const errorUrl = new URL('/login', request.url)
    errorUrl.searchParams.set('error', 'Link de confirmare invalid sau expirat.')
    return NextResponse.redirect(errorUrl)
  }

  const supabase = await createClient()

  // Schimbăm token-ul pe o sesiune validă
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  // Dacă nu există eroare, sesiunea a fost creată și cookie-urile au fost setate.
  // Facem redirect la pagina specificată în `next` (ex: /account-setup).
  if (!error) {
    const redirectUrl = new URL(next, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Dacă token-ul este invalid sau expirat, trimitem la o pagină de eroare
  console.error('[AuthConfirmRoute] Error verifying OTP:', error.message)
  const errorUrl = new URL('/login', request.url)
  errorUrl.searchParams.set('error', 'Link-ul de confirmare este invalid sau a expirat.')
  return NextResponse.redirect(errorUrl)
}
