// Am eliminat 'use client'. Aceasta este acum o componentă de server.
import { protectPage } from '@/lib/auth-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { SetPasswordForm } from '@/components/organisms/SetPasswordForm'
// Formularul rămâne o componentă de client, ceea ce este corect.

/**
 * Pagina de setare a parolei. Acum este un Server Component "inteligent".
 * Logica de protecție și redirectare este gestionată pe server, înainte de randare.
 */
export default async function AccountSetupPage() {
  // Pasul 1: Protejăm pagina pe server.
  // - Verifică dacă user-ul este logat.
  // - Verifică dacă parola ESTE DEJA setată și face redirect la dashboard dacă da.
  // Trecem `redirectToSetup: false` pentru a activa acest comportament special.
  await protectPage({ isDashboardPage: false })

  // Pasul 2: Dacă garda trece, înseamnă că totul este în regulă și putem randa UI-ul.
  // Nu mai este nevoie de `useEffect`, `useState` sau stări de încărcare.
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Setează-ți Parola</CardTitle>
          <CardDescription>Creează o parolă nouă și sigură pentru contul tău.</CardDescription>
        </CardHeader>
        <CardContent>
          <SetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
