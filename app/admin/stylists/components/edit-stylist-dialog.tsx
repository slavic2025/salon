// app/admin/stylists/components/edit-stylist-dialog.tsx
'use client'

import { useState } from 'react'
import React from 'react' // Asigură-te că React este importat pentru React.ReactNode

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { Stylist } from '@/lib/db/stylist-core' // Importă tipul Stylist
import { EditStylistForm } from './edit-stylist-form' // Va trebui să creezi acest component

interface EditStylistDialogProps {
  stylist: Stylist // Prop-ul este acum 'stylist' de tip 'Stylist'
  children?: React.ReactNode // Permite un element copil ca trigger
}

export function EditStylistDialog({ stylist, children }: EditStylistDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {/* Dacă există copii (e.g., DropdownMenuItem), folosește-i. Altfel, folosește un buton implicit. */}
        {children || <Button variant="outline">Editează</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editează Stilistul</DialogTitle> {/* Titlul actualizat */}
          <DialogDescription>Fă modificări aici. Apasă salvare când ai terminat.</DialogDescription>
        </DialogHeader>
        <EditStylistForm stylist={stylist} onSuccess={handleCloseDialog} /> {/* Prop-ul este acum 'stylist' */}
      </DialogContent>
    </Dialog>
  )
}
