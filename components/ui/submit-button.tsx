// components/ui/submit-button.tsx
'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { createLogger } from '@/lib/logger'

const logger = createLogger('SubmitButton')

interface SubmitButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  children?: React.ReactNode
  idleText?: string
  pendingText?: string
}

export function SubmitButton({
  children,
  idleText = 'Salvează',
  pendingText = 'Se procesează...',
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  useEffect(() => {
    logger.debug(`SubmitButton pending state changed: ${pending}`)
  }, [pending])

  return (
    <Button type="submit" aria-disabled={pending} disabled={pending} {...props}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children || idleText
      )}
    </Button>
  )
}
