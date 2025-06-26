'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionForm } from '@/hooks/useActionForm'
import { addServiceOfferedAction } from '@/features/services-offered/actions'
import { objectToFormData } from '@/lib/form-utils'
import { type Service } from '@/core/domains/services/service.types'
import {
  CreateServiceOfferedInput,
  createServiceOfferedSchema,
  type ServiceOfferedCreateData,
} from '@/core/domains/services-offered/services-offered.types'

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
    action: addServiceOfferedAction,
    initialState: { success: false },
  })

  const form = useForm<ServiceOfferedCreateData>({
    resolver: zodResolver(createServiceOfferedSchema),
    defaultValues: {
      stylist_id: stylistId,
      service_id: '',
    },
  })

  const onSubmit = (values: CreateServiceOfferedInput) => {
    const formData = objectToFormData(values)
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
        {/* Câmp ascuns pentru a trimite ID-ul stilistului */}
        <input type="hidden" {...form.register('stylist_id')} value={stylistId} />

        <SubmitButton isPending={isFormPending} className="w-full">
          Atribuie Serviciu
        </SubmitButton>
      </form>
    </Form>
  )
}
