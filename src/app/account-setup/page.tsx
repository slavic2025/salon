// src/app/account-setup/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SetPasswordForm } from './_components/set-password-form'

export default function AccountSetupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Finalizează crearea contului</CardTitle>
          <CardDescription>Setează o parolă sigură pentru a-ți accesa contul de stilist.</CardDescription>
        </CardHeader>
        <CardContent>
          <SetPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
