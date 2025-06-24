import { type Stylist } from '@/core/domains/stylists/stylist.types'
import { StylistCard } from '@/app/(dashboard)/admin/stylists/_components/stylist-card' // Refolosim cardul de stilist

interface OurStylistsSectionProps {
  stylists: Stylist[]
}

export function OurStylistsSection({ stylists }: OurStylistsSectionProps) {
  return (
    <section id="echipa" className="w-full py-16 lg:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Echipa Noastră</h2>
          <p className="mt-4 text-lg text-muted-foreground">Experți dedicați stilului tău.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stylists.map((stylist) => (
            <StylistCard key={stylist.id} stylist={stylist} />
          ))}
        </div>
      </div>
    </section>
  )
}
