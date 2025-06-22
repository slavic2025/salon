'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { Button, buttonVariants } from '@/components/atoms/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'
import { ActiveBadge } from '@/components/molecules/active-badge'
import { EditStylistDialog } from './edit-stylist-dialog'
import { DeleteConfirmationDialog } from '@/components/molecules/delete-confirmation-dialog'
import { deleteStylistAction } from '@/features/stylists/actions'
import { Mail, Phone, Scissors, Trash2 } from 'lucide-react'
import type { Stylist } from '@/core/domains/stylists/stylist.types'

interface StylistCardProps {
  stylist: Stylist
}

export function StylistCard({ stylist }: StylistCardProps) {
  const initials = stylist.full_name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={stylist.profile_picture ?? undefined} alt={`Poza lui ${stylist.full_name}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{stylist.full_name}</CardTitle>
              <CardDescription>Stilist</CardDescription>
            </div>
          </div>
          <ActiveBadge isActive={stylist.is_active} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{stylist.email}</span>
          </div>
          {stylist.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{stylist.phone}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end items-center gap-2 pt-4 border-t">
          <Link
            href={`/admin/stylists/${stylist.id}/services`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            <Scissors className="mr-2 h-4 w-4" />
            Servicii
          </Link>
          <EditStylistDialog stylist={stylist} />
          <DeleteConfirmationDialog action={deleteStylistAction} itemId={stylist.id}>
            <DeleteConfirmationDialog.Trigger asChild>
              <Button variant="destructive" size="icon" aria-label="Șterge Stilistul">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Șterge Stilistul</span>
              </Button>
            </DeleteConfirmationDialog.Trigger>
            <DeleteConfirmationDialog.Content>
              <DeleteConfirmationDialog.Header>
                <DeleteConfirmationDialog.Title>Confirmă Ștergerea</DeleteConfirmationDialog.Title>
                <DeleteConfirmationDialog.Description>
                  Ești sigur că vrei să ștergi stilistul "{stylist.full_name}"? Această acțiune este ireversibilă.
                </DeleteConfirmationDialog.Description>
              </DeleteConfirmationDialog.Header>
            </DeleteConfirmationDialog.Content>
          </DeleteConfirmationDialog>
        </div>
      </CardContent>
    </Card>
  )
}
