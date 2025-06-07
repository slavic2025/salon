// app/admin/stylists/components/stylist-card-view.tsx
'use client'
import { StylistCard } from './stylist-card' // Importă componenta StylistCard
import { createLogger } from '@/lib/logger'
import { EmptyState } from '@/components/ui/empty-state'
import { Stylist } from '@/core/domains/stylists/stylist.types'

const logger = createLogger('StylistCardView') // Noul nume pentru logger

interface StylistCardViewProps {
  stylists: Stylist[]
}

export function StylistCardView({ stylists }: StylistCardViewProps) {
  // Noul nume al componentei și prop-ul
  logger.debug('Rendering StylistCardView', { count: stylists.length })

  return (
    <section aria-labelledby="stylists-cards-heading" className="md:hidden grid grid-cols-1 gap-4">
      {' '}
      {/* ID și text actualizate */}
      <h2 id="stylists-cards-heading" className="sr-only">
        Stiliști listați ca și carduri
      </h2>
      {stylists.length > 0 ? ( // Verifică lungimea array-ului de stiliști
        stylists.map((stylist) => <StylistCard key={stylist.id} stylist={stylist} />) // Mapează peste stiliști
      ) : (
        <EmptyState message="Nu există stiliști adăugați încă." />
      )}
    </section>
  )
}
