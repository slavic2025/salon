// app/admin/services/components/service-table-row.tsx
'use client' // Asigură-te că este o componentă client-side

import { TableCell, TableRow } from '@/components/ui/table'
import { SubmitButton } from '@/components/ui/submit-button'
import { EditServiceDialog } from '@/app/admin/services/_components/edit-service-dialog'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'
import { ActiveBadge } from '@/components/ui/active-badge'
import { useActionState, useEffect } from 'react' // <-- Importă useActionState și useEffect
import { toast } from 'sonner' // <-- Importă toast pentru feedback
import { INITIAL_FORM_STATE } from '@/types/types' // <-- Importă starea inițială generică
import { deleteServiceAction } from '@/features/services/actions'
import { Service } from '@/core/domains/services/service.types'

interface ServiceTableRowProps {
  service: Service
}

export function ServiceTableRow({ service }: ServiceTableRowProps) {
  // 1. Utilizează useActionState pentru acțiunea de ștergere
  const [deleteState, deleteFormAction, isPending] = useActionState(
    deleteServiceAction, // <-- Folosește deleteServiceAction direct
    INITIAL_FORM_STATE
  )

  // 2. Utilizează useEffect pentru a afișa toast-uri pe baza stării deleteState
  useEffect(() => {
    // Verificăm dacă mesajul este definit pentru a evita toast-uri la prima randare (INITIAL_FORM_STATE)
    if (deleteState.message) {
      if (deleteState.success) {
        toast.success('Succes!', {
          description: deleteState.message,
        })
      } else {
        toast.error('Eroare!', {
          description: deleteState.message,
        })
      }
    }
  }, [deleteState]) // Se declanșează la fiecare schimbare a stării

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
        {/* 3. Actualizează prop-ul pentru EditServiceDialog la 'entity' */}
        <EditServiceDialog entity={service} /> {/* <-- Modificat */}
        {/* 4. Folosește deleteFormAction returnat de useActionState */}
        <form action={deleteFormAction} className="inline-block">
          {' '}
          {/* <-- Modificat */}
          <input type="hidden" name="id" value={service.id} />
          <SubmitButton
            variant="destructive"
            size="sm"
            aria-label={`Șterge serviciul ${service.name}`}
            disabled={isPending} // Dezactivează butonul în timpul acțiunii
          >
            Șterge
          </SubmitButton>
        </form>
      </TableCell>
    </TableRow>
  )
}
