// // src/app/(dashboard)/admin/stylists/page.tsx

// import { createLogger } from '@/lib/logger'
// import { StylistsPageContent } from './_components/stylist-page-content'
// import { getStylistsAction } from '@/features/stylists/actions'

// const logger = createLogger('StylistsPage')

// export default async function AdminStylistsPage() {
//   logger.info('Loading StylistsPage...')
//   // 3. Apelăm direct acțiunea
//   const stylists = await getStylistsAction()
//   logger.debug('Stylists loaded:', { count: stylists.length })

//   return <StylistsPageContent stylists={stylists} />
// }
