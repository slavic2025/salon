// app/admin/services/page.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// Importăm Server Action-urile necesare
import { getServicesAction } from './actions'

// Importăm componentele specifice funcționalității (acum sunt organizate)
import { AddServiceDialog } from './components/add-service-dialog'
import { ServiceTableRow } from './components/service-table-row'
export default async function AdminServicesPage() {
  // Preluarea serviciilor se face pe server, pentru performanță
  const services = await getServicesAction()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gestionare Servicii</h2>
        {/* Butonul și dialogul de adăugare serviciu */}
        <AddServiceDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nume</TableHead>
              <TableHead>Descriere</TableHead>
              <TableHead>Durata (min)</TableHead>
              <TableHead>Preț</TableHead>
              <TableHead>Categorie</TableHead>
              <TableHead>Activ</TableHead>
              <TableHead className="text-right">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nu există servicii.
                </TableCell>
              </TableRow>
            ) : (
              // Randează ServiceTableRow pentru fiecare serviciu
              services.map((service) => <ServiceTableRow key={service.id} service={service} />)
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
