// app/admin/services/components/service-table-view.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ServiceData } from '@/app/admin/services/types'
import { ServiceTableRow } from './service-table-row'
import { EmptyState } from './empty-state'
import { createLogger } from '@/lib/logger'
import { SERVICE_TABLE_HEADERS } from './service-table-headers'

const logger = createLogger('ServiceTableView')

interface ServiceTableViewProps {
  services: ServiceData[]
}

const COL_SPAN_COUNT = SERVICE_TABLE_HEADERS.length

export function ServiceTableView({ services }: ServiceTableViewProps) {
  logger.debug('Rendering ServiceTableView', { count: services.length })

  return (
    <section aria-labelledby="services-table-heading" className="rounded-md border hidden md:block">
      <h2 id="services-table-heading" className="sr-only">
        Tabel cu servicii
      </h2>
      <Table role="table" className="table-fixed">
        <TableHeader>
          <TableRow>
            {SERVICE_TABLE_HEADERS.map((header, index) => (
              <TableHead key={header.label || index} className={header.className}>
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.length > 0 ? (
            services.map((service) => <ServiceTableRow key={service.id} service={service} />)
          ) : (
            <TableRow>
              <TableCell colSpan={COL_SPAN_COUNT} className="h-24 text-center">
                <EmptyState message="Nu există servicii adăugate încă." />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
