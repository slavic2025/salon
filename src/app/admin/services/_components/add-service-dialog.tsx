// src/app/admin/services/_components/add-service-dialog.tsx
'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ServiceFormFields } from './service-form-fields'
import { SubmitButton } from '@/components/ui/submit-button'
import { INITIAL_FORM_STATE } from '@/types/actions.types'
import { addServiceAction } from '@/features/services/actions'
import { useActionForm } from '@/hooks/useActionForm'

export function AddServiceDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const { state, formSubmit, isPending } = useActionForm({
    action: addServiceAction,
    initialState: INITIAL_FORM_STATE,
    resetFormRef: formRef,
    onSuccess: () => {
      setTimeout(() => {
        setIsDialogOpen(false)
      }, 1000)
    },
  })

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Adaugă Serviciu Nou</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => isPending && e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Adaugă Serviciu Nou</DialogTitle>
          <DialogDescription>Completează detaliile pentru noul serviciu.</DialogDescription>
        </DialogHeader>
        <form action={formSubmit} ref={formRef} className="grid gap-4 py-4">
          <ServiceFormFields errors={state.errors} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
              Anulează
            </Button>
            <SubmitButton idleText="Adaugă Serviciu" pendingText="Se adaugă..." disabled={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
