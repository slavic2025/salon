// src/app/(dashboard)/admin/services/_components/add-service-dialog.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddServiceForm } from './add-service-form'
import React from 'react'

// 1. Definim interfața pentru props
interface AddServiceDialogProps {
  trigger?: React.ReactNode
}

// 2. Primim `trigger` ca prop
export function AddServiceDialog({ trigger }: AddServiceDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {/* 3. Folosim trigger-ul custom dacă există, altfel butonul default */}
        {trigger || <Button>Adaugă Serviciu Nou</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă Serviciu Nou</DialogTitle>
          <DialogDescription>Completează detaliile pentru noul serviciu.</DialogDescription>
        </DialogHeader>
        <AddServiceForm onSuccess={() => setIsDialogOpen(false)} onCancel={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
