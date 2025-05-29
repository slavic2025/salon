// app/admin/page.tsx
import { Heading } from '@/components/ui/heading' // Vom crea o componentă Heading

export default function AdminDashboardPage() {
  return (
    <>
      <Heading title="Dashboard" description="Prezentare generală a datelor importante." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Aici poți adăuga carduri cu statistici, unsumar rapid etc. */}
        <p>Bun venit în panoul de administrare!</p>
      </div>
    </>
  )
}
