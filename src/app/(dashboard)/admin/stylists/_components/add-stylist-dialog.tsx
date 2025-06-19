// src/app/(dashboard)/admin/stylists/_components/add-stylist-dialog.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/atoms/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog'
import { AddStylistForm } from './add-stylist-form'
import React from 'react'

// 1. Definim o interfață pentru proprietățile componentei
interface AddStylistDialogProps {
  trigger?: React.ReactNode
}

// 2. Primim `trigger` ca prop în componentă
export function AddStylistDialog({ trigger }: AddStylistDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {/* 3. Folosim trigger-ul custom dacă este furnizat, altfel afișăm butonul default */}
        {trigger || <Button>Adaugă Stilist Nou</Button>}
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
