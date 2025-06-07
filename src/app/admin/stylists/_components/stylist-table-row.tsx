// app/admin/stylists/components/stylist-table-row.tsx
'use client'

import Link from 'next/link' // Importă Link
import { TableCell, TableRow } from '@/components/ui/table'
import { SubmitButton } from '@/components/ui/submit-button'
import { EditStylistDialog } from '@/app/admin/stylists/_components/edit-stylist-dialog'
import { ActiveBadge } from '@/components/ui/active-badge'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { INITIAL_FORM_STATE } from '@/types/types'
import { Button, buttonVariants } from '@/components/ui/button' // Importă Button și buttonVariants
import { Scissors } from 'lucide-react' // Sau altă iconiță relevantă
import { cn } from '@/lib/utils' //
import { deleteStylistAction } from '@/features/stylists/actions'
import { Stylist } from '@/core/domains/stylists/stylist.types'

interface StylistTableRowProps {
  stylist: Stylist
}

export function StylistTableRow({ stylist }: StylistTableRowProps) {
  const [deleteState, deleteFormAction, isPending] = useActionState(deleteStylistAction, INITIAL_FORM_STATE)

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
      <TableCell className="flex items-center justify-end gap-2">
        {' '}
        {/* Am adăugat justify-end pentru aliniere */}
        <EditStylistDialog entity={stylist} />
        {/* Link către pagina de servicii a stilistului */}
        <Link
          href={`/admin/stylists/${stylist.id}/services`}
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            'flex items-center' // Asigură alinierea iconiței cu textul
          )}
          aria-label={`Gestionează serviciile pentru ${stylist.name}`}
        >
          <Scissors className="mr-2 h-4 w-4" /> {/* Iconiță */}
          Servicii
        </Link>
        <form action={deleteFormAction} className="inline-block">
          <input type="hidden" name="id" value={stylist.id} />
          <SubmitButton
            variant="destructive"
            size="sm"
            aria-label={`Șterge stilistul ${stylist.name}`}
            disabled={isPending}
          >
            Șterge
          </SubmitButton>
        </form>
      </TableCell>
    </TableRow>
  )
}
