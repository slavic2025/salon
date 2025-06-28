'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionForm } from '@/hooks/useActionForm'
import { addServiceToStylistAction } from '@/features/services-offered/actions'
import { objectToFormData } from '@/lib/form-utils'
import { type Service } from '@/core/domains/services/service.types'
import {
  addServiceToStylistFormSchema,
  AddServiceToStylistInput,
  addServiceToStylistSchema,
} from '@/core/domains/services-offered/service-offered.types'

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select'
import { SubmitButton } from '@/components/molecules/submit-button'

interface AddServiceToStylistFormProps {
  stylistId: string
  availableServices: Service[]
}

export function AddServiceToStylistForm({ stylistId, availableServices }: AddServiceToStylistFormProps) {
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm({
    action: addServiceToStylistAction,
    initialState: { success: false },
  })

  const form = useForm<AddServiceToStylistInput>({
    resolver: zodResolver(addServiceToStylistFormSchema),
    defaultValues: {
      service_id: '',
      custom_price: undefined,
      custom_duration: undefined,
    },
  })

  const onSubmit = (values: AddServiceToStylistInput) => {
    const payload = {
      ...values,
      stylist_id: stylistId,
    }
    const formData = objectToFormData(payload)

    startTransition(() => {
      formSubmit(formData)
    })
  }

  const isFormPending = isActionPending || isTransitionPending

  // Dacă nu mai sunt servicii de adăugat, afișăm o stare de gol.
  if (availableServices.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground p-4 border-dashed border rounded-md">
        Toți stiliștii au fost deja adăugați.
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="service_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serviciu Disponibil</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isFormPending}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selectează un serviciu..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableServices.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton isPending={isFormPending} className="w-full">
          Atribuie Serviciu
        </SubmitButton>
      </form>
    </Form>
  )
}
