'use client'

import { useCallback } from 'react'
import type { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'
import { deleteServiceOfferedAction } from '@/features/services-offered/actions'
import { formatCurrency } from '@/lib/formatters'

import { Button } from '@/components/atoms/button'
import { DeleteConfirmationDialog } from '@/components/molecules/delete-confirmation-dialog'
import { Trash2 } from 'lucide-react'

interface OfferedServiceListProps {
  offeredServices: ServiceOffered[]
  stylistId: string
}

export function OfferedServiceList({ offeredServices, stylistId }: OfferedServiceListProps) {
  // ... logica pentru EmptyState

  // Handler custom care adaugă stylistId în FormData pentru revalidare
  const createDeleteAction = useCallback(
    (offeredServiceId: string) => {
      return async (prevState: any, formData: FormData) => {
        formData.set('id', offeredServiceId)
        formData.set('stylist_id', stylistId)
        return deleteServiceOfferedAction(prevState, formData)
      }
    },
    [stylistId]
  )

  return (
    <ul className="space-y-3">
      {offeredServices.map((offered) => (
        <li key={offered.id} className="flex items-center justify-between rounded-md bg-muted p-3">
          <div>
            {/* Acum putem accesa numele serviciului direct și în siguranță */}
            <p className="font-semibold">{offered.services?.name ?? 'Serviciu necunoscut'}</p>
            <p className="text-sm text-muted-foreground">
              {/* Afișăm prețul/durata customizată dacă există, altfel cea default a serviciului */}
              {formatCurrency(offered.custom_price ?? offered.services?.price ?? 0)}
              {' / '}
              {offered.custom_duration ?? offered.services?.duration_minutes ?? 0} min
            </p>
          </div>

          <DeleteConfirmationDialog action={createDeleteAction(offered.id)} itemId={offered.id}>
            <DeleteConfirmationDialog.Trigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </DeleteConfirmationDialog.Trigger>
            <DeleteConfirmationDialog.Content>
              <DeleteConfirmationDialog.Header>
                <DeleteConfirmationDialog.Title>Confirmă Eliminarea</DeleteConfirmationDialog.Title>
                <DeleteConfirmationDialog.Description>
                  Ești sigur că vrei să elimini serviciul "{offered.services?.name}" de la acest stilist?
                </DeleteConfirmationDialog.Description>
              </DeleteConfirmationDialog.Header>
            </DeleteConfirmationDialog.Content>
          </DeleteConfirmationDialog>
        </li>
      ))}
    </ul>
  )
}
