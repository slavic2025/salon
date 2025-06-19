// src/components/shared/generic-display-card.tsx
'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/atoms/card'
import { GenericDeleteDialog } from './generic-delete-dialog'
import { DisplayFieldConfig, DisplayItem } from './display-card-types'
import { ActionResponse } from '@/types/actions.types'
import { Button } from '@/components/atoms/button'
import { Pencil, Trash2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/atoms/avatar'

interface GenericDisplayCardProps<T extends DisplayItem> {
  entity: T
  displayFieldsConfig: DisplayFieldConfig<T>[]
  EditDialog: React.ComponentType<{ entity: T; children?: React.ReactNode }>
  deleteAction: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
  cardTitle: React.ReactNode
  cardDescription?: React.ReactNode
  renderCustomActions?: (entity: T) => React.ReactNode
  avatarUrl?: string | null
  entityInitials?: string
  headerActions?: React.ReactNode
  deleteRevalidationId?: string
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
  headerActions,
  deleteRevalidationId,
}: GenericDisplayCardProps<T>) {
  return (
    // 1. Am eliminat 'flex flex-col'. Componenta <Card> are deja acest stil.
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
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
          {headerActions}
        </div>
      </CardHeader>

      {/* 2. Am eliminat 'flex-grow' de aici pentru a lăsa conținutul să-și determine înălțimea natural. */}
      <CardContent className="grid gap-2 pt-2">
        {displayFieldsConfig.map((field) => {
          const value = entity[field.id]
          if (field.hideIfEmpty && !value) return null
          return (
            <div
              key={String(field.id)}
              className={`flex items-center justify-between text-sm ${field.className || ''}`}
            >
              <span className="font-semibold text-muted-foreground">{field.label}:</span>
              <span className="text-right">{field.format ? field.format(value) : String(value)}</span>
            </div>
          )
        })}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 p-4 pt-2">
        {renderCustomActions && renderCustomActions(entity)}
        <EditDialog entity={entity}>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5">
            <Pencil className="h-4 w-4" /> Editează
          </Button>
        </EditDialog>
        <GenericDeleteDialog
          deleteAction={deleteAction}
          entityId={entity.id}
          entityName={entity.name || 'această înregistrare'}
          revalidationId={deleteRevalidationId}
          trigger={
            <Button variant="destructive" size="sm" className="flex items-center gap-1.5">
              <Trash2 className="h-4 w-4" /> Șterge
            </Button>
          }
        />
      </CardFooter>
    </Card>
  )
}
