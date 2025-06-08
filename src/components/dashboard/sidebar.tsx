'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, Scissors, CalendarCheck, Settings, BookOpen } from 'lucide-react'

const navItems = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Programări', href: '/admin/appointments', icon: CalendarCheck },
  { title: 'Stiliști', href: '/admin/stylists', icon: Users },
  { title: 'Servicii', href: '/admin/services', icon: Scissors },
  { title: 'Clienti', href: '/admin/clients', icon: BookOpen },
  { title: 'Setări', href: '/admin/settings', icon: Settings },
]

interface DashboardSidebarProps {
  onLinkClick?: () => void
}

export function DashboardSidebar({ onLinkClick }: DashboardSidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold" onClick={onLinkClick}>
          <span>Admin Salon</span>
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
