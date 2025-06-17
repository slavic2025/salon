import { LoginForm } from '@/components/features/auth/LoginForm'
import { createLogger } from '@/lib/logger'

// Aceasta este o componentă "Smart" (React Server Component).
// Rolul ei este de a construi structura paginii.
export default function LoginPage() {
  const logger = createLogger('LoginPage')
  logger.info('Rendering login page on the server...')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Salon-App</h1>
          <h2 className="mt-2 text-xl text-gray-600">Autentifică-te în contul tău</h2>
        </div>

        {/* Delegăm toată logica și interactivitatea componentei "Dumb" */}
        <LoginForm />
      </div>
    </div>
  )
}
