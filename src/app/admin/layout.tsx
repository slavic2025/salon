// app/admin/layout.tsx
import { redirect } from 'next/navigation'

import { MainNav } from '@/components/dashboard/main-nav'
import { UserNav } from '@/components/dashboard/user-nav'
import { DashboardSidebar } from '@/components/dashboard/sidebar'

import { createClient } from '@/lib/supabase-server'
import { createLogger } from '@/lib/logger'

interface AdminLayoutProps {
  children: React.ReactNode
}

const logger = createLogger('AdminLayout')

export default async function AdminLayout({ children }: AdminLayoutProps) {
  logger.debug('AdminLayout invoked: Starting authentication and authorization checks.')

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    logger.warn('AdminLayout: No user found. Redirecting to login.')
    redirect('/login')
  }

  logger.info('AdminLayout: User authenticated.', { userId: user.id })

  const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', user.id).single()

  if (error) {
    logger.error('AdminLayout: Error fetching user profile from database.', {
      userId: user.id,
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    redirect('/error')
  }

  const userRole = profile?.role

  logger.info('AdminLayout: User role retrieved.', { userId: user.id, userRole })

  if (userRole !== 'admin' && userRole !== 'stylist') {
    logger.warn('AdminLayout: User does not have required role (admin or stylist). Redirecting to login.', {
      userId: user.id,
      userRole: userRole || 'none',
    })
    redirect('/login')
  }

  logger.info('AdminLayout: User authorized. Rendering admin content.', { userId: user.id, userRole })

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
