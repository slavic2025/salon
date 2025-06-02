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
import { EditServiceForm } from './edit-service-form'

interface EditServiceDialogProps {
  service: ServiceData
}

export function EditServiceDialog({ service }: EditServiceDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Editează</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editează Serviciul</DialogTitle>
          <DialogDescription>Fă modificări aici. Apasă salvare când ai terminat.</DialogDescription>
        </DialogHeader>
        <EditServiceForm service={service} onSuccess={handleCloseDialog} />
      </DialogContent>
    </Dialog>
  )
}
