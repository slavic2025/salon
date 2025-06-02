// app/admin/services/components/add-service-dialog.tsx
'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { ServiceFormFields } from '@/app/admin/services/components/service-form-fields'
import { addServiceAction } from '@/app/admin/services/actions'
import { ActionResponse } from '@/app/admin/services/types'

const INITIAL_FORM_STATE: ActionResponse = {
  success: false,
  message: undefined,
  errors: undefined,
}

export function AddServiceDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(0)
  const [state, formAction] = useActionState(addServiceAction, INITIAL_FORM_STATE)
  const { pending } = useFormStatus()

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      setDialogKey((prevKey) => prevKey + 1)
    }
  }

  // Efect pentru a gestiona răspunsul Server Action-ului și notificările toast
  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Serviciul a fost adăugat cu succes!')
      // Închide dialogul după un scurt delay, pentru a permite vizualizarea mesajului de succes
      const timer = setTimeout(() => {
        setIsDialogOpen(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (state.message && !state.errors) {
      console.error('Eroare la adăugarea serviciului:', state.message)
      toast.error(state.message)
    } else if (state.errors) {
      toast.error('Eroare de validare! Verificați câmpurile marcate.')
    }
  }, [state]) // Se execută la fiecare modificare a stării acțiunii

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Adaugă Serviciu Nou</Button>
      </DialogTrigger>

      {/* Condițional, randează DialogContent cu o cheie unică. */}
      {/* Când isDialogOpen devine true, dialogKey se schimbă, forțând re-montarea */}
      {/* a DialogContent și a tuturor componentelor sale interne (inclusiv useActionState). */}
      {isDialogOpen && (
        <DialogContent key={dialogKey} className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adaugă Serviciu Nou</DialogTitle>
            <DialogDescription>Completează detaliile pentru noul serviciu.</DialogDescription>
          </DialogHeader>
          {state.success && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center"
              role="alert"
            >
              <span className="block">{state.message || 'Serviciul a fost adăugat cu succes!'}</span>
            </div>
          )}

          <form action={formAction} className="grid gap-4 py-4">
            <ServiceFormFields errors={state.errors} />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={pending}>
                Anulează
              </Button>
              <Button type="submit" disabled={pending}>
                {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {pending ? 'Se adaugă...' : 'Adaugă Serviciu'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  )
}
