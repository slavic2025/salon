// src/app/(dashboard)/admin/stylists/[id]/services/_components/edit-offered-service-form.tsx
'use client'

import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { INITIAL_FORM_STATE, ActionResponse } from '@/types/actions.types'
import { GenericFormFields } from '@/components/shared/generic-form-fields'
import { getOfferedServiceFormFields } from './offered-service-form-fields'
import { Tables } from '@/types/database.types'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'
import { updateOfferedServiceAction } from '@/features/services-offered/actions'
import { useActionForm } from '@/hooks/useActionForm'

interface EditOfferedServiceFormProps {
  offeredService: ServiceOffered
  availableServices: Tables<'services'>[]
  onSuccess: () => void
  onCancel: () => void // Adăugăm onCancel pentru consistență
}

export function EditOfferedServiceForm({
  offeredService,
  availableServices,
  onSuccess,
  onCancel,
}: EditOfferedServiceFormProps) {
  // Am înlocuit toată logica manuală (useState, useEffect, useActionState) cu o singură linie:
  const { state, formSubmit, isPending } = useActionForm<ActionResponse, FormData>({
    action: updateOfferedServiceAction,
    initialState: INITIAL_FORM_STATE,
    onSuccess: onSuccess, // Hook-ul va afișa toast-ul, noi doar apelăm funcția de succes
  })

  const formFieldsConfig = getOfferedServiceFormFields(true, availableServices)
  const initialFormData = {
    custom_price: offeredService.custom_price,
    custom_duration: offeredService.custom_duration,
    is_active: offeredService.is_active,
  }

  return (
    <form action={formSubmit} className="space-y-4">
      {/* Inputurile ascunse sunt esențiale pentru ca acțiunea să identifice entitatea corectă */}
      <input type="hidden" name="id" value={offeredService.id} />
      <input type="hidden" name="stylist_id" value={offeredService.stylist_id} />
      <input type="hidden" name="service_id" value={offeredService.service_id} />

      {/* Afișăm numele serviciului pentru context, dar nu este editabil */}
      <div className="grid grid-cols-4 items-center gap-4">
        <label className="text-right font-medium col-span-1">Serviciu:</label>
        <p className="col-span-3 text-sm font-medium py-2">{offeredService.services?.name || 'N/A'}</p>
      </div>

      <GenericFormFields<typeof initialFormData>
        fieldsConfig={formFieldsConfig}
        initialData={initialFormData}
        errors={state.errors}
        isEditMode={true}
      />

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Anulează
        </Button>
        <SubmitButton idleText="Salvează Modificările" pendingText="Se salvează..." disabled={isPending} />
      </DialogFooter>
    </form>
  )
}
