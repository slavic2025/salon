'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionForm } from '@/hooks/useActionForm'
import { updatePasswordAction } from '@/features/auth/actions'
import { objectToFormData } from '@/lib/form-utils'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { SubmitButton } from '@/components/molecules/submit-button'
import { AUTH_CONSTANTS } from '@/core/domains/auth/auth.constants'
import { INITIAL_FORM_STATE, type ActionResponse, type ZodFieldErrors } from '@/types/actions.types'
import { SetPasswordFormInput, setPasswordFormSchema } from '@/core/domains/auth/auth.types'

/**
 * Un organism "dumb" care gestionează formularul de setare a parolei.
 */
export function SetPasswordForm() {
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm<
    ActionResponse<{ message: string }, ZodFieldErrors>,
    FormData
  >({
    action: updatePasswordAction as any,
    initialState: {
      ...INITIAL_FORM_STATE,
      data: { message: '' },
    },
    onSuccess: () => {
      // La succes, facem redirect către pagina principală a dashboard-ului
      window.location.href = AUTH_CONSTANTS.PATHS.redirect.stylistHome
    },
  })

  const form = useForm<SetPasswordFormInput>({
    resolver: zodResolver(setPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // Funcția care conectează react-hook-form cu Server Action-ul
  const onSubmit = (values: SetPasswordFormInput) => {
    // Nu mai este nevoie să trimitem `confirmPassword` la server
    const payload = { password: values.password }
    const formData = objectToFormData(payload)

    startTransition(() => {
      formSubmit(formData)
    })
  }

  const isFormPending = isActionPending || isTransitionPending

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parolă Nouă</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} disabled={isFormPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmă Parola</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} disabled={isFormPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SubmitButton className="w-full" isPending={isFormPending}>
          Setează Parola
        </SubmitButton>
      </form>
    </Form>
  )
}
