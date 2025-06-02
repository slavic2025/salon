// app/admin/stylists/components/stylist-table-view.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Stylist } from '@/lib/db/stylist-core' // Importă tipul Stylist
import { StylistTableRow } from './stylist-table-row' // Importă noul rând de tabel pentru stilist
import { createLogger } from '@/lib/logger'
import { STYLIST_TABLE_HEADERS } from './stylist-table-headers' // Importă header-ele specifice stiliștilor
import { EmptyState } from '@/components/ui/empty-state'

const logger = createLogger('StylistTableView') // Noul nume pentru logger

interface StylistTableViewProps {
  stylists: Stylist[] // Prop-ul se numește acum 'stylists' și are tipul 'Stylist[]'
}

const COL_SPAN_COUNT = STYLIST_TABLE_HEADERS.length // Folosește header-ele stiliștilor

export function StylistTableView({ stylists }: StylistTableViewProps) {
  // Noul nume al componentei și prop-ul
  logger.debug('Rendering StylistTableView', { count: stylists.length })

  return (
    <section aria-labelledby="stylists-table-heading" className="rounded-md border hidden md:block">
      <h2 id="stylists-table-heading" className="sr-only">
        Tabel cu stiliști
      </h2>
      <Table role="table" className="table-fixed">
        <TableHeader>
          <TableRow>
            {STYLIST_TABLE_HEADERS.map(
              (
                header,
                index // Folosește header-ele stiliștilor
              ) => (
                <TableHead key={header.label || index} className={header.className}>
                  {header.label}
                </TableHead>
              )
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stylists.length > 0 ? ( // Verifică lungimea array-ului de stiliști
            stylists.map((stylist) => <StylistTableRow key={stylist.id} stylist={stylist} />) // Mapează peste stiliști
          ) : (
            <TableRow>
              <TableCell colSpan={COL_SPAN_COUNT} className="h-24 text-center">
                <EmptyState message="Nu există stiliști adăugați încă." /> {/* Mesaj actualizat */}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
