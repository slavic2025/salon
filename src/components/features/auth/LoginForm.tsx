'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionForm } from '@/hooks/useActionForm'
import { signInAction } from '@/features/auth/actions'
import { SignInResult, signInSchema, type SignInInput } from '@/core/domains/auth/auth.types'
import type { ActionResponse } from '@/types/actions.types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { SubmitButton } from '@/components/molecules/submit-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { useTransition } from 'react'
import { objectToFormData } from '@/lib/form-utils'

// Tipul pentru rezultatul de succes al acțiunii de sign-in
type SignInSuccessData = {
  redirectPath?: string
}

export function LoginForm() {
  // Pasul 2: Inițializăm hook-ul `useTransition`.
  // `isTransitionPending` ne va spune dacă tranziția este activă.
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm<ActionResponse<SignInResult>, FormData>({
    action: signInAction,
    initialState: { success: false },
    onSuccess: (data) => {
      if (data?.redirectPath) {
        window.location.href = data.redirectPath
      }
    },
  })

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = (values: SignInInput) => {
    const formData = objectToFormData(values)

    // Pasul 3: Împachetăm apelul la acțiune în `startTransition`.
    startTransition(() => {
      formSubmit(formData)
    })
  }

  // Combinăm cele două stări de pending pentru o reflectare corectă în UI
  const isFormPending = isActionPending || isTransitionPending

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          {/* Pasul 4: Conectăm funcția noastră `onSubmit` la formular folosind `form.handleSubmit` */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresă de email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nume@exemplu.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parolă</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SubmitButton className="w-full" isPending={isFormPending}>
              Autentifică-te
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
