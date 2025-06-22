'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { Textarea } from '@/components/atoms/textarea'
import { Checkbox } from '@/components/atoms/checkbox'
import { SubmitButton } from '@/components/molecules/submit-button'
import {
  createStylistFormSchema,
  type CreateStylistFormInput,
  type Stylist,
} from '@/core/domains/stylists/stylist.types'

interface StylistFormProps {
  initialData?: Stylist
  onSubmit: (data: CreateStylistFormInput) => void
  isPending: boolean
  className?: string
}

export function StylistForm({ initialData, onSubmit, isPending, className }: StylistFormProps) {
  const form = useForm<CreateStylistFormInput>({
    resolver: zodResolver(createStylistFormSchema),
    defaultValues: {
      full_name: initialData?.full_name ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      description: initialData?.description ?? '',
      is_active: initialData?.is_active ?? true,
      profile_picture: undefined,
    },
  })

  const isEditing = Boolean(initialData)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nume Complet</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isPending} maxLength={100} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={isPending} maxLength={255} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefon</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} disabled={isPending} maxLength={20} />
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
                  <Textarea {...field} disabled={isPending} maxLength={500} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profile_picture"
            render={({ field: { onChange, value, ...field } }) => (
              <FormItem>
                <FormLabel>Imagine de Profil</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      onChange(file)
                    }}
                    disabled={isPending}
                    {...field}
                  />
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
          <SubmitButton isPending={isPending}>{isEditing ? 'Actualizează Stilistul' : 'Creează Stilist'}</SubmitButton>
        </div>
      </form>
    </Form>
  )
}
