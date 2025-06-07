// components/shared/generic-edit-dialog.tsx
'use client'

import { useState } from 'react'
import React from 'react' // Import React pentru React.ReactNode

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { DisplayItem } from './display-card-types' // Asigură-te că DisplayItem este importat

// Definirea tipului pentru componenta de formular care va fi pasată
// Aceasta trebuie să accepte prop-ul 'entity' de tip T și un callback 'onSuccess'
interface FormComponentProps<T extends DisplayItem> {
  entity: T
  onSuccess: () => void
  // Poate și alte prop-uri comune dacă sunt necesare, ex: 'mode': 'edit' | 'add'
}

interface GenericEditDialogProps<T extends DisplayItem> {
  entity: T // Entitatea de editat
  title: string // Titlul dialogului
  description: string // Descrierea dialogului
  // Componenta de formular specifică (ex: EditServiceForm sau EditStylistForm)
  // Folosim React.ComponentType pentru a indica că este o componentă React
  FormComponent: React.ComponentType<FormComponentProps<T>>
  children?: React.ReactNode // Trigger-ul dialogului (ex: un buton)
}

export function GenericEditDialog<T extends DisplayItem>({
  entity,
  title,
  description,
  FormComponent,
  children,
}: GenericEditDialogProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children || <Button variant="outline">Editează</Button>}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {/* Renderizează componenta de formular pasată și îi pasează prop-urile necesare */}
        <FormComponent entity={entity} onSuccess={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  )
}
