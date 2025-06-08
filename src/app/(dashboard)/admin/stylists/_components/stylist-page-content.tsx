// src/app/(dashboard)/admin/stylists/_components/stylist-page-content.tsx
'use client'

import { createLogger } from '@/lib/logger'
import { AddStylistDialog } from './add-stylist-dialog'
import { GenericTableView } from '@/components/shared/generic-table-view'
import { StylistTableRow } from './stylist-table-row'
import { STYLIST_TABLE_HEADERS } from './stylist-table-headers'
import { StylistCardView } from './stylist-card-view'
import { Stylist } from '@/core/domains/stylists/stylist.types'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

const logger = createLogger('StylistsPageContent')

interface StylistsPageContentProps {
  stylists: Stylist[]
}

export function StylistsPageContent({ stylists }: StylistsPageContentProps) {
  logger.debug('Rendering StylistsPageContent', { numStylists: stylists.length })

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestionare Stiliști</h1>

        {/* Butonul clasic, vizibil doar pe desktop */}
        <div className="hidden md:block">
          <AddStylistDialog />
        </div>
      </div>

      <GenericTableView
        data={stylists}
        headers={STYLIST_TABLE_HEADERS}
        renderRow={(stylist) => <StylistTableRow key={stylist.id} stylist={stylist} />}
        emptyMessage="Nu există stiliști adăugați încă."
        tableHeadingId="stylists-table-heading"
        tableHeadingText="Tabel cu stiliști"
      />

      <StylistCardView stylists={stylists} />

      {/* Butonul Flotant (FAB), vizibil doar pe mobil */}
      <div className="md:hidden">
        <AddStylistDialog
          trigger={
            <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg">
              <PlusIcon className="h-6 w-6" />
              <span className="sr-only">Adaugă Stilist Nou</span>
            </Button>
          }
        />
      </div>
    </div>
  )
}
