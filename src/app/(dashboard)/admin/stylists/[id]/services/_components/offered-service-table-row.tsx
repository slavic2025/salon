// src/app/(dashboard)/admin/stylists/[id]/services/_components/offered-service-table-row.tsx
'use client'

import { TableCell, TableRow } from '@/components/atoms/table'
import { ActiveBadge } from '@/components/molecules/active-badge'
import { EditOfferedServiceDialog } from './edit-offered-service-dialog'
import { GenericDeleteDialog } from '@/components/shared/generic-delete-dialog'
import { deleteOfferedServiceAction } from '@/features/services-offered/actions'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'
import { Tables } from '@/types/database.types'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'
import { Button } from '@/components/atoms/button'
import { Pencil, Trash2 } from 'lucide-react'

interface OfferedServiceTableRowProps {
  offeredService: ServiceOffered
  availableServices: Tables<'services'>[]
}

export function OfferedServiceTableRow({ offeredService, availableServices }: OfferedServiceTableRowProps) {
  const baseService = offeredService.services

  return (
    <TableRow key={offeredService.id}>
      <TableCell className="font-medium">{baseService?.name || 'N/A'}</TableCell>
      <TableCell className="text-right">
        {offeredService.custom_price !== null ? (
          `${Math.round(offeredService.custom_price)} ${DEFAULT_CURRENCY_SYMBOL}`
        ) : (
          <span className="text-muted-foreground">Standard</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {offeredService.custom_duration !== null ? (
          `${offeredService.custom_duration} min`
        ) : (
          <span className="text-muted-foreground">Standard</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {baseService?.price ? `${Math.round(baseService.price)} ${DEFAULT_CURRENCY_SYMBOL}` : 'N/A'}
      </TableCell>
      <TableCell className="text-right">
        {baseService?.duration_minutes ? `${baseService.duration_minutes} min` : 'N/A'}
      </TableCell>
      <TableCell className="text-center">
        <ActiveBadge isActive={offeredService.is_active} />
      </TableCell>

      {/* AICI ESTE MODIFICAREA CHEIE: Clasele pentru aliniere și spațiere */}
      <TableCell className="flex items-center justify-end gap-2">
        <EditOfferedServiceDialog
          offeredService={offeredService}
          availableServices={availableServices}
          trigger={
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Pencil className="h-4 w-4" /> Editează
            </Button>
          }
        />
        <GenericDeleteDialog
          deleteAction={deleteOfferedServiceAction}
          entityId={offeredService.id}
          entityName={baseService?.name || 'acest serviciu oferit'}
          revalidationId={offeredService.stylist_id}
          trigger={
            <Button variant="destructive" size="sm" className="flex items-center gap-1.5">
              <Trash2 className="h-4 w-4" /> Șterge
            </Button>
          }
        />
      </TableCell>
    </TableRow>
  )
}
