// src/components/shared/generic-delete-dialog.tsx
'use client'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { useActionForm } from '@/hooks/useActionForm'
import { ActionResponse, INITIAL_FORM_STATE } from '@/types/actions.types'
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import React from 'react'

interface GenericDeleteDialogProps {
  deleteAction: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
  entityId: string
  entityName: string
  trigger?: React.ReactNode
  revalidationId?: string // <-- 1. Adăugăm proprietatea opțională
}

export function GenericDeleteDialog({
  deleteAction,
  entityId,
  entityName,
  trigger,
  revalidationId,
}: GenericDeleteDialogProps) {
  const { formSubmit, isPending } = useActionForm<ActionResponse, FormData>({
    action: deleteAction,
    initialState: INITIAL_FORM_STATE,
  })

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('id', entityId)

    // 2. Dacă am primit un ID de revalidare, îl adăugăm în FormData
    if (revalidationId) {
      formData.append('stylist_id_for_revalidation', revalidationId)
    }

    formSubmit(formData)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger || (
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
          <AlertDialogDescription>
            Această acțiune nu poate fi anulată. Acest lucru va șterge definitiv înregistrarea pentru "{entityName}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Anulează</AlertDialogCancel>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className={cn(buttonVariants({ variant: 'destructive' }))}
          >
            {isPending ? 'Se șterge...' : 'Da, șterge'}
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
