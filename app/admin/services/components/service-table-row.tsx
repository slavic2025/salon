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

function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
      {isActive ? 'Da' : 'Nu'}
    </span>
  )
}

export function ServiceTableRow({ service }: ServiceTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium text-left border-r">{service.name}</TableCell>
      <TableCell className="text-left border-r">{service.description || '-'}</TableCell>
      <TableCell className="text-right border-r">{service.duration_minutes}</TableCell>
      <TableCell className="text-right border-r">
        {service.price.toFixed(2)} {DEFAULT_CURRENCY_SYMBOL}
      </TableCell>
      <TableCell className="text-left border-r">{service.category || '-'}</TableCell>
      <TableCell className="text-right border-r">
        <ActiveBadge isActive={service.is_active} />
      </TableCell>
      <TableCell className="flex items-center gap-2">
        <EditServiceDialog service={service} />
        <form action={deleteServiceActionForm} className="inline-block">
          <input type="hidden" name="id" value={service.id} />
          <SubmitButton variant="destructive" size="sm" aria-label={`Șterge serviciul ${service.name}`}>
            Șterge
          </SubmitButton>
        </form>
      </TableCell>
    </TableRow>
  )
}
