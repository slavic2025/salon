// app/admin/stylists/[id]/services/components/add-offered-service-dialog.tsx
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
} from '@/components/ui/dialog' //
import { AddOfferedServiceForm } from './add-offered-service-form'
import { Tables } from '@/types/database.types'
import { createLogger } from '@/lib/logger'

const logger = createLogger('AddOfferedServiceDialog')

interface AddOfferedServiceDialogProps {
  stylistId: string
  availableServices: Tables<'services'>[]
  triggerButton?: React.ReactNode // Permite un trigger custom
}

export function AddOfferedServiceDialog({ stylistId, availableServices, triggerButton }: AddOfferedServiceDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  // Cheie pentru a forța re-randarea și resetarea stării formularului intern la redeschidere
  const [dialogKey, setDialogKey] = useState(0)

  const handleOpenChange = (open: boolean) => {
    logger.debug(`Dialog open state changed: ${open}`)
    setIsDialogOpen(open)
    if (open) {
      // Incrementăm cheia doar la deschidere pentru a reseta starea formularului
      setDialogKey((prevKey) => prevKey + 1)
    }
  }

  const handleSuccess = () => {
    logger.debug('AddOfferedServiceForm reported success, closing dialog.')
    // Nu mai închidem dialogul imediat aici; `useEffect` din formular va gestiona închiderea după un scurt delay
    // setIsDialogOpen(false); // Eliminat pentru a permite mesajului de succes să fie vizibil
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adaugă Serviciu Oferit
          </Button>
        )}
      </DialogTrigger>
      {/* Cheia este importantă aici pentru a asigura resetarea stării formularului intern
          când dialogul este redeschis după o închidere anterioară (mai ales după un submit). */}
      <DialogContent key={dialogKey} className="sm:max-w-md">
        {' '}
        {/* Poți ajusta lățimea max */}
        <DialogHeader>
          <DialogTitle>Adaugă un nou serviciu pentru stilist</DialogTitle>
          <DialogDescription>
            Selectează un serviciu din lista de mai jos și specifică eventuale prețuri sau durate personalizate pentru
            acest stilist.
          </DialogDescription>
        </DialogHeader>
        <AddOfferedServiceForm
          stylistId={stylistId}
          availableServices={availableServices}
          onSuccess={handleSuccess} // Pasează funcția de succes
        />
      </DialogContent>
    </Dialog>
  )
}
