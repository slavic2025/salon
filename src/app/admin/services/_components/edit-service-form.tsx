// src/app/admin/services/_components/edit-service-form.tsx
'use client'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { ServiceFormFields } from './service-form-fields'
import { INITIAL_FORM_STATE } from '@/types/actions.types'
import { Service } from '@/core/domains/services/service.types'
import { editServiceAction } from '@/features/services/actions'
import { useActionForm } from '@/hooks/useActionForm'

interface EditServiceFormProps {
  entity: Service
  onSuccess: () => void
}

export function EditServiceForm({ entity, onSuccess }: EditServiceFormProps) {
  const { state, formSubmit, isPending } = useActionForm({
    action: editServiceAction,
    initialState: INITIAL_FORM_STATE,
    onSuccess: () => {
      setTimeout(() => {
        onSuccess()
      }, 1000)
    },
  })

  return (
    <form action={formSubmit}>
      <div className="grid gap-4 py-4">
        <input type="hidden" name="id" value={entity.id} />
        <ServiceFormFields initialData={entity} errors={state.errors} isEditMode={true} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={isPending} onClick={onSuccess}>
          Anulează
        </Button>
        <SubmitButton idleText="Salvează modificările" pendingText="Se salvează..." disabled={isPending} />
      </DialogFooter>
    </form>
  )
}
