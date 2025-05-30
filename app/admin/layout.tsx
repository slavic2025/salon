// app/admin/layout.tsx
import { redirect } from 'next/navigation'

import { MainNav } from '@/components/dashboard/main-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

import { createClient } from '@/lib/supabase' // Import the Supabase client

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const supabase = await createClient()

  // SCHIMBĂ AICI: Folosește getUser() pentru a valida sesiunea
  const {
    data: { user },
  } = await supabase.auth.getUser()
  // user va fi null dacă nu există sesiune validă

  // Dacă nu există utilizator valid, redirecționează
  if (!user) {
    redirect('/login')
  }

  // Acum poți folosi user.id pentru a prelua profilul
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id) // Folosește user.id de la getUser()
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    // Handle the error appropriately, perhaps redirecting to an error page
    redirect('/error') // Example: redirect to an error page
  }

  const userRole = profile?.role

  // Check if the user is authenticated and has the correct role.
  if (userRole !== 'admin' && userRole !== 'stylist') {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-8 pt-6">{children}</main>
      </div>
    </div>
  )
}
