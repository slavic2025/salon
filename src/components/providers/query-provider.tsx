'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

interface QueryProviderProps {
  children: React.ReactNode
}

/**
 * O componentă de tip "provider" care configurează și oferă
 * clientul TanStack Query pentru întreaga aplicație.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Creăm o singură instanță a clientului pentru a evita re-crearea la fiecare randare
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Adăugăm Devtools pentru a ne ajuta la debugging în dezvoltare */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
