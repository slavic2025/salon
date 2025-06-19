'use client'

import { useState, useTransition } from 'react'
import { useActionForm } from '@/hooks/useActionForm'
import { addServiceAction } from '@/features/services/actions'
import { objectToFormData } from '@/lib/form-utils'
import { Button } from '@/components/atoms/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { ServiceForm } from '@/components/organisms/ServiceForm'
import { PlusCircle } from 'lucide-react'
import type { CreateServiceInput } from '@/core/domains/services/service.types'

export function AddServiceDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitionPending, startTransition] = useTransition()

  // Hook-ul `useActionForm` gestionează starea acțiunii de server
  const { formSubmit, isPending: isActionPending } = useActionForm({
    action: addServiceAction,
    initialState: { success: false },
    onSuccess: () => {
      // La succes, închidem dialogul
      setIsOpen(false)
    },
  })

  // Funcția care conectează `react-hook-form` (din ServiceForm) cu Server Action-ul
  const handleFormSubmit = (values: CreateServiceInput) => {
    const formData = objectToFormData(values)
    startTransition(() => {
      formSubmit(formData)
    })
  }

  const isFormPending = isActionPending || isTransitionPending

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adaugă Serviciu
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă un serviciu nou</DialogTitle>
        </DialogHeader>
        {/* Randăm organismul nostru reutilizabil `ServiceForm` */}
        <ServiceForm isPending={isFormPending} onSubmit={handleFormSubmit} className="grid gap-4 py-4" />
      </DialogContent>
    </Dialog>
  )
}
