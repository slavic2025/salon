'use client'

import { type Service } from '@/core/domains/services/service.types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/table'
import { ActiveBadge } from '@/components/molecules/active-badge'
import { DeleteConfirmationDialog } from '@/components/molecules/delete-confirmation-dialog'
import { EditServiceDialog } from './edit-service-dialog'
import { deleteServiceAction } from '@/features/services/actions'
import { formatCurrency } from '@/lib/formatters'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/atoms/button'

interface ServicesTableProps {
  services: Service[]
}

/**
 * Un organism "dumb" care afișează o listă de servicii într-un tabel.
 * Primește datele prin props și compune atomi și molecule pentru a randa UI-ul.
 */
export function ServicesTable({ services }: ServicesTableProps) {
  return (
    <Table>
      {/* 1. Headerele sunt definite direct în JSX, nu într-un fișier de config */}
      <TableHeader>
        <TableRow>
          <TableHead>Nume</TableHead>
          <TableHead>Categorie</TableHead>
          <TableHead className="text-right">Durată</TableHead>
          <TableHead className="text-right">Preț</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-right">Acțiuni</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* 2. Corpul tabelului mapează datele și randează celulele */}
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="font-medium">{service.name}</TableCell>
            <TableCell>{service.category}</TableCell>
            <TableCell className="text-right">{service.duration_minutes} min</TableCell>
            <TableCell className="text-right">{formatCurrency(service.price)}</TableCell>
            <TableCell className="text-center">
              <ActiveBadge isActive={service.is_active} />
            </TableCell>
            <TableCell className="text-right">
              {/* 3. Acțiunile (organismele de dialog) sunt compuse direct aici */}
              <div className="flex justify-end gap-2">
                <EditServiceDialog service={service} />
                <DeleteConfirmationDialog action={deleteServiceAction} itemId={service.id}>
                  <DeleteConfirmationDialog.Trigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteConfirmationDialog.Trigger>
                  <DeleteConfirmationDialog.Content>
                    <DeleteConfirmationDialog.Title>Confirmă Ștergerea</DeleteConfirmationDialog.Title>
                    <DeleteConfirmationDialog.Description>
                      Ești sigur că vrei să ștergi serviciul "{service.name}"?
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
