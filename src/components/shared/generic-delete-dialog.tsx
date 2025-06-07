// src/components/shared/generic-delete-dialog.tsx
'use client'

import {
  AlertDialog,
  AlertDialogAction,
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
import { Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ActionResponse, INITIAL_FORM_STATE } from '@/types/actions.types'

interface GenericDeleteDialogProps {
  deleteAction: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
  entityId: string
  entityName: string
  revalidationId?: string // ID suplimentar necesar pentru revalidare (ex: stylistId)
  trigger?: React.ReactNode
}

export function GenericDeleteDialog({
  deleteAction,
  entityId,
  entityName,
  revalidationId,
  trigger,
}: GenericDeleteDialogProps) {
  const { state, formSubmit, isPending } = useActionForm<ActionResponse, FormData>({
    action: deleteAction,
    initialState: INITIAL_FORM_STATE,
    // Toast-urile sunt gestionate de hook
  })

  const handleSubmit = () => {
    const formData = new FormData()
    formData.append('id', entityId)
    // Adaugă ID-ul suplimentar dacă este necesar pentru acțiunile complexe
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
          {/* AlertDialogAction este un buton, nu un form, deci apelăm manual */}
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
