// src/app/update-password/_components/update-password-form.tsx
'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { updateUserPasswordAction } from '@/features/auth/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Terminal } from 'lucide-react'

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updateUserPasswordAction, { error: undefined })

  useEffect(() => {
    if (state?.error) {
      toast.error('Eroare la salvare', { description: state.error })
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Eroare</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">Parola nouă</Label>
        <Input id="password" name="password" type="password" required minLength={6} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmă parola</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
      </div>
      <SubmitButton className="w-full" />
    </form>
  )
}