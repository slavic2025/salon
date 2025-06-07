// components/shared/generic-table-view.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { createLogger } from '@/lib/logger'
import React from 'react' // Asigură-te că importăm React

const logger = createLogger('GenericTableView')

// Definirea unei interfețe generice pentru anteturile tabelului
interface TableHeaderItem {
  label: string
  className?: string
  // Poți adăuga și alte proprietăți comune, cum ar fi 'key' dacă nu folosești indexul
}

interface GenericTableViewProps<T> {
  data: T[] // Array-ul de date (ex: Stylist[], ServiceData[])
  headers: TableHeaderItem[] // Anteturile tabelului
  renderRow: (item: T, index: number) => React.ReactNode // Funcție pentru randarea fiecărui rând
  emptyMessage: string // Mesajul afișat când nu există date
  tableHeadingId: string // ID pentru heading-ul accesibil (sr-only)
  tableHeadingText: string // Text pentru heading-ul accesibil (sr-only)
}

// Folosim o funcție cu generic pentru a tipiza prop-ul 'data'
export function GenericTableView<T>({
  data,
  headers,
  renderRow,
  emptyMessage,
  tableHeadingId,
  tableHeadingText,
}: GenericTableViewProps<T>) {
  logger.debug('Rendering GenericTableView', { count: data.length, tableHeadingText })

  const COL_SPAN_COUNT = headers.length

  return (
    <section aria-labelledby={tableHeadingId} className="rounded-md border hidden md:block">
      <h2 id={tableHeadingId} className="sr-only">
        {tableHeadingText}
      </h2>
      <Table role="table" className="table-fixed">
        <TableHeader>
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={header.label || index} className={header.className}>
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index)) // Aici apelăm funcția renderRow
          ) : (
            <TableRow>
              <TableCell colSpan={COL_SPAN_COUNT} className="h-24 text-center">
                <EmptyState message={emptyMessage} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  )
}
