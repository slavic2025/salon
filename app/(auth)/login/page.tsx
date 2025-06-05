// app/login/page.tsx
import { createLogger } from '@/lib/logger'
import { LoginForm } from '@/components/features/auth/LoginForm' // Vom crea acest component în curând

const logger = createLogger('LoginPage')

export default function LoginPage() {
  logger.info('LoginPage rendered.')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Autentifică-te în contul tău
          </h2>
        </div>
        <LoginForm /> {/* Componentul cu formularul de login */}
      </div>
    </div>
  )
}
