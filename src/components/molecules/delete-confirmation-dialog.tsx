'use client'

// Pasul 1: Importăm `useTransition` alături de `useState`
import { useState, useTransition, type ReactNode, type FormEvent } from 'react'
import { useActionForm } from '@/hooks/useActionForm'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from '@/components/atoms/alert-dialog'
import { SubmitButton } from '@/components/molecules/submit-button'
import type { ActionResponse } from '@/types/actions.types'

interface DeleteConfirmationDialogProps {
  action: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
  itemId: string
  children: ReactNode
}

const Title = AlertDialogTitle
const Description = AlertDialogDescription

function Root({ action, itemId, children }: DeleteConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Pasul 2: Inițializăm hook-ul `useTransition`
  const [isTransitionPending, startTransition] = useTransition()

  const { formSubmit, isPending: isActionPending } = useActionForm({
    action: action,
    initialState: { success: false },
    onSuccess: () => setIsOpen(false),
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('id', itemId)

    // Pasul 3: Împachetăm apelul la acțiune în `startTransition`
    startTransition(() => {
      formSubmit(formData)
    })
  }

  // Combinăm cele două stări de pending pentru o reflectare corectă în UI
  const isFormPending = isActionPending || isTransitionPending

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      {children}
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            {/* Titlul și descrierea sunt acum definite de componenta copil, ceea ce e corect */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isFormPending}>Anulează</AlertDialogCancel>
            <SubmitButton variant="destructive" isPending={isFormPending}>
              Confirmă Ștergerea
            </SubmitButton>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}

// Asamblăm componenta finală cu sub-componentele sale
export const DeleteConfirmationDialog = Object.assign(Root, {
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Header: AlertDialogHeader,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
})
