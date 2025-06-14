import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import type { Stylist } from '@/core/domains/stylists/stylist.types'
import { getStylistsByServiceAction } from '@/features/stylists/actions'

interface StylistStepProps {
  serviceId: string
  onSelect: (stylist: Stylist) => void
  onBack: () => void
}

export function StylistStep({ serviceId, onSelect, onBack }: StylistStepProps) {
  const [state, setState] = useState<{
    stylists: Stylist[]
    loading: boolean
    error: string | null
  }>({
    stylists: [],
    loading: true,
    error: null,
  })

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const result = await getStylistsByServiceAction(serviceId)
        if (result.success) {
          setState({
            stylists: result.data || [],
            loading: false,
            error: null,
          })
        } else {
          setState({
            stylists: [],
            loading: false,
            error: result.error || 'A apărut o eroare la încărcarea stilistilor.',
          })
        }
      } catch (error) {
        setState({
          stylists: [],
          loading: false,
          error: 'A apărut o eroare neașteptată.',
        })
      }
    }

    fetchStylists()
  }, [serviceId])

  if (state.loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="space-y-6">
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
        <EmptyState
          title="Eroare"
          description={state.error}
          icon={<AlertCircle className="h-8 w-8 text-red-500" />}
        />
      </div>
    )
  }

  if (state.stylists.length === 0) {
    return (
      <div className="space-y-6">
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
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Niciun stilist disponibil momentan
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Îmi pare rău, dar momentan nu avem stilisti disponibili pentru acest serviciu. Poți:
                </p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Alege un alt serviciu din lista noastră</li>
                  <li>Contactează-ne telefonic pentru a verifica disponibilitatea</li>
                  <li>Încearcă mai târziu, când ar putea fi disponibili stilisti</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.stylists.map((stylist) => (
          <button
            key={stylist.id}
            onClick={() => onSelect(stylist)}
            className="group flex items-center gap-4 rounded-lg border border-gray-300 bg-white p-4 text-left shadow-sm transition-all hover:border-indigo-500 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={stylist.profile_picture || undefined} alt={stylist.full_name} />
              <AvatarFallback>{stylist.full_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                {stylist.full_name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
} 