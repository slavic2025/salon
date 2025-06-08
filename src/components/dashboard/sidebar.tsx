// src/components/dashboard/sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, Scissors, CalendarCheck, Settings, BookOpen } from 'lucide-react'

// 1. Definim linkurile pentru ambele roluri
const adminNavItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Programări', href: '/admin/appointments', icon: CalendarCheck },
  { title: 'Stiliști', href: '/admin/stylists', icon: Users },
  { title: 'Servicii', href: '/admin/services', icon: Scissors },
  { title: 'Clienti', href: '/admin/clients', icon: BookOpen },
  { title: 'Setări', href: '/admin/settings', icon: Settings },
]

const stylistNavItems = [
  { title: 'Programul Meu', href: '/dashboard/schedule', icon: CalendarCheck },
  { title: 'Serviciile Mele', href: '/dashboard/services', icon: Scissors },
  // Se pot adăuga link-uri viitoare aici, de ex. "Profilul Meu"
]

// 2. Definim interfața de props pentru a accepta `userRole`
interface DashboardSidebarProps {
  userRole: string
  onLinkClick?: () => void
}

// 3. Primim `userRole` ca prop obligatoriu
export function DashboardSidebar({ userRole, onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname()

  // 4. Selectăm setul corect de linkuri pe baza rolului
  const navItems = userRole === 'admin' ? adminNavItems : stylistNavItems

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-16 items-center border-b px-6">
        <Link
          href={userRole === 'admin' ? '/admin' : '/dashboard/schedule'}
          className="flex items-center gap-2 font-semibold"
          onClick={onLinkClick}
        >
          <span>{userRole === 'admin' ? 'Admin Panel' : 'Panou Stilist'}</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                pathname === item.href && 'bg-muted text-primary'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
