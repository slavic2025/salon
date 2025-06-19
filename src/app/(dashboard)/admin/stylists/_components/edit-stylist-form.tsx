// src/app/admin/stylists/_components/edit-stylist-form.tsx
'use client'

import { useRef } from 'react'
import { Button } from '@/components/atoms/button'
import { DialogFooter } from '@/components/atoms/dialog'
import { SubmitButton } from '@/components/molecules/submit-button'
import { StylistFormFields } from './stylist-form-fields'
import { INITIAL_FORM_STATE } from '@/types/actions.types'
import { useActionForm } from '@/hooks/useActionForm'
import { Stylist } from '@/core/domains/stylists/stylist.types'
import { editStylistAction } from '@/features/stylists/actions'

interface EditStylistFormProps {
  entity: Stylist
  onSuccess: () => void
}

export function EditStylistForm({ entity, onSuccess }: EditStylistFormProps) {
  // Nu mai avem nevoie de `useState` pentru mesaje de succes aici.

  const { state, formSubmit, isPending } = useActionForm({
    action: editStylistAction,
    initialState: INITIAL_FORM_STATE,
    onSuccess: () => {
      // Hook-ul afișează toast-ul. Noi doar închidem dialogul după un scurt delay.
      setTimeout(() => {
        onSuccess()
      }, 1000)
    },
  })

  return (
    // Nu mai avem nevoie de `useRef` aici deoarece nu resetăm formularul de editare.
    <form action={formSubmit}>
      <div className="grid gap-4 py-4">
        <input type="hidden" name="id" value={entity.id} />

        {/* Componenta de câmpuri primește erorile direct din hook */}
        <StylistFormFields initialData={entity} errors={state.errors} isEditMode={true} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={isPending} onClick={onSuccess}>
          Anulează
        </Button>
        <SubmitButton isPending={isPending} pendingText="Se salvează...">
          Salvează modificările
        </SubmitButton>
      </DialogFooter>
    </form>
  )
}
