// src/app/(dashboard)/admin/stylists/_components/reset-password-button.tsx
'use client'

import React, { useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/button'
import { KeyRound } from 'lucide-react'
import { resetPasswordAction } from '@/features/stylists/actions'

interface ResetPasswordButtonProps {
  email: string
}

// Componentă internă pentru a afișa starea de "pending"
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" variant="outline" size="sm" className="flex items-center gap-1.5" disabled={pending}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
      {pending ? 'Se trimite...' : 'Resetare Parolă'}
    </Button>
  )
}

export function ResetPasswordButton({ email }: ResetPasswordButtonProps) {
  const [state, formAction] = useFormState(resetPasswordAction, { success: false, message: '' })

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success('Succes!', { description: state.message })
      } else {
        toast.error('Eroare', { description: state.message })
      }
    }
  }, [state])

  return (
    <form action={formAction}>
      <input type="hidden" name="email" value={email} />
      <SubmitButton />
    </form>
  )
}

// Adaugă componenta Loader2 dacă nu o ai deja
function Loader2(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
