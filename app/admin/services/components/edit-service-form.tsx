// app/admin/services/components/edit-service-form.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogFooter } from '@/components/ui/dialog'

import { ServiceData, ActionResponse } from '@/app/admin/services/types'
import { editServiceAction } from '@/app/admin/services/actions' // Asigură-te că aceasta este calea corectă

// Starea inițială pentru useActionState
const INITIAL_FORM_STATE: ActionResponse = {
  success: false,
  message: undefined,
  errors: undefined,
}

interface EditServiceFormProps {
  service: ServiceData // Datele serviciului de editat
  onSuccess: () => void // Callback apelat la succes (pentru a închide dialogul)
}

export function EditServiceForm({ service, onSuccess }: EditServiceFormProps) {
  const [dialogSuccessMessage, setDialogSuccessMessage] = useState<string | null>(null)

  // Wrapper pentru Server Action care include 'id'-ul serviciului
  // Folosește prevState pentru a propaga starea între re-render-uri
  const updateServiceWithId = async (prevState: ActionResponse, formData: FormData) => {
    // Aici se poate adăuga orice logică pre-submit, dacă e necesar
    return editServiceAction(prevState, service.id, formData)
  }

  // useActionState gestionează starea acțiunii formularului
  const [state, formAction] = useActionState(updateServiceWithId, INITIAL_FORM_STATE)
  const { pending } = useFormStatus() // Indica dacă formularul este în proces de submit

  const formRef = useRef<HTMLFormElement>(null)

  // Efect pentru a gestiona răspunsul Server Action-ului și notificările
  useEffect(() => {
    if (state.success) {
      const successMsg = state.message || 'Serviciul a fost actualizat cu succes!'
      setDialogSuccessMessage(successMsg)
      toast.success(successMsg)

      // Apelăm callback-ul de succes pentru a permite componentei părinte să închidă dialogul
      // cu un mic delay pentru UX îmbunătățit.
      const timer = setTimeout(() => {
        onSuccess()
        // Resetăm starea formularului vizual (dacă ar fi nevoie)
        if (formRef.current) {
          formRef.current.reset() // Resetează valorile câmpurilor la cele inițiale (defaultValue)
        }
      }, 1500) // Mesajul rămâne vizibil 1.5 secunde

      return () => clearTimeout(timer) // Curăță timer-ul la unmount
    } else if (state.message) {
      // Mesaj de eroare generală (non-Zod)
      console.error('Eroare la actualizarea serviciului:', state.message)
      toast.error(state.message)
      setDialogSuccessMessage(null) // Asigură-te că mesajul de succes e gol în caz de eroare
    } else if (state.errors) {
      // Erori de validare Zod - deja afișate sub câmpuri
      toast.error('Eroare de validare! Verificați câmpurile marcate.')
      setDialogSuccessMessage(null)
    }
    // NOTĂ: `state` este singura dependență. `onSuccess` este o funcție stabilă.
  }, [state, onSuccess])

  return (
    <form action={formAction} ref={formRef}>
      <div className="grid gap-4 py-4">
        {/* Mesajul de succes afișat în dialog */}
        {dialogSuccessMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center"
            role="alert"
          >
            <span className="block">{dialogSuccessMessage}</span>
          </div>
        )}

        {/* Câmpul Nume */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nume
          </Label>
          <Input id="name" name="name" defaultValue={service.name} className="col-span-3" />
        </div>
        {state.errors?.name && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.name.join(', ')}</p>
        )}

        {/* Câmpul Descriere */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Descriere
          </Label>
          <Input id="description" name="description" defaultValue={service.description || ''} className="col-span-3" />
        </div>
        {state.errors?.description && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.description.join(', ')}</p>
        )}

        {/* Câmpul Durata (min) */}
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

        {/* Câmpul Preț */}
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

        {/* Câmpul Activ */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="is_active" className="text-right">
            Activ
          </Label>
          <Checkbox id="is_active" name="is_active" defaultChecked={service.is_active} className="col-span-3" />
        </div>
        {state.errors?.is_active && (
          <p className="text-red-500 text-sm col-start-2 col-span-3">{state.errors.is_active.join(', ')}</p>
        )}

        {/* Câmpul Categorie */}
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
        <Button type="button" variant="outline" disabled={pending}>
          Anulează
        </Button>
        <Button type="submit" disabled={pending}>
          {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {pending ? 'Se salvează...' : 'Salvează modificările'}
        </Button>
      </DialogFooter>
    </form>
  )
}
