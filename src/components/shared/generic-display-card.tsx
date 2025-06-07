// components/shared/generic-display-card.tsx
'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SubmitButton } from '@/components/ui/submit-button'
import { createLogger } from '@/lib/logger'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { INITIAL_FORM_STATE, ActionResponse } from '@/types/types'
import { DisplayFieldConfig, DisplayItem } from './display-card-types' // Importă noile tipuri

const logger = createLogger('GenericDisplayCard')

interface GenericDisplayCardProps<T extends DisplayItem> {
  entity: T // Entitatea de afișat (ServiceData, Stylist, etc.)
  displayFieldsConfig: DisplayFieldConfig<T>[] // Configurația câmpurilor de afișat
  EditDialog: React.ComponentType<{ entity: T }> // Componenta de dialog pentru editare
  // Acțiunea de ștergere, compatibilă cu useActionState (primește prevState, returnează ActionResponse)
  deleteAction: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>
  cardTitle: React.ReactNode // Titlul cardului (e.g., entity.name sau JSX personalizat)
  cardDescription?: React.ReactNode // Descrierea cardului (e.g., entity.description sau JSX personalizat), opțional
  deleteLabel?: string // Textul pentru butonul de ștergere, implicit "Șterge"
  deleteButtonAriaLabel?: string // aria-label pentru butonul de ștergere
}

export function GenericDisplayCard<T extends DisplayItem>({
  entity,
  displayFieldsConfig,
  EditDialog,
  deleteAction,
  cardTitle,
  cardDescription,
  deleteLabel = 'Șterge',
  deleteButtonAriaLabel,
}: GenericDisplayCardProps<T>) {
  // Utilizează useActionState pentru a gestiona starea acțiunii de ștergere
  const [deleteState, deleteFormAction, isPending] = useActionState(deleteAction, INITIAL_FORM_STATE)

  // Utilizează useEffect pentru a reacționa la schimbările de stare și a afișa toast-uri
  useEffect(() => {
    // Verificăm dacă mesajul este definit pentru a evita toast-uri la prima randare (INITIAL_FORM_STATE)
    if (deleteState.message) {
      if (deleteState.success) {
        toast.success('Succes!', {
          description: deleteState.message,
        })
      } else {
        toast.error('Eroare!', {
          description: deleteState.message,
        })
      }
    }
  }, [deleteState]) // Se declanșează la fiecare schimbare a stării

  logger.debug('Rendering GenericDisplayCard', { entityId: entity.id, entityName: entity.name })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
        {cardDescription && <CardDescription className="text-gray-600">{cardDescription}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-2">
        {displayFieldsConfig.map((field) => {
          const value = entity[field.id]

          // Logica pentru a ascunde câmpurile goale/null
          if (field.hideIfEmpty && (!value || (typeof value === 'string' && value.trim() === ''))) {
            logger.debug(`Hiding empty field "${String(field.id)}" for entity "${entity.name || entity.id}"`)
            return null
          }

          return (
            <div key={String(field.id)} className={`flex items-center justify-between ${field.className || ''}`}>
              <span className="font-semibold">{field.label}:</span>
              <span>
                {/* Aplică formatarea dacă este definită, altfel convertește la string */}
                {field.format ? field.format(value) : String(value)}
              </span>
            </div>
          )
        })}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        <EditDialog entity={entity} /> {/* Pasăm entitatea către dialogul de editare */}
        <form action={deleteFormAction}>
          {' '}
          {/* Utilizează funcția de dispatch de la useActionState */}
          <input type="hidden" name="id" value={entity.id} />
          <SubmitButton
            variant="destructive"
            size="sm"
            aria-label={deleteButtonAriaLabel || `${deleteLabel} ${entity.name || entity.id}`}
            disabled={isPending} // Folosim isPending pentru a dezactiva butonul în timpul acțiunii
          >
            {deleteLabel}
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  )
}
