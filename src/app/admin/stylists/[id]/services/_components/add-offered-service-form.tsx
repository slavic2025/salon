// src/app/admin/stylists/[id]/services/_components/add-offered-service-form.tsx
'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { ActionResponse, INITIAL_FORM_STATE } from '@/types/actions.types' // Asigură-te că ActionResponse este importat
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { getOfferedServiceFormFields } from './offered-service-form-fields'
import { Tables } from '@/types/database.types'
import { addServiceToStylistAction } from '@/features/services-offered/actions'
import { useActionForm } from '@/hooks/useActionForm'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'

interface AddOfferedServiceFormProps {
  stylistId: string
  availableServices: Tables<'services'>[]
  onSuccess: () => void
}

export function AddOfferedServiceForm({ stylistId, availableServices, onSuccess }: AddOfferedServiceFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  // AICI ESTE CORECȚIA: Specificăm explicit tipurile pentru hook
  const { state, formSubmit, isPending } = useActionForm<ActionResponse, FormData>({
    action: (prevState, formData) => addServiceToStylistAction(stylistId, prevState, formData),
    initialState: INITIAL_FORM_STATE,
    resetFormRef: formRef,
    onSuccess: () => {
      setTimeout(() => {
        onSuccess()
      }, 1000)
    },
  })

  const formFieldsConfig = getOfferedServiceFormFields(false, availableServices)

  return (
    <form action={formSubmit} ref={formRef} className="space-y-4">
      <GenericFormFields<ServiceOffered> fieldsConfig={formFieldsConfig} errors={state.errors} isEditMode={false} />
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isPending}>
          Anulează
        </Button>
        <SubmitButton idleText="Adaugă Serviciu Oferit" pendingText="Se adaugă..." disabled={isPending} />
      </DialogFooter>
    </form>
  )
}
