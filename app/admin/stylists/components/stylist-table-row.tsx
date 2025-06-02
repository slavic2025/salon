// app/admin/stylists/components/stylist-table-row.tsx
'use client'

import { TableCell, TableRow } from '@/components/ui/table'
import { SubmitButton } from '@/components/ui/submit-button'
import { Stylist } from '@/lib/db/stylist-core' // Importă tipul Stylist
import { deleteStylistActionForm } from '@/app/admin/stylists/actions' // Importă acțiunea de ștergere
import { EditStylistDialog } from '@/app/admin/stylists/components/edit-stylist-dialog' // Va trebui să creezi acest component

interface StylistTableRowProps {
  stylist: Stylist
}

// Componenta ActiveBadge poate fi reutilizată, deoarece logica e aceeași
function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span className={isActive ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
      {isActive ? 'Da' : 'Nu'}
    </span>
  )
}

export function StylistTableRow({ stylist }: StylistTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium text-left border-r">{stylist.name}</TableCell>
      <TableCell className="text-left border-r">{stylist.email}</TableCell>
      <TableCell className="text-left border-r">{stylist.phone || '-'}</TableCell>
      <TableCell className="text-left border-r whitespace-normal break-words max-w-xs ">
        {stylist.description || '-'}
      </TableCell>
      <TableCell className="text-center border-r">
        {' '}
        {/* Centrat pentru ActiveBadge */}
        <ActiveBadge isActive={stylist.is_active} />
      </TableCell>
      <TableCell className="flex items-center gap-2">
        {/* Butonul de editare deschide dialogul de editare */}
        <EditStylistDialog stylist={stylist} />
        {/* Formularul de ștergere, cu butonul de submit */}
        <form action={deleteStylistActionForm} className="inline-block">
          <input type="hidden" name="id" value={stylist.id} />
          <SubmitButton variant="destructive" size="sm" aria-label={`Șterge stilistul ${stylist.name}`}>
            Șterge
          </SubmitButton>
        </form>
      </TableCell>
    </TableRow>
  )
}
