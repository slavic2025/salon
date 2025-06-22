'use client'

// Pasul 1: Importăm `useTransition` de la React
import { useState, useTransition } from 'react'
import { useActionForm } from '@/hooks/useActionForm'
import { editServiceAction } from '@/features/services/actions'
import { objectToFormData } from '@/lib/form-utils'
import { Button } from '@/components/atoms/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/atoms/dialog'
import { ServiceForm } from '@/components/organisms/ServiceForm'
import { type Service, type CreateServiceInput } from '@/core/domains/services/service.types'
import { Pencil } from 'lucide-react'

interface EditServiceDialogProps {
  service: Service
}

export function EditServiceDialog({ service }: EditServiceDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm({
    action: editServiceAction,
    initialState: { success: false },
    onSuccess: () => {
      setIsOpen(false)
    },
  })

  const handleFormSubmit = (values: CreateServiceInput) => {
    const payload = {
      id: service.id,
      ...values,
    }
    const formData = objectToFormData(payload)

    startTransition(() => {
      formSubmit(formData)
    })
  }

  const isFormPending = isActionPending || isTransitionPending

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editează Serviciul</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează Serviciul</DialogTitle>
          <DialogDescription>Completează formularul pentru a edita serviciul.</DialogDescription>
        </DialogHeader>
        <ServiceForm isPending={isFormPending} initialData={service} onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  )
}
