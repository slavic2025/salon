// app/admin/stylists/components/edit-stylist-form.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { editStylistAction } from '@/app/admin/stylists/actions' // Importă acțiunea de editare stilist
import { SubmitButton } from '@/components/ui/submit-button'
import { createLogger } from '@/lib/logger'
import { StylistFormFields } from './stylist-form-fields' // Importă câmpurile formularului pentru stilist
import { StylistActionResponse } from '@/app/admin/stylists/types' // Importă tipul de răspuns al acțiunii și starea inițială
import { Stylist } from '@/lib/db/stylist-core' // Importă tipul Stylist
import { INITIAL_FORM_STATE } from '@/lib/types'

const logger = createLogger('EditStylistForm') // Noul nume pentru logger

interface EditStylistFormProps {
  entity: Stylist // Prop-ul este acum 'stylist' de tip 'Stylist'
  onSuccess: () => void
}

export function EditStylistForm({ entity, onSuccess }: EditStylistFormProps) {
  const [dialogSuccessMessage, setDialogSuccessMessage] = useState<string | null>(null)

  // Funcția care apelează Server Action-ul
  const updateStylistWithId = async (prevState: StylistActionResponse, formData: FormData) => {
    logger.debug('Calling editStylistAction...', { stylistId: formData.get('id') })
    return editStylistAction(prevState, formData) // Apelez acțiunea specifică stiliștilor
  }

  const [state, formAction] = useActionState<StylistActionResponse, FormData>(updateStylistWithId, INITIAL_FORM_STATE)
  const { pending } = useFormStatus() // Acum useFormStatus va funcționa cu acțiunea
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    logger.debug('useEffect triggered in EditStylistForm. Current state:', { state })
    if (state.message || state.errors || state.success) {
      if (state.success) {
        const successMsg = state.message || 'Stilistul a fost actualizat cu succes!' // Mesaj actualizat
        setDialogSuccessMessage(successMsg)
        toast.success(successMsg)
        logger.info('Stylist updated successfully!', { message: successMsg }) // Mesaj actualizat

        const timer = setTimeout(() => {
          onSuccess()
        }, 1500)

        return () => clearTimeout(timer)
      } else if (state.message) {
        logger.error('Failed to update stylist:', { message: state.message }) // Mesaj actualizat
        toast.error(state.message)
        setDialogSuccessMessage(null)
      } else if (state.errors) {
        logger.warn('Validation errors during stylist update:', { errors: state.errors }) // Mesaj actualizat
        toast.error('Eroare de validare! Verificați câmpurile marcate.')
        setDialogSuccessMessage(null)
      }
    }
  }, [state, onSuccess])

  return (
    <form action={formAction} ref={formRef}>
      <div className="grid gap-4 py-4">
        {/* Input ascuns pentru ID-ul stilistului */}
        <input type="hidden" name="id" value={entity.id} />
        {dialogSuccessMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center"
            role="alert"
          >
            <span className="block">{dialogSuccessMessage}</span>
          </div>
        )}
        {/* Folosim componenta StylistFormFields cu datele inițiale */}
        <StylistFormFields initialData={entity} errors={state.errors} isEditMode={true} />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onSuccess}>
          Anulează
        </Button>
        <SubmitButton idleText="Salvează modificările" pendingText="Se salvează..." />
      </DialogFooter>
    </form>
  )
}
