'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { Input } from '@/components/atoms/input'
import { SubmitButton } from '@/components/molecules/submit-button'
import {
  createWorkScheduleSchema,
  type CreateWorkScheduleInput,
} from '@/core/domains/work-schedules/work-schedule.types'
import { WORK_SCHEDULE_CONSTANTS } from '@/core/domains/work-schedules/work-schedule.constants'

interface WorkScheduleFormProps {
  // `stylistId` este pasat ca prop pentru a nu mai fi un câmp în formular
  stylistId: string
  onSubmit: (data: CreateWorkScheduleInput) => void
  isPending: boolean
}

export function WorkScheduleForm({ stylistId, onSubmit, isPending }: WorkScheduleFormProps) {
  const form = useForm<CreateWorkScheduleInput>({
    resolver: zodResolver(createWorkScheduleSchema),
    defaultValues: {
      stylistId: stylistId, // Setăm ID-ul stilistului primit ca prop
      weekday: 'monday',
      startTime: '09:00',
      endTime: '17:00',
    },
  })

  // Ne asigurăm că `stylistId` este mereu inclus la submit, chiar dacă nu e un câmp vizibil
  const handleFormSubmit = (values: CreateWorkScheduleInput) => {
    onSubmit({ ...values, stylistId })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="grid gap-4 py-4">
        <FormField
          control={form.control}
          name="weekday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ziua Săptămânii</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează o zi" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(WORK_SCHEDULE_CONSTANTS.WEEKDAYS).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ora de Început</FormLabel>
                <FormControl>
                  <Input type="time" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ora de Sfârșit</FormLabel>
                <FormControl>
                  <Input type="time" {...field} disabled={isPending} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-4">
          <SubmitButton isPending={isPending}>Adaugă Interval</SubmitButton>
        </div>
      </form>
    </Form>
  )
}
