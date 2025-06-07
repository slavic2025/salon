// app/admin/services/components/edit-service-form.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { createLogger } from '@/lib/logger'
import { ServiceFormFields } from './service-form-fields'
import { ActionResponse, INITIAL_FORM_STATE } from '@/lib/types'
import { ServiceData } from '@/features/services/types'
import { editServiceAction } from '@/features/services/actions'

const logger = createLogger('EditServiceForm')

interface EditServiceFormProps {
  entity: ServiceData
  onSuccess: () => void
}

export function EditServiceForm({ entity, onSuccess }: EditServiceFormProps) {
  const [dialogSuccessMessage, setDialogSuccessMessage] = useState<string | null>(null)

  const updateServiceWithId = async (prevState: ActionResponse, formData: FormData) => {
    logger.debug('Calling editServiceAction...', { serviceId: formData.get('id') })
    return editServiceAction(prevState, formData)
  }

  const [state, formAction] = useActionState(updateServiceWithId, INITIAL_FORM_STATE)
  const { pending } = useFormStatus()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    logger.debug('useEffect triggered in EditServiceForm. Current state:', { state })
    if (state.message || state.errors || state.success) {
      if (state.success) {
        const successMsg = state.message || 'Serviciul a fost actualizat cu succes!'
        setDialogSuccessMessage(successMsg)
        toast.success(successMsg)
        logger.info('Service updated successfully!', { message: successMsg })

        const timer = setTimeout(() => {
          onSuccess()
        }, 1500)

        return () => clearTimeout(timer)
      } else if (state.message) {
        logger.error('Failed to update service:', { message: state.message })
        toast.error(state.message)
        setDialogSuccessMessage(null)
      } else if (state.errors) {
        logger.warn('Validation errors during service update:', { errors: state.errors })
        toast.error('Eroare de validare! Verificați câmpurile marcate.')
        setDialogSuccessMessage(null)
      }
    }
  }, [state, onSuccess])

  return (
    <form action={formAction} ref={formRef}>
      <div className="grid gap-4 py-4">
        <input type="hidden" name="id" value={entity.id} />
        {dialogSuccessMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center"
            role="alert"
          >
            <span className="block">{dialogSuccessMessage}</span>
          </div>
        )}
        <ServiceFormFields initialData={entity} errors={state.errors} isEditMode={true} />
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
