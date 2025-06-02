// app/admin/services/components/service-table-row.tsx
'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { SubmitButton } from '@/components/ui/submit-button'
import { ServiceData } from '@/app/admin/services/types'
import { deleteServiceActionForm } from '@/app/admin/services/actions'
import { EditServiceDialog } from '@/app/admin/services/components/edit-service-dialog'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

interface ServiceTableRowProps {
  service: ServiceData
}

export function ServiceTableRow({ service }: ServiceTableRowProps) {
  return (
    <TableRow key={service.id}>
      <TableCell className="font-medium">{service.name}</TableCell>
      <TableCell>{service.description}</TableCell>
      <TableCell>{service.duration_minutes}</TableCell>
      <TableCell>
        {service.price.toFixed(2)} {DEFAULT_CURRENCY_SYMBOL}
      </TableCell>
      <TableCell>{service.category}</TableCell>
      <TableCell>
        {service.is_active ? <span className="text-green-500">Da</span> : <span className="text-red-500">Nu</span>}
      </TableCell>
      <TableCell className="text-right flex items-center justify-end gap-2">
        <EditServiceDialog service={service} />
        <form action={deleteServiceActionForm} className="inline-block">
          {' '}
          <input type="hidden" name="id" value={service.id} />
          <SubmitButton variant="destructive" size="sm">
            Șterge
          </SubmitButton>
        </form>
      </TableCell>
    </TableRow>
  )
}
