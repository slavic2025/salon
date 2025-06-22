// src/app/(dashboard)/admin/stylists/_components/stylist-page-content.tsx
'use client'

import { type Stylist } from '@/core/domains/stylists/stylist.types'
import { AddStylistDialog } from './add-stylist-dialog'
import { EmptyState } from '@/components/molecules/empty-state'
import { StylistCardView } from './stylist-card-view'
import { StylistsTable } from './stylists-table'

interface StylistsPageContentProps {
  stylists: Stylist[]
}

export function StylistsPageContent({ stylists }: StylistsPageContentProps) {
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Management Stiliști</h1>
        <AddStylistDialog />
      </div>

      {stylists.length === 0 ? (
        <EmptyState
          title="Niciun Stilist Adăugat"
          description="Momentan nu există stiliști. Apasă 'Adaugă Stilist' pentru a crea primul."
        />
      ) : (
        <>
          {/* Randăm VEDEREA DE CARDURI, dar o ascundem pe ecranele mari (lg și peste) */}
          <div className="lg:hidden">
            <StylistCardView stylists={stylists} />
          </div>

          {/* Randăm VEDEREA DE TABEL, dar o afișăm doar pe ecranele mari */}
          <div className="hidden lg:block">
            <StylistsTable stylists={stylists} />
          </div>
        </>
      )}
    </div>
  )
}
