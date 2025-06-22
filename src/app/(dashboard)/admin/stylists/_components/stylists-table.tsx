'use client'

import { type Stylist } from '@/core/domains/stylists/stylist.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/table'
import { ActiveBadge } from '@/components/molecules/active-badge'
import { DeleteConfirmationDialog } from '@/components/molecules/delete-confirmation-dialog'
import { EditStylistDialog } from './edit-stylist-dialog'
import { deleteStylistAction } from '@/features/stylists/actions'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms/button'

interface StylistsTableProps {
  stylists: Stylist[]
}

/**
 * Un organism "dumb" care afișează o listă de stiliști într-un tabel.
 * Primește datele prin props și compune atomi și molecule pentru a randa UI-ul.
 */
export function StylistsTable({ stylists }: StylistsTableProps) {
  return (
    <Table>
      {/* 1. Headerele sunt definite direct în JSX, nu într-un fișier de config */}
      <TableHeader>
        <TableRow>
          <TableHead>Nume</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Telefon</TableHead>
          <TableHead>Descriere</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Acțiuni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* 2. Corpul tabelului mapează datele și randează celulele */}
        {stylists.map((stylist) => (
          <TableRow key={stylist.id}>
            <TableCell className="font-medium">{stylist.full_name}</TableCell>
            <TableCell>{stylist.email}</TableCell>
            <TableCell>{stylist.phone}</TableCell>
            <TableCell className="max-w-xs truncate">{stylist.description}</TableCell>
            <TableCell className="text-center">
              <ActiveBadge isActive={stylist.is_active} />
            </TableCell>
            <TableCell className="text-right">
              {/* 3. Acțiunile (organismele de dialog) sunt compuse direct aici */}
              <div className="flex justify-end gap-2">
                <EditStylistDialog stylist={stylist} />
                <DeleteConfirmationDialog action={deleteStylistAction} itemId={stylist.id}>
                  <DeleteConfirmationDialog.Trigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteConfirmationDialog.Trigger>
                  <DeleteConfirmationDialog.Content>
                    <DeleteConfirmationDialog.Title>Confirmă Ștergerea</DeleteConfirmationDialog.Title>
                    <DeleteConfirmationDialog.Description>
                      Ești sigur că vrei să ștergi stilistul "{stylist.full_name}"?
                    </DeleteConfirmationDialog.Description>
                  </DeleteConfirmationDialog.Content>
                </DeleteConfirmationDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
