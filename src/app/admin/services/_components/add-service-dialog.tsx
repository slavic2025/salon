// app/admin/services/components/add-service-dialog.tsx
'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
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

import { ServiceFormFields } from '@/app/admin/services/_components/service-form-fields'
import { SubmitButton } from '@/components/ui/submit-button'
import { INITIAL_FORM_STATE } from '@/lib/types'
import { addServiceAction } from '@/features/services/actions'

export function AddServiceDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(0)
  const [state, formAction] = useActionState(addServiceAction, INITIAL_FORM_STATE)

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      setDialogKey((prevKey) => prevKey + 1)
    }
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Serviciul a fost adăugat cu succes!')
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
  }, [state])

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Adaugă Serviciu Nou</Button>
      </DialogTrigger>

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
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anulează
            </Button>
            <SubmitButton idleText="Adaugă Serviciu" pendingText="Se adaugă..." />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
