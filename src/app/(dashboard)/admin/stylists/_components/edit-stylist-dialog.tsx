// app/admin/stylists/components/edit-stylist-dialog.tsx
'use client'

import { useState, useTransition } from 'react'
import { useActionForm } from '@/hooks/useActionForm'
import { editStylistAction } from '@/features/stylists/actions'
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
import { StylistForm } from '@/components/organisms/StylistForm'
import { type Stylist, type CreateStylistInput } from '@/core/domains/stylists/stylist.types'
import { Pencil } from 'lucide-react'

interface EditStylistDialogProps {
  stylist: Stylist
}

export function EditStylistDialog({ stylist }: EditStylistDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm({
    action: editStylistAction,
    initialState: { success: false },
    onSuccess: () => {
      setIsOpen(false)
    },
  })

  const handleFormSubmit = (values: CreateStylistInput) => {
    const payload = {
      id: stylist.id,
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
          <span className="sr-only">Editează Stilistul</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editează Stilistul</DialogTitle>
          <DialogDescription>Completează formularul pentru a edita stilistul.</DialogDescription>
        </DialogHeader>
        <StylistForm isPending={isFormPending} initialData={stylist} onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  )
}
