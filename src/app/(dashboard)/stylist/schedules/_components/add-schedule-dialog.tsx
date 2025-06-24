'use client'

import { useState, useTransition } from 'react'
import { useActionForm } from '@/hooks/useActionForm'
import { addScheduleAction } from '@/features/schedules/actions'
import { objectToFormData } from '@/lib/form-utils'
import { Button } from '@/components/atoms/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { PlusIcon } from 'lucide-react'
import type { CreateScheduleInput } from '@/core/domains/schedules/schedule.types'
import { ScheduleForm } from '@/components/organisms/ScheduleForm'

// Componenta primește acum stylistId pentru a-l pasa formularului
interface AddScheduleDialogProps {
  stylistId: string
}

export function AddScheduleDialog({ stylistId }: AddScheduleDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm({
    action: addScheduleAction,
    initialState: { success: false, data: null, message: '', errors: {} },
    onSuccess: () => setIsOpen(false),
  })

  const handleFormSubmit = (values: CreateScheduleInput) => {
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
          <PlusIcon className="mr-2 h-4 w-4" /> Adaugă Interval
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adaugă un nou interval de lucru</DialogTitle>
        </DialogHeader>
        {/* Randăm organismul nostru reutilizabil `ScheduleForm` */}
        <ScheduleForm stylistId={stylistId} isPending={isFormPending} onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  )
}
