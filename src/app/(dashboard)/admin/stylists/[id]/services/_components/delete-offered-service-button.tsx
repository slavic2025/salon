// app/admin/stylists/[id]/services/components/delete-offered-service-button.tsx
'use client'

import React, { useEffect, useActionState, useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SubmitButton } from '@/components/ui/submit-button' //
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
} from '@/components/ui/alert-dialog' //
import { createLogger } from '@/lib/logger'
import { INITIAL_FORM_STATE, ActionResponse } from '@/types/actions.types' //
import { deleteOfferedServiceAction } from '@/features/services-offered/actions'

const logger = createLogger('DeleteOfferedServiceButton')

interface DeleteOfferedServiceButtonProps {
  offeredServiceId: string
  stylistIdForRevalidation: string // Necesar pentru revalidarea corectă a căii
  serviceName?: string // Pentru mesajul de confirmare
  onDeleteSuccess?: () => void // Callback opțional după ștergere cu succes
}

export function DeleteOfferedServiceButton({
  offeredServiceId,
  stylistIdForRevalidation,
  serviceName,
  onDeleteSuccess,
}: DeleteOfferedServiceButtonProps) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false)

  // Pregătim FormData în avans pentru acțiune
  const formData = new FormData()
  formData.append('id', offeredServiceId)
  formData.append('stylist_id_for_revalidation', stylistIdForRevalidation)

  // Inițializăm useActionState cu acțiunea și starea inițială
  // Nu mai pasăm formData direct aici, ci în apelul formAction din AlertDialogAction
  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    deleteOfferedServiceAction, // Acțiunea de ștergere
    INITIAL_FORM_STATE
  )

  useEffect(() => {
    if (state.message) {
      // Verificăm dacă există un mesaj pentru a evita toast-uri goale
      if (state.success) {
        toast.success('Succes!', { description: state.message })
        logger.info(`Offered service ${offeredServiceId} deleted successfully.`)
        setIsAlertDialogOpen(false) // Închide dialogul de confirmare
        if (onDeleteSuccess) {
          onDeleteSuccess() // Apelează callback-ul dacă este furnizat
        }
      } else {
        toast.error('Eroare!', {
          description: state.message || 'A apărut o eroare la ștergerea serviciului.',
        })
        logger.error(`Failed to delete offered service ${offeredServiceId}.`, {
          errors: state.errors,
          message: state.message,
        })
      }
    }
  }, [state, offeredServiceId, onDeleteSuccess])

  const handleDelete = () => {
    // Acum formAction este apelat cu formData când se confirmă ștergerea
    formAction(formData)
  }

  return (
    <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" aria-label={`Șterge ${serviceName || 'serviciul oferit'}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Ești absolut sigur?</AlertDialogTitle>
          <AlertDialogDescription>
            Această acțiune nu poate fi anulată. Acest lucru va șterge definitiv asocierea serviciului
            <strong>{serviceName ? ` "${serviceName}"` : ''}</strong> cu acest stilist.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Anulează</AlertDialogCancel>
          {/*
            Nu putem folosi SubmitButton direct aici într-un mod simplu deoarece
            AlertDialogAction nu este un <form>. Vom folosi un Button standard
            și vom apela manual formAction.
          */}
          <Button
            variant="destructive"
            onClick={handleDelete} // Apelăm handleDelete la click
            disabled={isPending}
            aria-label={`Confirmă ștergerea ${serviceName || 'serviciului oferit'}`}
          >
            {isPending ? 'Se șterge...' : 'Da, șterge'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
