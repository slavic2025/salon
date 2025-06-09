// src/app/account-setup/_components/set-password-form.tsx
'use client'

import { useActionForm } from '@/hooks/useActionForm'
import { setInitialPasswordAction } from '@/features/auth/actions' // Asigură-te că acțiunea există
import { INITIAL_FORM_STATE } from '@/types/actions.types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { CardFooter } from '@/components/ui/card'

export function SetPasswordForm() {
  // Folosim hook-ul nostru custom pentru a gestiona starea formularului și submit-ul
  const { state, formSubmit, isPending } = useActionForm({
    action: setInitialPasswordAction,
    initialState: INITIAL_FORM_STATE,
  })

  return (
    <form action={formSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="password">Parolă nouă</Label>
        <Input id="password" name="password" type="password" required />
        {state.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="passwordConfirm">Confirmă parola</Label>
        <Input id="passwordConfirm" name="passwordConfirm" type="password" required />
        {state.errors?.passwordConfirm && <p className="text-sm text-destructive">{state.errors.passwordConfirm[0]}</p>}
      </div>

      {/* Afișează erori generale de la server, dacă există */}
      {state.message && !state.success && <p className="text-sm text-destructive text-center">{state.message}</p>}

      <CardFooter className="p-0 pt-2">
        <SubmitButton className="w-full" disabled={isPending} pendingText="Se setează...">
          Setează Parola și Continuă
        </SubmitButton>
      </CardFooter>
    </form>
  )
}
