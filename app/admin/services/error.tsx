// app/admin/services/error.tsx
'use client'

import { useEffect } from 'react'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createLogger } from '@/lib/logger'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

const logger = createLogger('AdminServicesErrorPage')

export default function AdminServicesError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    logger.error('AdminServicesPage Error:', { message: error.message, stack: error.stack, digest: error.digest })
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 md:p-6 lg:p-8 text-center bg-red-50 rounded-lg border border-red-200">
      <XCircle className="h-16 w-16 text-red-500 mb-4" aria-hidden="true" />
      <h2 className="text-xl font-bold text-red-700 mb-2">Oups! Ceva nu a mers bine.</h2>
      <p className="text-gray-700 mb-6">Am întâmpinat o eroare la încărcarea serviciilor.</p>
      {/* Opțional, afișează un mesaj de eroare mai detaliat în modul de dezvoltare */}
      {process.env.NODE_ENV === 'development' && (
        <p className="text-sm text-red-600 mb-4">Detalii eroare: {error.message}</p>
      )}
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Reîncărcați pagina
      </Button>
    </div>
  )
}
