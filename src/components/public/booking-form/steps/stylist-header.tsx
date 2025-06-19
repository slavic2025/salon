import { Button } from '@/components/atoms/button'
import { ArrowLeft } from 'lucide-react'

interface StylistHeaderProps {
  onBack: () => void
}

export function StylistHeader({ onBack }: StylistHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold leading-6 text-gray-900">Alege un stilist</h3>
        <p className="mt-1 text-sm text-gray-500">Selectează stilistul preferat pentru serviciul ales</p>
      </div>
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Înapoi
      </Button>
    </div>
  )
}
