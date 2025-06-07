// src/app/admin/stylists/_components/add-stylist-dialog.tsx
'use client'

import { useRef, useState } from 'react'
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
import { StylistFormFields } from '@/app/admin/stylists/_components/stylist-form-fields'
import { SubmitButton } from '@/components/ui/submit-button'
import { INITIAL_FORM_STATE } from '@/types/types'
import { addStylistAction } from '@/features/stylists/actions'
import { useActionForm } from '@/hooks/useActionForm' // <-- Importăm hook-ul!

export function AddStylistDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  // Utilizăm hook-ul useActionForm pentru a gestiona totul
  const { state, formSubmit, isPending } = useActionForm({
    action: addStylistAction,
    initialState: INITIAL_FORM_STATE,
    resetFormRef: formRef, // Hook-ul va reseta formularul la succes
    onSuccess: () => {
      // Hook-ul va afișa toast-ul, aici doar închidem dialogul
      setTimeout(() => {
        setIsDialogOpen(false)
      }, 1000) // Delay mic pentru ca utilizatorul să vadă mesajul de succes
    },
  })

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Adaugă Stilist Nou</Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => {
          // Prevenim închiderea dialogului la click în exterior dacă o acțiune este în desfășurare
          if (isPending) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Adaugă Stilist Nou</DialogTitle>
          <DialogDescription>Completează detaliile pentru noul stilist.</DialogDescription>
        </DialogHeader>

        {/* Formularul acum folosește `formSubmit` de la hook */}
        <form action={formSubmit} ref={formRef} className="grid gap-4 py-4">
          {/* Câmpurile formularului primesc erorile direct din starea gestionată de hook */}
          <StylistFormFields errors={state.errors} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
              Anulează
            </Button>
            <SubmitButton idleText="Adaugă Stilist" pendingText="Se adaugă..." disabled={isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
