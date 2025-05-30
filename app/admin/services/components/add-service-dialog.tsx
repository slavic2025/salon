// app/admin/services/components/add-service-dialog.tsx
'use client' // Aceasta este o Client Component

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom' // Pentru starea de pending a formularului
import { Loader2 } from 'lucide-react' // Iconiță de loading
import { toast } from 'sonner' // Pentru notificări

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

// Importă componenta refactorizată pentru câmpurile formularului
import { ServiceFormFields } from '@/app/admin/services/components/service-form-fields'

// Importă Server Action-ul și tipul de răspuns al acțiunii
import { addServiceAction } from '@/app/admin/services/actions'
import { ActionResponse } from '@/app/admin/services/types'

// Starea inițială pentru useActionState, care va reseta formularul la deschidere
const INITIAL_FORM_STATE: ActionResponse = {
  success: false,
  message: undefined,
  errors: undefined,
}

export function AddServiceDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // `dialogKey` este crucial pentru a forța re-montarea `DialogContent`
  // și, implicit, a formularului și a stării `useActionState` la fiecare deschidere.
  const [dialogKey, setDialogKey] = useState(0)

  // useActionState gestionează logica Server Action-ului
  const [state, formAction] = useActionState(addServiceAction, INITIAL_FORM_STATE)
  const { pending } = useFormStatus() // Indicativ pentru starea de încărcare a formularului

  // Handler pentru schimbarea stării dialogului (deschis/închis)
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      // Când dialogul se deschide, incrementăm cheia pentru a forța re-montarea
      setDialogKey((prevKey) => prevKey + 1)
      // Resetăm orice mesaj de succes vizibil în dialog
      // Nu mai avem nevoie de `dialogSuccessMessage` separat, `state.message` e suficient
    }
    // Starea `state` (de la useActionState) se va reseta automat la următoarea deschidere datorită `dialogKey`.
  }

  // Efect pentru a gestiona răspunsul Server Action-ului și notificările toast
  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Serviciul a fost adăugat cu succes!')
      // Închide dialogul după un scurt delay, pentru a permite vizualizarea mesajului de succes
      const timer = setTimeout(() => {
        setIsDialogOpen(false) // Aceasta va declanșa `handleOpenChange` cu `open: false`
      }, 1500)
      return () => clearTimeout(timer)
    } else if (state.message && !state.errors) {
      // Mesaj de eroare generală (nu de validare)
      console.error('Eroare la adăugarea serviciului:', state.message)
      toast.error(state.message)
    } else if (state.errors) {
      // Există erori de validare per câmp
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

          {/* Afiseaza mesajul de succes direct din state, daca exista si nu sunt erori */}
          {state.success && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative text-center"
              role="alert"
            >
              <span className="block">{state.message || 'Serviciul a fost adăugat cu succes!'}</span>
            </div>
          )}

          <form action={formAction} className="grid gap-4 py-4">
            {/* Componenta ServiceFormFields primește erorile de validare de la Server Action */}
            {/* Nu este necesară initialData pentru modul de adăugare */}
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
