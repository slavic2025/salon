// app/admin/services/components/edit-service-form.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'

import { ServiceData, ActionResponse } from '@/app/admin/services/types'
import { editServiceAction } from '@/app/admin/services/actions'
import { SubmitButton } from '@/components/ui/submit-button'

const INITIAL_FORM_STATE: ActionResponse = {
  success: false,
  message: undefined,
  errors: undefined,
}

interface EditServiceFormProps {
  service: ServiceData
  onSuccess: () => void
}

export function EditServiceForm({ service, onSuccess }: EditServiceFormProps) {
  const [dialogSuccessMessage, setDialogSuccessMessage] = useState<string | null>(null)

  const updateServiceWithId = async (prevState: ActionResponse, formData: FormData) => {
    console.log(`[${Date.now()}] EditServiceForm: Calling editServiceAction...`)
    return editServiceAction(prevState, formData)
  }

  const [state, formAction] = useActionState(updateServiceWithId, INITIAL_FORM_STATE)
  const { pending } = useFormStatus()
  const formRef = useRef<HTMLFormElement>(null)

  // Log la fiecare randare a componentei
  console.log(`[${Date.now()}] EditServiceForm: Component re-rendered. Pending: ${pending}`)

  // Log când starea `pending` se schimbă
  const prevPending = useRef(pending)
  useEffect(() => {
    if (pending !== prevPending.current) {
      console.log(`[${Date.now()}] EditServiceForm: PENDING STATE CHANGED from ${prevPending.current} to ${pending}`)
      prevPending.current = pending
    }
  }, [pending])

  // Log pentru schimbările de stare de la Server Action
  useEffect(() => {
    console.log(`[${Date.now()}] EditServiceForm: useEffect triggered. Current state:`, state)
    if (state.message || state.errors || state.success) {
      if (state.success) {
        const successMsg = state.message || 'Serviciul a fost actualizat cu succes!'
        setDialogSuccessMessage(successMsg)
        toast.success(successMsg)
        console.log(`[${Date.now()}] EditServiceForm: Action SUCCESS! Message: ${successMsg}`)

        const timer = setTimeout(() => {
          onSuccess()
          // if (formRef.current) { } // Nu mai este necesar, dialogul se închide.
        }, 1500)

        return () => clearTimeout(timer)
      } else if (state.message) {
        console.error(`[${Date.now()}] EditServiceForm: Action FAILED! Message:`, state.message)
        toast.error(state.message)
        setDialogSuccessMessage(null)
      } else if (state.errors) {
        console.error(`[${Date.now()}] EditServiceForm: Action FAILED! Validation errors:`, state.errors)
        toast.error('Eroare de validare! Verificați câmpurile marcate.')
        setDialogSuccessMessage(null)
      }
    }
  }, [state, onSuccess])

  return (
    <form action={formAction} ref={formRef}>
      <div className="grid gap-4 py-4">
        <input type="hidden" name="id" value={service.id} />
        {dialogSuccessMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center"
            role="alert"
          >
            <span className="block">{dialogSuccessMessage}</span>
          </div>
        )}

        {/* Câmpurile formularului rămân neschimbate */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nume
          </Label>
          <Input id="name" name="name" defaultValue={service.name} className="col-span-3" />
        </div>
        {state.errors?.name && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.name.join(', ')}</p>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descriere
          </Label>
          <Input id="description" name="description" defaultValue={service.description || ''} className="col-span-3" />
        </div>
        {state.errors?.description && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.description.join(', ')}</p>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="duration_minutes" className="text-right">
            Durata (min)
          </Label>
          <Input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            defaultValue={service.duration_minutes}
            className="col-span-3"
          />
        </div>
        {state.errors?.duration_minutes && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.duration_minutes.join(', ')}</p>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">
            Preț
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            defaultValue={service.price}
            className="col-span-3"
          />
        </div>
        {state.errors?.price && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.price.join(', ')}</p>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="is_active" className="text-right">
            Activ
          </Label>
          <Checkbox id="is_active" name="is_active" defaultChecked={service.is_active} className="col-span-3" />
        </div>
        {state.errors?.is_active && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.is_active.join(', ')}</p>
        )}

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="category" className="text-right">
            Categorie
          </Label>
          <Input id="category" name="category" defaultValue={service.category || ''} className="col-span-3" />
        </div>
        {state.errors?.category && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.category.join(', ')}</p>
        )}

        {state.message && !state.success && !state.errors && (
          <p className="text-red-500 text-sm text-center col-span-full">{state.message}</p>
        )}
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" disabled={pending} onClick={onSuccess}>
          Anulează
        </Button>
        {/* !!!!!!!!! UTILIZEAZĂ GLOBAL SubmitButton AICI !!!!!!!!! */}
        <SubmitButton>Salvează modificările</SubmitButton>
        {/* Poți folosi și prop-uri dacă nu vrei children:
        <SubmitButton idleText="Salvează modificările" pendingText="Se salvează..." />
        */}
      </DialogFooter>
    </form>
  )
}
