import { EmptyState } from '@/components/ui/empty-state'
import { AlertCircle } from 'lucide-react'
import { StylistHeader } from './stylist-header'

interface StylistErrorStateProps {
  error: string
  onBack: () => void
}

export function StylistErrorState({ error, onBack }: StylistErrorStateProps) {
  return (
    <div className="space-y-6">
      <StylistHeader onBack={onBack} />
      <EmptyState title="Eroare" description={error} icon={<AlertCircle className="h-8 w-8 text-red-500" />} />
    </div>
  )
}
