// app/admin/stylists/components/stylist-card-view.tsx
'use client'
import { StylistCard } from './stylist-card' // Importă componenta StylistCard
import { createLogger } from '@/lib/logger'
import { EmptyState } from '@/components/molecules/empty-state'
import { Stylist } from '@/core/domains/stylists/stylist.types'

interface StylistCardViewProps {
  stylists: Stylist[]
}

export function StylistCardView({ stylists }: StylistCardViewProps) {
  return (
    <section aria-labelledby="stylists-cards-heading">
      <h2 id="stylists-cards-heading" className="sr-only">
        Stiliști listați ca și carduri
      </h2>
      {stylists.length > 0 ? (
        stylists.map((stylist) => <StylistCard key={stylist.id} stylist={stylist} />)
      ) : (
        <EmptyState
          title="Niciun Stylist Adăugat"
          description="Momentan nu există servicii. Apasă 'Adaugă Stylist' pentru a crea primul."
        />
      )}
    </section>
  )
}
