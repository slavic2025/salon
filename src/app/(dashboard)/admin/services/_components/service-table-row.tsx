// src/app/(dashboard)/admin/services/_components/service-table-row.tsx
'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { EditServiceDialog } from './edit-service-dialog'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'
import { ActiveBadge } from '@/components/ui/active-badge'
import { Service } from '@/core/domains/services/service.types'
import { deleteServiceAction } from '@/features/services/actions'
import { GenericDeleteDialog } from '@/components/shared/generic-delete-dialog'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'

interface ServiceTableRowProps {
  service: Service
}

export function ServiceTableRow({ service }: ServiceTableRowProps) {
  // Am eliminat logica `useActionState` de aici, deoarece este gestionată de GenericDeleteDialog
  return (
    <TableRow>
      <TableCell className="font-medium">{service.name}</TableCell>
      <TableCell className="max-w-xs truncate" title={service.description || ''}>
        {service.description || '-'}
      </TableCell>

      {/* Aliniem la dreapta celulele numerice */}
      <TableCell className="text-right">{service.duration_minutes}</TableCell>
      <TableCell className="text-right">
        {service.price} {DEFAULT_CURRENCY_SYMBOL}
      </TableCell>

      <TableCell>{service.category || '-'}</TableCell>

      {/* Aliniem la centru conținutul celulei "Activ" */}
      <TableCell className="text-center">
        <ActiveBadge isActive={service.is_active} />
      </TableCell>

      {/* Folosim flexbox pentru a alinia și spația butoanele */}
      <TableCell className="flex items-center justify-end gap-2">
        <EditServiceDialog entity={service}>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Pencil className="h-4 w-4" /> Editează
          </Button>
        </EditServiceDialog>

        <GenericDeleteDialog
          deleteAction={deleteServiceAction}
          entityId={service.id}
          entityName={service.name}
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
