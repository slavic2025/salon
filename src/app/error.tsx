// app/error.tsx
'use client' // <<<--- ACEASTA ESTE OBLIGATORIE pentru error.tsx

import { useEffect } from 'react'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { createLogger } from '@/lib/logger' // Asigură-te că și logger-ul este disponibil global

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const logger = createLogger('GlobalErrorPage') // Numele logger-ului poate fi schimbat

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Loghează eroarea la un serviciu de monitorizare erori, de exemplu Sentry, DataDog etc.
    logger.error('Global Application Error:', { message: error.message, stack: error.stack, digest: error.digest })
  }, [error])

  return (
    // Componentele error.tsx ar trebui să-și redea propriul UI de eroare
    // în locul conținutului care a provocat eroarea.
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 md:p-6 lg:p-8 text-center bg-red-50 rounded-lg border border-red-200">
      <XCircle className="h-16 w-16 text-red-500 mb-4" aria-hidden="true" />
      <h2 className="text-xl font-bold text-red-700 mb-2">A apărut o eroare neașteptată!</h2>
      <p className="text-gray-700 mb-6">Ne cerem scuze pentru inconvenient. Vă rugăm să încercați din nou.</p>
      {process.env.NODE_ENV === 'development' && (
        <p className="text-sm text-red-600 mb-4">Detalii eroare: {error.message}</p>
      )}
      <Button
        onClick={
          // Încearcă să resetezi starea Boundary-ului de eroare
          // ceea ce va încerca să redea segmentul afectat.
          () => reset()
        }
      >
        Reîncărcați pagina
      </Button>
    </div>
  )
}
