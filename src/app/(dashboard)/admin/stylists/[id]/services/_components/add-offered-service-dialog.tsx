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

// 1. Definim interfața de props pentru a folosi 'trigger'
interface AddOfferedServiceDialogProps {
  stylistId: string
  availableServices: Tables<'services'>[]
  trigger?: React.ReactNode // Numele standardizat
}

// 2. Primim `trigger` în loc de `triggerButton`
export function AddOfferedServiceDialog({ stylistId, availableServices, trigger }: AddOfferedServiceDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        {/* 3. Folosim noul nume de prop */}
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Adaugă Serviciu Oferit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adaugă un nou serviciu pentru stilist</DialogTitle>
          <DialogDescription>
            Selectează un serviciu și specifică eventuale prețuri sau durate personalizate.
          </DialogDescription>
        </DialogHeader>
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
