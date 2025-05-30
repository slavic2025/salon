'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import React from 'react' // Asigură-te că React este importat

// Extinderea tipurilor de prop-uri ale componentei Button de la shadcn/ui
// Aceasta va include toate prop-urile standard ale unui buton HTML, plus prop-urile specifice shadcn/ui (variant, size etc.)
interface SubmitButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children: React.ReactNode
}

// Actualizează semnătura funcției SubmitButton pentru a folosi noile prop-uri
export function SubmitButton({ children, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    // Transmite toate prop-urile rămase (inclusiv variant, size etc.) către componenta Button
    <Button type="submit" aria-disabled={pending} disabled={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Se procesează...
        </>
      ) : (
        children
      )}
    </Button>
  )
}
