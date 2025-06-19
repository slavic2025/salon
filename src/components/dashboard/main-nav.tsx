// src/components/dashboard/mobile-nav.tsx
'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/atoms/sheet'
import { Button } from '@/components/atoms/button'
import { MenuIcon } from 'lucide-react'
import { DashboardSidebar } from './sidebar'

// 1. Definim interfața de props pentru a accepta userRole
interface MobileNavProps {
  userRole: string
}

// 2. Primim userRole ca prop
export function MobileNav({ userRole }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <MenuIcon className="h-6 w-6" />
          <span className="sr-only">Deschide meniul</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        {/* 3. Pasăm userRole mai departe către DashboardSidebar */}
        <DashboardSidebar userRole={userRole} onLinkClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
