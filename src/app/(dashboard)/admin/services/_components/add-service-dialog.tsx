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
import { AddServiceForm } from './add-service-form' // Importăm noul formular

export function AddServiceDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Adaugă Serviciu Nou</Button>
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
