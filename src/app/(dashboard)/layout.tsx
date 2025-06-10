// src/app/(dashboard)/layout.tsx

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { UserNav } from '@/components/dashboard/user-nav'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { MobileNav } from '@/components/dashboard/mobile-nav'
import { headers } from 'next/headers'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (user.user_metadata?.password_set === false) {
    redirect('/account-setup')
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const userRole = profile?.role

  // Dacă din orice motiv nu găsim un profil sau un rol, redirecționăm la login.
  if (!userRole) {
    console.error(`User with ID ${user.id} has no profile or role. Logging out.`)
    redirect('/login')
  }

  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''

  // --- BEST PRACTICE: Logica de autorizare bazată pe rol și rută ---
  if (userRole === 'admin' && pathname.startsWith('/stylist')) {
    // Un admin a ajuns pe o rută de stilist, îl trimitem la pagina lui de start.
    redirect('/admin')
  }

  if (userRole === 'stylist' && pathname.startsWith('/admin')) {
    // Un stilist a încercat să acceseze o rută de admin, îl trimitem la pagina lui de start.
    redirect('/stylist/schedule') // <-- Folosim noua rută
  }
  // --- Sfârșitul logicii de autorizare ---

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
