// src/app/(dashboard)/admin/stylists/[id]/services/_components/add-offered-service-form.tsx
'use client'

import { useRef } from 'react'
import { Button } from '@/components/atoms/button'
import { DialogFooter } from '@/components/atoms/dialog'
import { SubmitButton } from '@/components/molecules/submit-button'
import { INITIAL_FORM_STATE, ActionResponse } from '@/types/actions.types'
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { getOfferedServiceFormFields } from './offered-service-form-fields'
import { Tables } from '@/types/database.types'
import { AddOfferedServiceInput } from '@/core/domains/services-offered/services-offered.types'
import { addServiceToStylistAction } from '@/features/services-offered/actions'
import { useActionForm } from '@/hooks/useActionForm'

// 1. Adăugăm `onCancel` la interfața de props
interface AddOfferedServiceFormProps {
  stylistId: string
  availableServices: Tables<'services'>[]
  onSuccess: () => void
  onCancel: () => void // <-- Prop adăugat
}

export function AddOfferedServiceForm({
  stylistId,
  availableServices,
  onSuccess,
  onCancel, // 2. Primim prop-ul în componentă
}: AddOfferedServiceFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

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
      <GenericFormFields<AddOfferedServiceInput>
        fieldsConfig={formFieldsConfig}
        errors={state.errors}
        isEditMode={false}
      />
      <DialogFooter>
        {/* 3. Folosim `onCancel` pe butonul de anulare */}
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Anulează
        </Button>
        <SubmitButton isPending={isPending} pendingText="Se adaugă...">
          Adaugă Serviciu Oferit
        </SubmitButton>
      </DialogFooter>
    </form>
  )
}
