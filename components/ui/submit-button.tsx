// components/ui/submit-button.tsx
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import React from 'react'

// Extinderea tipurilor de prop-uri ale componentei Button de la shadcn/ui
// Aceasta va include toate prop-urile standard ale unui buton HTML, plus prop-urile specifice shadcn/ui (variant, size etc.)
// Folosim React.ComponentPropsWithoutRef<typeof Button> pentru a ne asigura că transmitem toate prop-urile
// relevante pe care un buton shadcn/ui le-ar accepta.
interface SubmitButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  // children devine opțional, deoarece putem avea un text default
  children?: React.ReactNode
  // Prop-uri pentru texte personalizate
  idleText?: string
  pendingText?: string
}

export function SubmitButton({
  children,
  idleText = 'Salvează', // Textul implicit când nu este în pending
  pendingText = 'Se procesează...', // Textul implicit când este în pending
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  // Log pentru depanare - opțional, elimină în producție
  console.log(`[${Date.now()}] SubmitButton: Component re-rendered. Pending: ${pending}`)

  return (
    // Transmite toate prop-urile rămase (inclusiv variant, size etc.) către componenta Button
    <Button type="submit" aria-disabled={pending} disabled={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText} {/* Afișează textul customizabil pentru pending */}
        </>
      ) : (
        children || idleText // Dacă children există, îl afișează, altfel folosește idleText
      )}
    </Button>
  )
}
