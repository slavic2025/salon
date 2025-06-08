// src/app/(dashboard)/dashboard/schedule/_components/add-work-schedule-dialog.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
// Importăm și DialogDescription
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddWorkScheduleForm } from './add-work-schedule-form'
import { PlusIcon } from 'lucide-react'

export function AddWorkScheduleDialog() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" /> Adaugă Interval
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă un nou interval de lucru</DialogTitle>
          {/* AICI ESTE MODIFICAREA: Adăugăm descrierea */}
          <DialogDescription>Selectează ziua și orele pentru noul interval de program.</DialogDescription>
        </DialogHeader>
        <AddWorkScheduleForm onSuccess={() => setIsOpen(false)} onCancel={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
