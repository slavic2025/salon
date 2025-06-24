'use client'

import { useState, useTransition } from 'react'
import { useActionForm } from '@/hooks/useActionForm'
import { addWorkScheduleAction } from '@/features/work-schedules/actions'
import { objectToFormData } from '@/lib/form-utils'
import { Button } from '@/components/atoms/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/atoms/dialog'
import { WorkScheduleForm } from '@/components/organisms/WorkScheduleForm' // <-- Noul import
import { PlusIcon } from 'lucide-react'
import type { CreateWorkScheduleInput } from '@/core/domains/work-schedules/work-schedule.types'

// Componenta primește acum stylistId pentru a-l pasa formularului
interface AddWorkScheduleDialogProps {
  stylistId: string
}

export function AddWorkScheduleDialog({ stylistId }: AddWorkScheduleDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm({
    action: addWorkScheduleAction,
    initialState: { success: false, data: null, message: '', errors: {} },
    onSuccess: () => setIsOpen(false),
  })

  const handleFormSubmit = (values: CreateWorkScheduleInput) => {
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
        {/* Randăm organismul nostru reutilizabil `WorkScheduleForm` */}
        <WorkScheduleForm stylistId={stylistId} isPending={isFormPending} onSubmit={handleFormSubmit} />
      </DialogContent>
    </Dialog>
  )
}
