'use client'

import { useQuery } from '@tanstack/react-query'
import { useBookingStore } from '@/stores/use-booking-store'
import { getStylistsByServiceAction } from '@/features/stylists/actions'
import { type Stylist } from '@/core/domains/stylists/stylist.types'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { Card, CardContent } from '@/components/atoms/card'

/**
 * O sub-componentă "dumb" pentru a afișa un singur stilist selectabil.
 */
function StylistSelectionCard({ stylist, onSelect }: { stylist: Stylist; onSelect: (stylist: Stylist) => void }) {
  const initials =
    stylist.full_name
      ?.split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?'

  return (
    <Card
      className="p-4 text-center hover:bg-accent hover:cursor-pointer transition-colors"
      onClick={() => onSelect(stylist)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(stylist)}
    >
      <CardContent className="p-0 flex flex-col items-center gap-2">
        <Avatar className="w-16 h-16">
          <AvatarImage src={stylist.profile_picture ?? undefined} alt={`Poza lui ${stylist.full_name}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <p className="font-semibold text-sm">{stylist.full_name}</p>
      </CardContent>
    </Card>
  )
}

/**
 * Componenta pentru Pasul 2 al formularului de booking: Alegerea Stilistului.
 */
export function StylistStep() {
  const { formData, selectStylist, prevStep } = useBookingStore()
  const serviceId = formData.service?.id

  const {
    data: stylists,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['stylistsForService', serviceId],
    queryFn: async () => {
      if (!serviceId) return []
      // Apelăm acțiunea de pe server pentru a prelua stiliștii
      const result = await getStylistsByServiceAction(serviceId)
      if (!result.success || !result.data) {
        throw new Error(result.message || 'Failed to fetch stylists')
      }
      return result.data
    },
    enabled: !!serviceId, // Query-ul pornește doar după ce a fost selectat un serviciu
  })

  // Scenariul 1: Încărcare
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Se încarcă stiliștii disponibili...</p>
      </div>
    )
  }

  // Scenariul 2: Eroare
  if (error) {
    return (
      <div className="text-center h-48 flex flex-col justify-center items-center">
        <p className="text-destructive mb-4">A apărut o eroare la încărcarea stiliștilor.</p>
        <Button variant="outline" onClick={prevStep}>
          ← Înapoi la servicii
        </Button>
      </div>
    )
  }

  // Scenariul 3: Fără rezultate
  if (!stylists || stylists.length === 0) {
    return (
      <div className="text-center h-48 flex flex-col justify-center items-center">
        <p className="text-muted-foreground mb-4">Ne pare rău, nu există stiliști disponibili pentru acest serviciu.</p>
        <Button variant="outline" onClick={prevStep}>
          ← Înapoi la servicii
        </Button>
      </div>
    )
  }

  // Scenariul 4: Succes, afișăm lista
  return (
    <div className="flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-center">Pasul 2: Alege un stilist</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {stylists.map((stylist) => (
          <StylistSelectionCard
            key={stylist.id}
            stylist={stylist}
            onSelect={selectStylist} // La click, se apelează acțiunea din store
          />
        ))}
      </div>
      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={prevStep}>
          ← Înapoi la servicii
        </Button>
      </div>
    </div>
  )
}
