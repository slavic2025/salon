// src/components/shared/generic-display-card.tsx
'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { GenericDeleteDialog } from './generic-delete-dialog'
import { DisplayItem } from './display-card-types'
import { ActionResponse } from '@/types/actions.types'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface GenericDisplayCardProps<T extends DisplayItem> {
  entity: T
  displayFieldsConfig: any[]
  EditDialog: React.ComponentType<{ entity: T; children?: React.ReactNode }>
  deleteAction: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
  cardTitle: React.ReactNode
  cardDescription?: React.ReactNode
  renderCustomActions?: (entity: T) => React.ReactNode
  // Proprietăți noi
  avatarUrl?: string | null
  entityInitials?: string
  headerActions?: React.ReactNode
}

export function GenericDisplayCard<T extends DisplayItem>({
  entity,
  displayFieldsConfig,
  EditDialog,
  deleteAction,
  cardTitle,
  cardDescription,
  renderCustomActions,
  avatarUrl,
  entityInitials,
  headerActions, // Primim noile props
}: GenericDisplayCardProps<T>) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Randăm Avatarul dacă există */}
            {avatarUrl !== undefined && (
              <Avatar>
                <AvatarImage src={avatarUrl ?? undefined} alt={entity.name} />
                <AvatarFallback>{entityInitials}</AvatarFallback>
              </Avatar>
            )}
            <div className="grid gap-0.5">
              <CardTitle>{cardTitle}</CardTitle>
              {cardDescription && <CardDescription className="pt-1">{cardDescription}</CardDescription>}
            </div>
          </div>
          {/* Randăm acțiunile din header (ex: badge-ul de status) */}
          {headerActions}
        </div>
      </CardHeader>
      <CardContent className="grid gap-2 pt-2">{/* ... restul cardului ... */}</CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-2">{/* ... footer-ul cardului ... */}</CardFooter>
    </Card>
  )
}
