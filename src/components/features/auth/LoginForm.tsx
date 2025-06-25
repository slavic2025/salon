'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionForm } from '@/hooks/useActionForm'
import { signInAction } from '@/features/auth/actions'
import { objectToFormData } from '@/lib/form-utils'
import { signInFormSchema, type SignInFormInput } from '@/core/domains/auth/auth.types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/atoms/form'
import { Input } from '@/components/atoms/input'
import { SubmitButton } from '@/components/molecules/submit-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/atoms/alert'
import { AlertCircle } from 'lucide-react'

export function LoginForm() {
  const [isTransitionPending, startTransition] = useTransition()

  // 1. Hook-ul `useActionForm` este acum mai simplu. Nu mai avem nevoie de `onSuccess`.
  // Starea `state` va conține mesajul de eroare în caz de eșec.
  const {
    formSubmit,
    isPending: isActionPending,
    state,
  } = useActionForm({
    action: signInAction,
    initialState: { success: false },
  })

  const form = useForm<SignInFormInput>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: '', password: '' },
  })

  // 2. Funcția `onSubmit` este curată. Validează, apoi trimite la server.
  const onSubmit = (values: SignInFormInput) => {
    const formData = objectToFormData(values)
    startTransition(() => {
      formSubmit(formData)
    })
  }

  const isFormPending = isActionPending || isTransitionPending

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Autentificare</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* 3. Afișăm elegant eroarea generală de la server, dacă există */}
            {!state.success && state.message && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Eroare de Autentificare</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresă de email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="nume@exemplu.com" {...field} disabled={isFormPending} />
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
                    <Input type="password" placeholder="••••••••" {...field} disabled={isFormPending} />
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
