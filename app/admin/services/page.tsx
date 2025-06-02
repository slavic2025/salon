// app/admin/services/page.tsx
import { fetchServices } from './data'
import { ServicesPageContent } from './components/services-page-content'

export default async function AdminServicesPage() {
  const services = await fetchServices()
  return <ServicesPageContent services={services} />
}
