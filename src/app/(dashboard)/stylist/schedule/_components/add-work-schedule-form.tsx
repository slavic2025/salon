// src/app/(dashboard)/dashboard/schedule/_components/add-work-schedule-form.tsx
'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { useActionForm } from '@/hooks/useActionForm'
import { INITIAL_FORM_STATE } from '@/types/actions.types'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { addWorkScheduleAction } from '@/features/schedule/actions'

const dayOptions = [
  { value: '1', label: 'Luni' },
  { value: '2', label: 'Marți' },
  { value: '3', label: 'Miercuri' },
  { value: '4', label: 'Joi' },
  { value: '5', label: 'Vineri' },
  { value: '6', label: 'Sâmbătă' },
  { value: '0', label: 'Duminică' },
]

export function AddWorkScheduleForm({ onSuccess, onCancel }: { onSuccess: () => void; onCancel: () => void }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [selectedWeekday, setSelectedWeekday] = useState('')

  const { state, formSubmit, isPending } = useActionForm({
    action: addWorkScheduleAction,
    initialState: INITIAL_FORM_STATE,
    resetFormRef: formRef,
    onSuccess: () => {
      setSelectedWeekday('')
      setTimeout(onSuccess, 1000)
    },
  })

  return (
    <form action={formSubmit} ref={formRef} className="space-y-4 py-4">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="weekday">
          Ziua Săptămânii <span className="text-destructive">*</span>
        </Label>

        {/* Folosim componenta custom <Select> reparată */}
        <Select name="weekday" required value={selectedWeekday} onValueChange={setSelectedWeekday}>
          <SelectTrigger id="weekday" className={state.errors?.weekday ? 'border-destructive' : ''}>
            <SelectValue placeholder="Selectează o zi" />
          </SelectTrigger>
          <SelectContent>
            {dayOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {state.errors?.weekday && <p className="text-sm text-destructive">{state.errors.weekday[0]}</p>}
      </div>

      {/* Restul câmpurilor rămân la fel */}
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="start_time">
          Ora de Început <span className="text-destructive">*</span>
        </Label>
        <Input
          id="start_time"
          name="start_time"
          type="time"
          required
          className={state.errors?.start_time ? 'border-destructive' : ''}
        />
        {state.errors?.start_time && <p className="text-sm text-destructive">{state.errors.start_time[0]}</p>}
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="end_time">
          Ora de Sfârșit <span className="text-destructive">*</span>
        </Label>
        <Input
          id="end_time"
          name="end_time"
          type="time"
          required
          className={state.errors?.end_time ? 'border-destructive' : ''}
        />
        {state.errors?.end_time && <p className="text-sm text-destructive">{state.errors.end_time[0]}</p>}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Anulează
        </Button>
        <SubmitButton idleText="Adaugă" pendingText="Se adaugă..." disabled={isPending} />
      </DialogFooter>
    </form>
  )
}
