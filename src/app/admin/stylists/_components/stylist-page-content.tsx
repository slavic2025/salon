// app/admin/stylists/components/stylists-page-content.tsx
'use client'

import { createLogger } from '@/lib/logger'
import { AddStylistDialog } from './add-stylist-dialog'

// Importuri NOI pentru GenericTableView și elementele sale specifice
import { GenericTableView } from '@/components/shared/generic-table-view'
import { StylistTableRow } from './stylist-table-row' // Păstrăm acest import
import { STYLIST_TABLE_HEADERS } from './stylist-table-headers' // Păstrăm acest import

// Va trebui să creezi acest component (pentru mobil)
import { StylistCardView } from './stylist-card-view'
import { StylistData } from '@/features/stylists/types'

const logger = createLogger('StylistsPageContent')

interface StylistsPageContentProps {
  stylists: StylistData[]
}

export function StylistsPageContent({ stylists }: StylistsPageContentProps) {
  logger.debug('Rendering StylistsPageContent', { numStylists: stylists.length })

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" id="stylists-page-title">
          Gestionare Stiliști
        </h1>
        <AddStylistDialog />
      </div>

      {/* Utilizează componenta GenericTableView pentru desktop */}
      {/* Vechea linie: <StylistTableView stylists={stylists} /> */}
      <GenericTableView
        data={stylists}
        headers={STYLIST_TABLE_HEADERS}
        renderRow={(stylist) => <StylistTableRow key={stylist.id} stylist={stylist} />}
        emptyMessage="Nu există stiliști adăugați încă."
        tableHeadingId="stylists-table-heading"
        tableHeadingText="Tabel cu stiliști"
      />

      {/* Utilizează componenta StylistCardView pentru mobil */}
      {/* Asigură-te că StylistCardView este creat și funcționează corect */}
      <StylistCardView stylists={stylists} />
    </div>
  )
}
