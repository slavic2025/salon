// app/admin/stylists/page.tsx
import { StylistsPageContent } from './components/stylist-page-content'
import { fetchstylists } from './data'

export default async function AdminStylistsPage() {
  const stylists = await fetchstylists()
  return <StylistsPageContent stylists={stylists} />
}
