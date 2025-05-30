// app/admin/services/components/service-table-row.tsx
'use client' // Această componentă are interactivitate client-side

import { TableCell, TableRow } from '@/components/ui/table'
import { SubmitButton } from '@/components/ui/submit-button' // Componenta pentru butonul de submit
import { ServiceData } from '@/app/admin/services/types' // Importă tipul de date pentru serviciu
import { deleteServiceAction } from '@/app/admin/services/actions' // Server Action pentru ștergere
import { EditServiceDialog } from '@/app/admin/services/components/edit-service-dialog' // Dialogul de editare

interface ServiceTableRowProps {
  service: ServiceData // Primește datele unui serviciu ca prop
}

/**
 * Componentă pentru afișarea unui rând de serviciu în tabelul de administrare.
 * Include butoane pentru editare și ștergere.
 */
export function ServiceTableRow({ service }: ServiceTableRowProps) {
  // Bind-uim ID-ul serviciului la acțiunea de ștergere
  const handleDelete = deleteServiceAction.bind(null, service.id)

  return (
    <TableRow key={service.id}>
      <TableCell className="font-medium">{service.name}</TableCell>
      <TableCell>{service.description}</TableCell>
      <TableCell>{service.duration_minutes}</TableCell>
      <TableCell>{service.price.toFixed(2)} RON</TableCell>
      <TableCell>{service.category}</TableCell>
      <TableCell>
        {service.is_active ? <span className="text-green-500">Da</span> : <span className="text-red-500">Nu</span>}
      </TableCell>
      <TableCell className="text-right flex items-center justify-end gap-2">
        {/* Dialogul de editare al serviciului */}
        <EditServiceDialog service={service} />

        {/* Formular pentru ștergerea serviciului */}
        {/* Acțiunea de ștergere este apelată direct prin bind */}
        <form action={handleDelete} className="inline-block">
          <SubmitButton variant="destructive" size="sm">
            Șterge
          </SubmitButton>
        </form>
      </TableCell>
    </TableRow>
  )
}
