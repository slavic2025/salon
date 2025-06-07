// src/app/(dashboard)/admin/stylists/_components/add-stylist-dialog.tsx
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
import { AddStylistForm } from './add-stylist-form'

export function AddStylistDialog() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>Adaugă Stilist Nou</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă Stilist Nou</DialogTitle>
          <DialogDescription>Completează detaliile pentru noul stilist.</DialogDescription>
        </DialogHeader>
        <AddStylistForm onSuccess={() => setIsDialogOpen(false)} onCancel={() => setIsDialogOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
