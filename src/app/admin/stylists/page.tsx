// app/admin/stylists/page.tsx
import { createLogger } from '@/lib/logger'
import { StylistsPageContent } from './_components/stylist-page-content'
import { fetchstylists } from './data'

const logger = createLogger('StylistsPage')

export default async function AdminStylistsPage() {
  logger.info('Loading StylistsPage...')
  const stylists = await fetchstylists()
  logger.debug('Stylists loaded:', { count: stylists.length })

  return <StylistsPageContent stylists={stylists} />
}
