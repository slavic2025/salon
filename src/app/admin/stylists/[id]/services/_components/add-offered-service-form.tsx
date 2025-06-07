// app/admin/stylists/[id]/services/components/add-offered-service-form.tsx
'use client'

import React, { useEffect, useRef, useActionState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { createLogger } from '@/lib/logger'
import { INITIAL_FORM_STATE } from '@/lib/types'
import { GenericFormFields } from '@/components/shared/generic-form-fields' //
import { getOfferedServiceFormFields } from './offered-service-form-fields' ///services/components/offered-service-form-fields.ts"]
import { Tables } from '@/types/database.types'
import { ServicesOfferedActionResponse, ServicesOfferedFormDataType } from '@/features/services-offered/types'
import { addServiceToStylistAction } from '@/features/services-offered/actions'

const logger = createLogger('AddOfferedServiceForm')

interface AddOfferedServiceFormProps {
  stylistId: string
  availableServices: Tables<'services'>[] // Lista tuturor serviciilor disponibile
  onSuccess: () => void // Callback pentru a închide dialogul
}

export function AddOfferedServiceForm({ stylistId, availableServices, onSuccess }: AddOfferedServiceFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  // Folosim useActionState pentru a lega acțiunea de server la formular
  // Server Action `addServiceToStylistAction` este parțial aplicată cu `stylistId`
  const [state, formAction, isPending] = useActionState<ServicesOfferedActionResponse, FormData>(
    // Bind stylistId to the action
    (prevState, formData) => addServiceToStylistAction(stylistId, prevState, formData),
    INITIAL_FORM_STATE
  )

  useEffect(() => {
    if (state.success && state.message) {
      toast.success('Succes!', { description: state.message })
      logger.info(`Service successfully associated with stylist ${stylistId}.`)
      formRef.current?.reset() // Resetează formularul
      onSuccess() // Apelează callback-ul pentru a închide dialogul
    } else if (!state.success && state.message) {
      toast.error('Eroare!', { description: state.message })
      logger.warn(`Failed to associate service with stylist ${stylistId}.`, { errors: state.errors })
    } else if (state.errors) {
      // Toast specific pentru erori de validare, dacă mesajul general lipsește
      const errorCount = Object.keys(state.errors).length
      toast.error('Eroare de validare!', {
        description: `Au fost găsite ${errorCount} erori în formular. Vă rugăm să corectați câmpurile marcate.`,
      })
      logger.warn(`Validation errors for stylist ${stylistId}.`, { errors: state.errors })
    }
  }, [state, onSuccess, stylistId])

  // Obține configurația câmpurilor pentru modul de adăugare (isEditMode = false)
  const formFieldsConfig = getOfferedServiceFormFields(false, availableServices)

  return (
    <form action={formAction} ref={formRef} className="space-y-4">
      {/* Afișează mesajul de succes general al formularului, dacă există */}
      {state.success && state.message && !state.errors && (
        <div className="p-3 text-sm text-green-700 bg-green-100 border border-green-300 rounded-md">
          {state.message}
        </div>
      )}
      {/* Afișează eroarea generală a formularului, dacă există */}
      {state.errors?._form && (
        <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-300 rounded-md">
          {state.errors._form.join(', ')}
        </div>
      )}

      <GenericFormFields<ServicesOfferedFormDataType>
        fieldsConfig={formFieldsConfig}
        errors={state.errors}
        isEditMode={false}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isPending}>
          Anulează
        </Button>
        <SubmitButton idleText="Adaugă Serviciu Oferit" pendingText="Se adaugă..." disabled={isPending} />
      </DialogFooter>
    </form>
  )
}
