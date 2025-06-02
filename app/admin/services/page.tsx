// app/admin/services/page.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getServicesAction } from './actions'
import { ServiceData } from './types'
import { AddServiceDialog } from './components/add-service-dialog'
import { ServiceTableRow } from './components/service-table-row'
import { ServiceCard } from './components/service-card'

export default async function AdminServicesPage() {
  const services: ServiceData[] = await getServicesAction()

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      {' '}
      {/* Adăugăm padding responsiv */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Gestionare Servicii</h2>
        <AddServiceDialog />
      </div>
      {/* Vizualizare pentru Desktop: Tabel (vizibil de la md: - medium screens și mai mari) */}
      <div className="rounded-md border hidden md:block">
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
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  Nu există servicii.
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => <ServiceTableRow key={service.id} service={service} />)
            )}
          </TableBody>
        </Table>
      </div>
      {/* Vizualizare pentru Mobil: Liste de Carduri (vizibilă sub md: - medium screens) */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {services.length === 0 ? (
          <div className="h-24 flex items-center justify-center text-gray-500 border rounded-md">
            Nu există servicii.
          </div>
        ) : (
          services.map((service) => <ServiceCard key={service.id} service={service} />)
        )}
      </div>
    </div>
  )
}
