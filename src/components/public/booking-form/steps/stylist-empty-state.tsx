import { AlertCircle } from 'lucide-react'
import { StylistHeader } from './stylist-header'
import { STYLIST_MESSAGES } from '@/lib/constants'

interface StylistEmptyStateProps {
  onBack: () => void
}

export function StylistEmptyState({ onBack }: StylistEmptyStateProps) {
  return (
    <div className="space-y-6">
      <StylistHeader onBack={onBack} />
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">{STYLIST_MESSAGES.NO_STYLISTS.TITLE}</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>{STYLIST_MESSAGES.NO_STYLISTS.DESCRIPTION}</p>
              <ul className="mt-2 list-disc list-inside space-y-1">
                {STYLIST_MESSAGES.NO_STYLISTS.OPTIONS.map((option, index) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
