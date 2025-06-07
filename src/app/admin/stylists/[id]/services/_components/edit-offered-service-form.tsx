// app/admin/stylists/[id]/services/components/edit-offered-service-form.tsx
'use client'

import React, { useEffect, useRef, useActionState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { createLogger } from '@/lib/logger'
import { INITIAL_FORM_STATE } from '@/types/types'
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { getOfferedServiceFormFields } from './offered-service-form-fields'
import { Tables } from '@/types/database.types'
import { ServicesOfferedActionResponse, ServicesOfferedData } from '@/features/services-offered/types'
import { updateOfferedServiceAction } from '@/features/services-offered/actions'

const logger = createLogger('EditOfferedServiceForm')

interface EditOfferedServiceFormProps {
  offeredService: ServicesOfferedData // Datele serviciului oferit, inclusiv detaliile serviciului de bază
  // availableServices este necesar pentru getOfferedServiceFormFields, chiar dacă nu-l folosim direct pentru <select> în modul editare
  availableServices: Tables<'services'>[]
  onSuccess: () => void
}

export function EditOfferedServiceForm({
  offeredService,
  availableServices, // Chiar dacă nu avem un <select> activ, funcția getOfferedServiceFormFields îl poate aștepta
  onSuccess,
}: EditOfferedServiceFormProps) {
  const formRef = useRef<HTMLFormElement>(null)

  const [state, formAction, isPending] = useActionState<ServicesOfferedActionResponse, FormData>(
    updateOfferedServiceAction, // Acțiunea de actualizare
    INITIAL_FORM_STATE
  )

  useEffect(() => {
    if (state.success && state.message) {
      toast.success('Succes!', { description: state.message })
      logger.info(`Offered service ${offeredService.id} updated successfully.`)
      // Nu resetăm formularul la editare, deoarece utilizatorul ar putea dori să vadă valorile salvate
      // formRef.current?.reset();
      onSuccess()
    } else if (!state.success && state.message) {
      toast.error('Eroare!', { description: state.message })
      logger.warn(`Failed to update offered service ${offeredService.id}.`, { errors: state.errors })
    } else if (state.errors) {
      const errorCount = Object.keys(state.errors).length
      toast.error('Eroare de validare!', {
        description: `Au fost găsite ${errorCount} erori. Vă rugăm să corectați câmpurile marcate.`,
      })
      logger.warn(`Validation errors for offered service ${offeredService.id}.`, { errors: state.errors })
    }
  }, [state, onSuccess, offeredService.id])

  // Obține configurația câmpurilor pentru modul de editare.
  // `service_id` nu va fi randat ca <select> de `getOfferedServiceFormFields` în `isEditMode: true`
  const formFieldsConfig = getOfferedServiceFormFields(true, availableServices)

  // Extragem datele inițiale pentru GenericFormFields, mapând corect numele.
  // ServicesOfferedFormDataType se așteaptă la `custom_duration` nu `custom_duration_minutes`
  // Dar `offeredService` (care e `ServicesOfferedData`) din BD are `custom_duration_minutes`.
  // Trebuie să ne asigurăm că `GenericFormFields` primește cheile corecte așa cum sunt definite în `offered-service-form-fields.ts`.
  const initialFormData = {
    custom_price: offeredService.custom_price,
    custom_duration: offeredService.custom_duration, // Mapare manuală aici dacă numele diferă
    is_active: offeredService.is_active,
    // service_id nu este parte din formFieldsConfig pentru editare, deci nu îl includem aici pentru GenericFormFields
  }

  return (
    <form action={formAction} ref={formRef} className="space-y-4">
      {/* Input-uri ascunse pentru ID-ul înregistrării services_offered și stylist_id */}
      <input type="hidden" name="id" value={offeredService.id} />
      <input type="hidden" name="stylist_id" value={offeredService.stylist_id} />
      {/* service_id este, de asemenea, necesar pentru validarea în backend, chiar dacă nu e editabil */}
      <input type="hidden" name="service_id" value={offeredService.service_id} />

      {/* Afișează numele serviciului de bază (non-editabil) */}
      <div className="grid grid-cols-4 items-center gap-4">
        <label htmlFor="base_service_name" className="text-right font-medium col-span-1">
          Serviciu:
        </label>
        <p id="base_service_name" className="col-span-3 text-sm py-2">
          {offeredService.services?.name || 'N/A'}
        </p>
      </div>

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

      <GenericFormFields<typeof initialFormData> // Tipul pentru GenericFormFields trebuie să se potrivească cu initialFormData
        fieldsConfig={formFieldsConfig} // Configurația nu include service_id pentru editare
        initialData={initialFormData}
        errors={state.errors}
        isEditMode={true}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isPending}>
          Anulează
        </Button>
        <SubmitButton idleText="Salvează Modificările" pendingText="Se salvează..." disabled={isPending} />
      </DialogFooter>
    </form>
  )
}
