// app/admin/stylists/components/add-stylist-dialog.tsx
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

import { StylistFormFields } from '@/app/admin/stylists/components/stylist-form-fields'
import { addStylistAction } from '@/app/admin/stylists/actions'
import { SubmitButton } from '@/components/ui/submit-button'
import { StylistActionResponse } from '@/app/admin/stylists/types'
import { INITIAL_FORM_STATE } from '@/lib/types'

export function AddStylistDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(0)
  const [state, formAction] = useActionState<StylistActionResponse, FormData>(addStylistAction, INITIAL_FORM_STATE)

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      setDialogKey((prevKey) => prevKey + 1)
    }
  }

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Stilistul a fost adăugat cu succes!')
      const timer = setTimeout(() => {
        setIsDialogOpen(false)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (state.message && !state.errors) {
      console.error('Eroare la adăugarea stilistului:', state.message)
      toast.error(state.message)
    } else if (state.errors) {
      toast.error('Eroare de validare! Verificați câmpurile marcate.')
    }
  }, [state])

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Adaugă Stilist Nou</Button>
      </DialogTrigger>
      {/* Elimină condiția `isDialogOpen &&` de aici. DialogContent își gestionează vizibilitatea singur. */}
      <DialogContent key={dialogKey} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă Stilist Nou</DialogTitle>
          <DialogDescription>Completează detaliile pentru noul stilist.</DialogDescription>
        </DialogHeader>
        {state.success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center"
            role="alert"
          >
            <span className="block">{state.message || 'Stilistul a fost adăugat cu succes!'}</span>
          </div>
        )}

        <form action={formAction} className="grid gap-4 py-4">
          <StylistFormFields errors={state.errors} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anulează
            </Button>
            <SubmitButton idleText="Adaugă Stilist" pendingText="Se adaugă..." />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
