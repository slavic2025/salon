// src/app/(dashboard)/admin/stylists/_components/stylist-table-row.tsx
'use client'
import Link from 'next/link'
import { TableCell, TableRow } from '@/components/ui/table'
import { EditStylistDialog } from './edit-stylist-dialog'
import { ActiveBadge } from '@/components/ui/active-badge'
import { buttonVariants } from '@/components/ui/button'
import { Pencil, Scissors, Trash2 } from 'lucide-react' // Am adăugat Trash2 pentru consistență
import { cn } from '@/lib/utils'
import { Stylist } from '@/core/domains/stylists/stylist.types'
import { deleteStylistAction } from '@/features/stylists/actions'
import { GenericDeleteDialog } from '@/components/shared/generic-delete-dialog'
import { Button } from '@/components/ui/button' // Asigură-te că Button este importat

interface StylistTableRowProps {
  stylist: Stylist
}

export function StylistTableRow({ stylist }: StylistTableRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{stylist.name}</TableCell>
      <TableCell>{stylist.email}</TableCell>
      <TableCell>{stylist.phone || '-'}</TableCell>

      {/* Adăugăm clase pentru a trunchia textul lung */}
      <TableCell className="max-w-xs truncate" title={stylist.description || ''}>
        {stylist.description || '-'}
      </TableCell>

      <TableCell className="text-center">
        <ActiveBadge isActive={stylist.is_active} />
      </TableCell>

      {/* Folosim flexbox pentru a alinia și spația butoanele corect */}
      <TableCell className="flex items-center justify-end gap-2">
        <EditStylistDialog entity={stylist}>
          {/* Butonul de editare standard */}
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Pencil className="h-4 w-4" /> Editează
          </Button>
        </EditStylistDialog>

        <Link
          href={`/admin/stylists/${stylist.id}/services`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex items-center gap-1.5')}
        >
          <Scissors className="h-4 w-4" /> Servicii
        </Link>

        <GenericDeleteDialog
          deleteAction={deleteStylistAction}
          entityId={stylist.id}
          entityName={stylist.name}
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
