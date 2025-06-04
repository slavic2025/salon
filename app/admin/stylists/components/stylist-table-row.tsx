// app/admin/stylists/components/stylist-table-row.tsx
'use client' // Trebuie să fie o componentă client-side pentru a folosi hook-uri React

import { TableCell, TableRow } from '@/components/ui/table'
import { SubmitButton } from '@/components/ui/submit-button'
import { EditStylistDialog } from '@/app/admin/stylists/components/edit-stylist-dialog'
import { ActiveBadge } from '@/components/ui/active-badge'
// Importă acțiunea de ștergere și hook-urile necesare
import { deleteStylistAction } from '../actions'
import { useActionState, useEffect } from 'react' // <-- Importă useActionState și useEffect
import { toast } from 'sonner' // <-- Importă toast pentru feedback
import { INITIAL_FORM_STATE } from '@/lib/types' // <-- Importă starea inițială generică
import { StylistData } from '../types'

interface StylistTableRowProps {
  stylist: StylistData
}

export function StylistTableRow({ stylist }: StylistTableRowProps) {
  // 1. Utilizează useActionState pentru acțiunea de ștergere
  const [deleteState, deleteFormAction, isPending] = useActionState(deleteStylistAction, INITIAL_FORM_STATE)

  // 2. Utilizează useEffect pentru a afișa toast-uri pe baza stării deleteState
  useEffect(() => {
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
  }, [deleteState])

  return (
    <TableRow>
      <TableCell className="font-medium text-left border-r">{stylist.name}</TableCell>
      <TableCell className="text-left border-r">{stylist.email}</TableCell>
      <TableCell className="text-left border-r">{stylist.phone || '-'}</TableCell>
      <TableCell className="text-left border-r whitespace-normal break-words max-w-xs ">
        {stylist.description || '-'}
      </TableCell>
      <TableCell className="text-center border-r">
        <ActiveBadge isActive={stylist.is_active} />
      </TableCell>
      <TableCell className="flex items-center gap-2">
        {/* 3. Actualizează prop-ul pentru EditStylistDialog la 'entity' */}
        <EditStylistDialog entity={stylist} />
        {/* 4. Folosește deleteFormAction returnat de useActionState */}
        <form action={deleteFormAction} className="inline-block">
          <input type="hidden" name="id" value={stylist.id} />
          <SubmitButton
            variant="destructive"
            size="sm"
            aria-label={`Șterge stilistul ${stylist.name}`}
            disabled={isPending} // Dezactivează butonul în timpul acțiunii
          >
            Șterge
          </SubmitButton>
        </form>
      </TableCell>
    </TableRow>
  )
}
