import { createLogger } from '@/lib/logger'
import { AppError } from '@/lib/errors'
import { SchedulePageContent } from './_components/work-schedule-page-content'
import { getWorkScheduleService } from '@/features/work-schedules/actions'
import { protectPage } from '@/lib/auth-utils'

const logger = createLogger('StylistSchedulePage')

/**
 * Pagina de program pentru stilist. Este un "Smart Component" care
 * preia datele de pe server și le pasează componentei de UI.
 */
export default async function SchedulePage() {
  logger.info('Fetching data for SchedulePage...')
  const profile = await protectPage()
  try {
    // Pasul 2: Apelăm serviciul de business pentru a obține datele
    const scheduleService = await getWorkScheduleService()
    const initialSchedules = await scheduleService.findSchedulesForCurrentStylist()

    logger.debug('Schedules loaded successfully:', { count: initialSchedules.length })

    // Pasul 3: Pasăm datele pure către componenta "dumb"
    return <SchedulePageContent initialSchedules={initialSchedules} stylistId={profile.id} />
  } catch (error) {
    // Pasul 4: Gestionăm elegant erorile la nivel de pagină
    logger.error('Failed to fetch schedules for page.', { error })

    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-destructive">Oops! Nu am putut încărca programul.</h2>
        <p className="mt-2 text-muted-foreground">Te rugăm să încerci din nou mai târziu.</p>
        {error instanceof AppError && <p className="text-sm text-gray-500 mt-4">Detalii: {error.message}</p>}
      </div>
    )
  }
}
