// src/app/(dashboard)/admin/stylists/[id]/services/_components/add-offered-service-dialog.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddOfferedServiceForm } from './add-offered-service-form'
import { Tables } from '@/types/database.types'

interface AddOfferedServiceDialogProps {
  stylistId: string
  availableServices: Tables<'services'>[]
  triggerButton?: React.ReactNode
}

export function AddOfferedServiceDialog({ stylistId, availableServices, triggerButton }: AddOfferedServiceDialogProps) {
  // Păstrăm doar state-ul pentru vizibilitatea dialogului
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adaugă Serviciu Oferit
          </Button>
        )}
      </DialogTrigger>

      {/* Eliminăm 'key', deoarece Dialog unmounts on close, resetând starea formularului. */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adaugă un nou serviciu pentru stilist</DialogTitle>
          <DialogDescription>
            Selectează un serviciu și specifică eventuale prețuri sau durate personalizate.
          </DialogDescription>
        </DialogHeader>

        {/* Pasăm funcția de închidere direct la 'onSuccess' și 'onCancel' */}
        <AddOfferedServiceForm
          stylistId={stylistId}
          availableServices={availableServices}
          onSuccess={() => setIsDialogOpen(false)}
          onCancel={() => setIsDialogOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
