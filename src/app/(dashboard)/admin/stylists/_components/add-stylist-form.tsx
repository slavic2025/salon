// src/app/(dashboard)/admin/stylists/_components/add-stylist-form.tsx
'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { INITIAL_FORM_STATE } from '@/types/actions.types'
import { addStylistAction } from '@/features/stylists/actions'
import { useActionForm } from '@/hooks/useActionForm'
import { StylistFormFields } from './stylist-form-fields'
import { ActionResponse } from '@/types/actions.types'

interface AddStylistFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function AddStylistForm({ onSuccess, onCancel }: AddStylistFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const { state, formSubmit, isPending } = useActionForm<ActionResponse, FormData>({
    action: addStylistAction,
    initialState: INITIAL_FORM_STATE,
    resetFormRef: formRef,
    onSuccess: () => {
      // Așteptăm puțin pentru ca utilizatorul să vadă toast-ul de succes, apoi apelăm callback-ul
      setTimeout(() => {
        onSuccess()
      }, 1000)
    },
  })

  return (
    <form action={formSubmit} ref={formRef} className="grid gap-4 py-4">
      <StylistFormFields errors={state.errors} />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Anulează
        </Button>
        <SubmitButton idleText="Adaugă Stilist" pendingText="Se adaugă..." disabled={isPending} />
      </DialogFooter>
    </form>
  )
}
