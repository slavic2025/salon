import { getServiceService } from '@/features/services/actions'
import { getStylistService } from '@/features/stylists/actions'
import { AppError } from '@/lib/errors'
import { createLogger } from '@/lib/logger'

// Importăm noile noastre componente de secțiune
import { HeroSection } from '@/components/public/hero-section'
import { OurServicesSection } from '@/components/public/our-services-section'
import { OurStylistsSection } from '@/components/public/our-stylists-section'
import { BookingSection } from '@/components/public/booking-section'

const logger = createLogger('HomePage')

/**
 * Pagina principală "Smart". Preia datele și compune secțiunile "dumb".
 */
export default async function HomePage() {
  logger.info('Fetching data for HomePage...')

  try {
    // Preluăm în paralel serviciile și stiliștii pentru performanță
    const serviceService = await getServiceService()
    const stylistService = await getStylistService()

    const [services, stylists] = await Promise.all([
      serviceService.findActiveServices(),
      stylistService.findAllStylists(), // Presupunând că ai metoda `findAllStylists`
    ])

    return (
      <main className="flex flex-col items-center">
        <HeroSection />
        <OurServicesSection services={services} />
        <OurStylistsSection stylists={stylists} />
        <BookingSection services={services} />
      </main>
    )
  } catch (error) {
    logger.error('Failed to fetch data for homepage', { error })
    // Afișăm o stare de eroare elegantă
    return (
      <main className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Oops! Ceva nu a funcționat.</h2>
          <p className="mt-2 text-muted-foreground">Nu am putut încărca datele necesare.</p>
        </div>
      </main>
    )
  }
}
