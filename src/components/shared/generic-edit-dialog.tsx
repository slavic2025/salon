// src/components/shared/generic-edit-dialog.tsx
'use client'

import { useState } from 'react'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { DisplayItem } from './display-card-types'

// 1. Adăugăm `onCancel` la interfața pentru props-urile formularului
// Acum, orice formular folosit de GenericEditDialog trebuie să accepte și onCancel.
interface FormComponentProps<T extends DisplayItem> {
  entity: T
  onSuccess: () => void
  onCancel: () => void // <-- Prop adăugat
}

interface GenericEditDialogProps<T extends DisplayItem> {
  entity: T
  title: string
  description: string
  FormComponent: React.ComponentType<FormComponentProps<T>>
  children?: React.ReactNode
}

export function GenericEditDialog<T extends DisplayItem>({
  entity,
  title,
  description,
  FormComponent,
  children,
}: GenericEditDialogProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Definirea funcțiilor de callback pe care le vom pasa mai jos
  const handleSuccess = () => {
    // Lăsăm formularul să decidă când se închide dialogul,
    // dar am putea avea nevoie de un delay pentru toast, gestionat în formular.
    // Aici, pur și simplu închidem dialogul.
    setIsDialogOpen(false)
  }

  const handleCancel = () => {
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

        {/* 2. Pasăm și funcția `onCancel` către componenta de formular */}
        <FormComponent entity={entity} onSuccess={handleSuccess} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}
