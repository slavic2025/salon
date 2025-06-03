// app/loading.tsx
import { Loader2 } from 'lucide-react'

export default function GlobalLoading() {
  // Poți schimba numele funcției, dar exportul default e important
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-4 md:p-6 lg:p-8">
      <Loader2 className="h-16 w-16 animate-spin text-primary" aria-label="Loading content..." />
      <p className="mt-4 text-lg text-gray-600">Încărcăm conținutul, vă rugăm așteptați...</p>
    </div>
  )
}
