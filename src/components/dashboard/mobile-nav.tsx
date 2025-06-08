// src/components/dashboard/mobile-nav.tsx
'use client'

import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription, // Asigură-te că aceste 3 sunt importate
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MenuIcon } from 'lucide-react'
import { DashboardSidebar } from './sidebar'

interface MobileNavProps {
  userRole: string
}

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
        {/* AICI ESTE ADAUGAREA CRITICĂ: */}
        <SheetHeader className="border-b p-4 text-left">
          <SheetTitle>Meniu Principal</SheetTitle>
          <SheetDescription>Navighează la secțiunea dorită.</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          <DashboardSidebar userRole={userRole} onLinkClick={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
