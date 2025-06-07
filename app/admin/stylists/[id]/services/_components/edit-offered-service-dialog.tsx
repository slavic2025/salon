// app/admin/stylists/[id]/services/components/edit-offered-service-dialog.tsx
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { EditOfferedServiceForm } from './edit-offered-service-form'
import { Tables } from '@/types/database.types'
import { createLogger } from '@/lib/logger'
import { ServicesOfferedData } from '@/features/services-offered/types'

const logger = createLogger('EditOfferedServiceDialog')

interface EditOfferedServiceDialogProps {
  offeredService: ServicesOfferedData // Datele complete ale serviciului oferit
  availableServices: Tables<'services'>[] // Necesar pentru formularul intern
  triggerButton?: React.ReactNode
}

export function EditOfferedServiceDialog({
  offeredService,
  availableServices,
  triggerButton,
}: EditOfferedServiceDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogKey, setDialogKey] = useState(Date.now()) // Cheie pentru resetarea stării formularului

  const handleOpenChange = (open: boolean) => {
    logger.debug(`Dialog open state changed: ${open} for offered service ID ${offeredService.id}`)
    setIsDialogOpen(open)
    if (open) {
      setDialogKey(Date.now()) // Schimbă cheia la fiecare deschidere pentru a reseta formularul
    }
  }

  const handleSuccess = () => {
    logger.debug(`EditOfferedServiceForm reported success for ${offeredService.id}, closing dialog.`)
    // setIsDialogOpen(false); // Formularul gestionează închiderea după mesajul de succes
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm">
            <Pencil className="mr-2 h-4 w-4" />
            Editează
          </Button>
        )}
      </DialogTrigger>
      <DialogContent key={dialogKey} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editează Serviciul Oferit: {offeredService.services?.name || 'Serviciu Necunoscut'}</DialogTitle>
          <DialogDescription>
            Modifică prețul custom, durata custom sau statusul de activare pentru acest serviciu oferit de stilist.
          </DialogDescription>
        </DialogHeader>
        <EditOfferedServiceForm
          offeredService={offeredService}
          availableServices={availableServices} // Chiar dacă nu e folosit direct pentru select
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  )
}
