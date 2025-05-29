// components/auth/LoginForm.tsx
'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

// Importă schema de login din utils/zod.ts
import { loginSchema } from '@/utils/zod'
import { z } from 'zod' // Necesit pentru `z.infer`

// Importă componentele shadcn/ui (asigură-te că ai adăugat componenta 'form' cu comanda de mai sus)
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

// Server Action pentru login
import { signIn } from '@/app/auth/actions'

type LoginInput = z.infer<typeof loginSchema>

export const LoginForm: React.FC = () => {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null) // Resetează erorile de la server înainte de o nouă încercare
    form.clearErrors() // Curăță erorile de validare ale formularului de la încercările anterioare

    try {
      const result = await signIn(data.email, data.password)

      if (result?.error) {
        setServerError(result.error)
        // Opțional: dacă vrei să mapezi erorile de la server la câmpuri specifice:
        // if (result.error.includes('email')) form.setError('email', { message: result.error });
        // else if (result.error.includes('parola')) form.setError('password', { message: result.error });
      } else {
        // Curățăm formularul după un login reușit (deși va urma o redirecționare)
        form.reset()
        router.push('/admin/appointments') // Redirecționare la dashboard-ul de administrare
        router.refresh() // Forțează o reîmprospătare a datelor de sesiune pe server
      }
    } catch (error) {
      console.error('Login submission client-side error:', error)
      setServerError('A apărut o eroare neașteptată. Te rugăm să încerci din nou.')
    }
  }

  return (
    // Înfășurăm formularul cu componenta <Form> de la shadcn/ui
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Câmpul Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adresă de email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="nume@exemplu.com"
                  {...field} // Aici se leagă câmpul de React Hook Form
                />
              </FormControl>
              <FormMessage /> {/* Afișează mesajele de eroare RHF */}
            </FormItem>
          )}
        />

        {/* Câmpul Parolă */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parolă</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...field} // Aici se leagă câmpul de React Hook Form
                />
              </FormControl>
              <FormMessage /> {/* Afișează mesajele de eroare RHF */}
            </FormItem>
          )}
        />

        {/* Mesaj de Eroare de la Server */}
        {serverError && (
          <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <AlertTitle>Eroare de Autentificare</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        {/* Buton de Submit */}
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting} // Dezactivează butonul în timpul submisiunii
        >
          {form.formState.isSubmitting ? 'Autentificare...' : 'Autentifică-te'}
        </Button>
      </form>
    </Form>
  )
}
