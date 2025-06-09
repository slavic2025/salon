// src/app/(dashboard)/layout.tsx
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation' // Asigură-te că `redirect` este importat
import { UserNav } from '@/components/dashboard/user-nav'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { MobileNav } from '@/components/dashboard/mobile-nav'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // AICI ESTE CORECȚIA:
  // 1. Verificăm dacă obiectul `user` este null.
  if (!user) {
    // 2. Dacă este null, redirecționăm la login.
    // Nicio pagină din acest layout nu ar trebui să fie accesibilă fără un user.
    redirect('/login')
  }

  // Doar dacă user NU este null, continuăm să preluăm profilul.
  // Am eliminat `!` de la `user.id` deoarece acum suntem siguri că `user` nu este null.
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const userRole = profile?.role || 'authenticated'

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <DashboardSidebar userRole={userRole} />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <MobileNav userRole={userRole} />
          <div className="w-full flex-1"></div>
          <UserNav />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
