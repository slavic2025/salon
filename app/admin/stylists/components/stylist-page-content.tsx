// app/admin/stylists/components/stylists-page-content.tsx
'use client'

import { Stylist } from '@/lib/db/stylist-core' // Importă tipul Stylist
import { StylistTableView } from './stylist-table-view' // Importă componenta pentru vizualizare tabel
import { StylistCardView } from './stylist-card-view' // Va trebui să creezi acest component (pentru mobil)
import { createLogger } from '@/lib/logger'
import { AddStylistDialog } from './add-stylist-dialog'

const logger = createLogger('StylistsPageContent') // Noul nume pentru logger

interface StylistsPageContentProps {
  stylists: Stylist[] // Prop-ul se numește acum 'stylists' și are tipul 'Stylist[]'
}

export function StylistsPageContent({ stylists }: StylistsPageContentProps) {
  // Noul nume al componentei și prop-ul
  logger.debug('Rendering StylistsPageContent', { numStylists: stylists.length })

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" id="stylists-page-title">
          {' '}
          {/* ID și text actualizate */}
          Gestionare Stiliști
        </h1>
        <AddStylistDialog /> {/* Componenta de dialog pentru adăugare */}
      </div>

      {/* Utilizează componenta StylistTableView pentru desktop */}
      <StylistTableView stylists={stylists} />

      {/* Utilizează componenta StylistCardView pentru mobil */}
      <StylistCardView stylists={stylists} />
    </div>
  )
}
