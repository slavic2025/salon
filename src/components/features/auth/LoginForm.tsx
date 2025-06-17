'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useActionForm } from '@/hooks/useActionForm'
import { signInAction } from '@/features/auth/actions'
import { SignInResult, signInSchema, type SignInInput } from '@/core/domains/auth/auth.types'
import type { ActionResponse } from '@/types/actions.types'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SubmitButton } from '@/components/ui/submit-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// Tipul pentru rezultatul de succes al acțiunii de sign-in
type SignInSuccessData = {
  redirectPath?: string
}

export function LoginForm() {
  // Pasul 1: Inițializăm hook-ul de acțiune
  // `formSubmit` este funcția pe care o vom apela pentru a trimite datele.
  // `isPending` ne va spune dacă acțiunea este în curs de execuție.
  const { formSubmit, isPending } = useActionForm<ActionResponse<SignInResult>, FormData>({
    action: signInAction,
    initialState: { success: false },
    onSuccess: (data) => {
      // Când acțiunea are succes, verificăm dacă avem o cale de redirectare
      if (data?.redirectPath) {
        window.location.href = data.redirectPath
      }
    },
  })

  // Pasul 2: Inițializăm react-hook-form pentru validare pe client
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Pasul 3: Definim funcția de submit care face legătura între cele două hook-uri
  // Această funcție este apelată de `react-hook-form` DOAR dacă validarea pe client trece.
  const onSubmit = (values: SignInInput) => {
    // Convertim obiectul validat `values` în `FormData`, formatul așteptat de Server Action.
    const formData = new FormData()
    // Folosim un loop pentru a adăuga dinamic toate câmpurile
    for (const key in values) {
      formData.append(key, values[key as keyof SignInInput])
    }

    // Apelăm acțiunea de pe server cu datele din formular
    formSubmit(formData)
  }

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

            <SubmitButton className="w-full" isPending={isPending}>
              Autentifică-te
            </SubmitButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
