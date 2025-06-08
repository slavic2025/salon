// src/components/dashboard/mobile-nav.tsx
'use client'

import { useState } from 'react'
// 1. Importăm componentele necesare din 'sheet'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-react'
import { DashboardSidebar } from './sidebar'

export function MobileNav() {
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
        {/* 2. Adăugăm un antet pentru accesibilitate */}
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle>Meniu</SheetTitle>
          <SheetDescription>Navighează la secțiunea dorită.</SheetDescription>
        </SheetHeader>

        {/* Sidebar-ul este randat după antet */}
        <DashboardSidebar onLinkClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
}
