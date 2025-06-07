// components/dashboard/main-nav.tsx
import Link from 'next/link'
import { cn } from '@/lib/utils' // Funcția cn pentru a combina clasele Tailwind

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)} {...props}>
      <Link href="/admin" className="text-lg font-bold transition-colors hover:text-primary">
        Admin Panel
      </Link>
      {/* Aici poți adăuga și alte link-uri de top-level */}
      <Link
        href="/admin/appointments"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Programări
      </Link>
      <Link
        href="/admin/stylists"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Stiliști
      </Link>
      <Link
        href="/admin/services"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Servicii
      </Link>
      {/* ...alte link-uri */}
    </nav>
  )
}
