// app/admin/layout.tsx
import { createClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { createLogger } from '@/lib/logger'
import React from 'react'

const logger = createLogger('AdminLayout')

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  logger.info('AdminLayout: Checking user authentication and role.')

  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    logger.warn('AdminLayout: No user session found or error fetching user. Redirecting to login.')
    redirect('/login') // Redirecționează la login dacă nu e autentificat
  }

  // Preia profilul utilizatorului pentru a verifica rolul
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    logger.error('AdminLayout: Error fetching user profile for authorization.', {
      userId: user.id,
      error: profileError?.message,
    })
    redirect('/login') // Redirecționează la login dacă profilul nu poate fi preluat
  }

  if (profile.role !== 'admin' && profile.role !== 'stylist') {
    logger.warn(`AdminLayout: User ${user.id} has insufficient role (${profile.role}). Redirecting to login.`)
    // Poți crea o pagină de "Access Denied" în loc de /login
    redirect('/login')
  }

  logger.info(`AdminLayout: User ${user.id} with role ${profile.role} is authorized.`)

  return (
    <div>
      {/* Aici poți adăuga un header/sidebar specific adminului */}
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Panou Administrare</h1>
        <form action="/auth/sign-out" method="post">
          {' '}
          {/* Folosim o formă pentru Server Action de logout */}
          <button type="submit" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
            Deconectare
          </button>
        </form>
      </nav>
      <main className="p-4">
        {children} {/* Conținutul paginii de admin */}
      </main>
    </div>
  )
}
