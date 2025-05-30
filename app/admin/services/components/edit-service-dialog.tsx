// app/admin/services/components/edit-service-dialog.tsx
'use client'

import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { ServiceData } from '@/app/admin/services/types'
import { EditServiceForm } from './edit-service-form' // Importă noua componentă de formular

interface EditServiceDialogProps {
  service: ServiceData // Datele serviciului de editat
}

export function EditServiceDialog({ service }: EditServiceDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(0) // Cheie pentru a forța re-montarea formularului

  // Handler pentru a închide dialogul și a-l reseta
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    // Resetăm cheia pentru a ne asigura că formularul se re-montează curat la următoarea deschidere
    // Acesta este critical pentru a reseta starea useActionState și erorile de validare
    setDialogKey((prevKey) => prevKey + 1)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editează</Button>
      </DialogTrigger>

      {/* Condițional, randează DialogContent și Formularul cu o cheie unică. */}
      {/* Când isDialogOpen devine true, dialogKey se schimbă, forțând re-montarea */}
      {/* a DialogContent și a EditServiceForm interne. */}
      {isDialogOpen && (
        <DialogContent key={dialogKey} className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editează Serviciul</DialogTitle>
            <DialogDescription>Fă modificări aici. Apasă salvare când ai terminat.</DialogDescription>
          </DialogHeader>

          {/* Componenta separată pentru formular */}
          <EditServiceForm
            service={service}
            onSuccess={handleCloseDialog} // Pasăm callback-ul pentru închidere la succes
          />
        </DialogContent>
      )}
    </Dialog>
  )
}
