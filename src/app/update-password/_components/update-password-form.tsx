// src/app/update-password/_components/update-password-form.tsx
'use client'

import { useEffect } from 'react'
import { useActionState } from 'react'
import { toast } from 'sonner'
import { Label } from '@/components/atoms/label'
import { Input } from '@/components/atoms/input'
import { SubmitButton } from '@/components/molecules/submit-button'
import { updateUserPasswordAction } from '@/features/auth/actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/atoms/alert'
import { Terminal } from 'lucide-react'
import { ActionResponse } from '@/types/actions.types'

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updateUserPasswordAction, { success: false, message: '' })

  useEffect(() => {
    if (!state.success && state.message) {
      toast.error('Eroare la salvare', { description: state.message })
    }
  }, [state])

  return (
    <form action={formAction} className="space-y-4">
      {!state.success && state.message && (
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Eroare</AlertTitle>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="password">Parola nouă</Label>
        <Input id="password" name="password" type="password" required minLength={6} autoComplete="new-password" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmă parola</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" />
      </div>
      <SubmitButton className="w-full" />
    </form>
  )
}
