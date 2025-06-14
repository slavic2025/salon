import { Loader2 } from 'lucide-react'
import type { Stylist } from '@/core/domains/stylists/stylist.types'
import { useStylists } from '@/hooks/use-stylists'
import { StylistCard } from './stylist-card'
import { StylistHeader } from './stylist-header'
import { StylistEmptyState } from './stylist-empty-state'
import { StylistErrorState } from './stylist-error-state'

interface StylistStepProps {
  serviceId: string
  onSelect: (stylist: Stylist) => void
  onBack: () => void
}

export function StylistStep({ serviceId, onSelect, onBack }: StylistStepProps) {
  const { stylists, loading, error } = useStylists(serviceId)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (error) {
    return <StylistErrorState error={error} onBack={onBack} />
  }

  if (stylists.length === 0) {
    return <StylistEmptyState onBack={onBack} />
  }

  return (
    <div className="space-y-6">
      <StylistHeader onBack={onBack} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stylists.map((stylist) => (
          <StylistCard key={stylist.id} stylist={stylist} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}
