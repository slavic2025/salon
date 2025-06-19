'use client'

import { TableCell, TableRow } from '@/components/atoms/table'
import { Button } from '@/components/atoms/button'
import { Pencil, Trash2 } from 'lucide-react'
import { ActiveBadge } from '@/components/molecules/active-badge'
import { EditServiceDialog } from './edit-service-dialog'
import { DeleteConfirmationDialog } from '@/components/molecules/delete-confirmation-dialog'
import { formatCurrency } from '@/lib/formatters'
import { deleteServiceAction } from '@/features/services/actions'
import type { Service } from '@/core/domains/services/service.types'

interface ServiceTableRowProps {
  service: Service
}

export function ServiceTableRow({ service }: ServiceTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{service.name}</TableCell>
      <TableCell className="max-w-xs truncate" title={service.description ?? ''}>
        {service.description || '-'}
      </TableCell>
      <TableCell className="text-right">{service.duration_minutes} min</TableCell>

      {/* Folosim helper-ul pentru a formata prețul */}
      <TableCell className="text-right">{formatCurrency(service.price)}</TableCell>

      <TableCell>{service.category || '-'}</TableCell>
      <TableCell className="text-center">
        <ActiveBadge isActive={service.is_active} />
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-2">
          <EditServiceDialog service={service} />

          {/* Utilizarea noului dialog compus. Este mult mai declarativ. */}
          <DeleteConfirmationDialog action={deleteServiceAction} itemId={service.id}>
            <DeleteConfirmationDialog.Trigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Șterge</span>
              </Button>
            </DeleteConfirmationDialog.Trigger>
            <DeleteConfirmationDialog.Content>
              <DeleteConfirmationDialog.Header>
                <DeleteConfirmationDialog.Title>Confirmă Ștergerea</DeleteConfirmationDialog.Title>
                <DeleteConfirmationDialog.Description>
                  Ești sigur că vrei să ștergi serviciul "{service.name}"? Această acțiune este ireversibilă.
                </DeleteConfirmationDialog.Description>
              </DeleteConfirmationDialog.Header>
            </DeleteConfirmationDialog.Content>
          </DeleteConfirmationDialog>
        </div>
      </TableCell>
    </TableRow>
  )
}
