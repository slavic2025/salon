// src/app/(dashboard)/admin/stylists/_components/stylist-card.tsx
'use client'

import Link from 'next/link'
import { EditStylistDialog } from './edit-stylist-dialog'
import { STYLIST_DISPLAY_FIELDS } from './stylist-display-fields'
import { GenericDisplayCard } from '@/components/shared/generic-display-card'
import { DisplayFieldConfig } from '@/components/shared/display-card-types'
import { buttonVariants } from '@/components/ui/button'
import { Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Stylist } from '@/core/domains/stylists/stylist.types'
import { deleteStylistAction } from '@/features/stylists/actions'
import { ActiveBadge } from '@/components/ui/active-badge'

interface StylistCardProps {
  stylist: Stylist
}

export function StylistCard({ stylist }: StylistCardProps) {
  const displayFields = STYLIST_DISPLAY_FIELDS.filter((field) => field.id !== 'is_active')
  const typedDisplayFields: DisplayFieldConfig<Stylist>[] = displayFields as any
  const initials = stylist.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <GenericDisplayCard<Stylist>
      entity={stylist}
      displayFieldsConfig={typedDisplayFields}
      EditDialog={EditStylistDialog}
      deleteAction={deleteStylistAction}
      cardTitle={stylist.name}
      cardDescription={stylist.email}
      avatarUrl={stylist.profile_picture}
      entityInitials={initials}
      headerActions={<ActiveBadge isActive={stylist.is_active} />}
      renderCustomActions={(entity) => (
        <Link
          href={`/admin/stylists/${entity.id}/services`}
          className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex items-center gap-1.5')}
        >
          <Scissors className="h-4 w-4" />
          Servicii
        </Link>
      )}
    />
  )
}
