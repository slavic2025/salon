// components/dashboard/user-nav.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { Button } from '@/components/atoms/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/atoms/dropdown-menu'
import { signOutAction } from '@/features/auth/actions' // Funcția de logout

export function UserNav() {
  // Aici poți prelua informațiile despre utilizator din sesiune
  // const user = session?.user; // Exemplu dacă folosești NextAuth.js

  const handleLogout = async () => {
    await signOutAction() // Apelează server action-ul de logout
    // Redirecționarea va fi gestionată de Next.js/Middleware sau în server action
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            {/* Înlocuiește cu user?.image dacă ai imagini de profil */}
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            {/* Înlocuiește cu inițialele user-ului */}
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin</p> {/* Numele utilizatorului */}
            <p className="text-xs leading-none text-muted-foreground">
              admin@exemplu.com {/* Email-ul utilizatorului */}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Setări
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Deconectare
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
