'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { Checkbox } from '@/components/atoms/checkbox'
import { SubmitButton } from '@/components/molecules/submit-button'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/atoms/select'
import { createServiceSchema, type CreateServiceInput, type Service } from '@/core/domains/services/service.types'
import { SERVICE_CONSTANTS } from '@/core/domains/services/service.constants'

interface ServiceFormProps {
  initialData?: Service
  onSubmit: (data: CreateServiceInput) => void
  isPending: boolean
  className?: string
}

export function ServiceForm({ initialData, onSubmit, isPending, className }: ServiceFormProps) {
  const form = useForm<CreateServiceInput>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      description: initialData?.description ?? '',
      duration_minutes: initialData?.duration_minutes ?? 30,
      price: initialData?.price ?? 50,
      is_active: initialData?.is_active ?? true,
      category: initialData?.category ?? '',
    },
  })

  const isEditing = Boolean(initialData)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nume Serviciu</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    maxLength={SERVICE_CONSTANTS.FORM_CONSTRAINTS.NAME_MAX_LENGTH}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descriere</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={isPending}
                    maxLength={SERVICE_CONSTANTS.FORM_CONSTRAINTS.DESCRIPTION_MAX_LENGTH}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration_minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Durată (minute)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={SERVICE_CONSTANTS.FORM_CONSTRAINTS.DURATION.MIN}
                    max={SERVICE_CONSTANTS.FORM_CONSTRAINTS.DURATION.MAX}
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preț (RON)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={SERVICE_CONSTANTS.FORM_CONSTRAINTS.PRICE.MIN}
                    max={SERVICE_CONSTANTS.FORM_CONSTRAINTS.PRICE.MAX}
                    step="0.01"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categorie</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Alege categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SERVICE_CONSTANTS.CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                </FormControl>
                <FormLabel className="mb-0">Activ</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end pt-6">
          <SubmitButton isPending={isPending}>{isEditing ? 'Actualizează Serviciul' : 'Creează Serviciu'}</SubmitButton>
        </div>
      </form>
    </Form>
  )
}
