'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/atoms/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/atoms/tooltip'
import { Scissors } from 'lucide-react'
import { STYLIST_CONSTANTS } from '@/core/domains/stylists/stylist.constants'

interface StylistServicesLinkProps {
  stylistId: string
}

/**
 * O moleculă care randează un link stilizat ca un buton-iconiță
 * pentru a naviga la pagina de servicii a unui stilist.
 * Include un tooltip pentru o experiență UX îmbunătățită.
 */
export function StylistServicesLink({ stylistId }: StylistServicesLinkProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={STYLIST_CONSTANTS.PATHS.pages.services(stylistId)}
            // Aplicăm stilurile pentru un buton de tip 'icon'
            className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}
            aria-label="Gestionează Serviciile"
          >
            <Scissors className="h-4 w-4" />
            <span className="sr-only">Servicii</span>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gestionează Serviciile</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
