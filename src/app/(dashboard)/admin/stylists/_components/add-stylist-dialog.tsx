'use client'

import { useState, useTransition, type ReactNode } from 'react'
import { useActionForm } from '@/hooks/useActionForm'
import { addStylistAction } from '@/features/stylists/actions'
import { objectToFormData } from '@/lib/form-utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/atoms/dialog'
import { StylistForm } from '@/components/organisms/StylistForm'
import type { CreateStylistInput } from '@/core/domains/stylists/stylist.types'
import { Button } from '@/components/atoms/button'
import { PlusCircle } from 'lucide-react'

export function AddStylistDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm({
    action: addStylistAction,
    initialState: { success: false },
    onSuccess: () => setIsOpen(false),
  })

  const handleFormSubmit = (values: CreateStylistInput) => {
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
          Adaugă Stilist
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă Stilist Nou</DialogTitle>
          <DialogDescription>Completează detaliile pentru noul stilist.</DialogDescription>
        </DialogHeader>
        <StylistForm isPending={isFormPending} onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  )
}
