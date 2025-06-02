// app/admin/services/components/empty-state.tsx
import { InfoIcon } from 'lucide-react' // Asigură-te că lucide-react este instalat

interface EmptyStateProps {
  message?: string
  description?: string
}

export function EmptyState({ message = 'Nu există date disponibile.', description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
      <InfoIcon className="h-12 w-12 text-gray-400 mb-4" aria-hidden="true" />
      <p className="text-lg font-semibold mb-2">{message}</p>
      {description && <p className="text-sm">{description}</p>}
    </div>
  )
}
