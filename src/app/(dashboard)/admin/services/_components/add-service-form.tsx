// src/app/(dashboard)/admin/services/_components/add-service-form.tsx
'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { INITIAL_FORM_STATE } from '@/types/actions.types'
import { addServiceAction } from '@/features/services/actions'
import { useActionForm } from '@/hooks/useActionForm'
import { ServiceFormFields } from './service-form-fields'
import { ActionResponse } from '@/types/actions.types'

interface AddServiceFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function AddServiceForm({ onSuccess, onCancel }: AddServiceFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const { state, formSubmit, isPending } = useActionForm<ActionResponse, FormData>({
    action: addServiceAction,
    initialState: INITIAL_FORM_STATE,
    resetFormRef: formRef,
    onSuccess: () => {
      setTimeout(() => {
        onSuccess()
      }, 1000)
    },
  })

  return (
    <form action={formSubmit} ref={formRef} className="grid gap-4 py-4">
      <ServiceFormFields errors={state.errors} />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Anulează
        </Button>
        <SubmitButton idleText="Adaugă Serviciu" pendingText="Se adaugă..." disabled={isPending} />
      </DialogFooter>
    </form>
  )
}
