// app/admin/stylists/components/edit-stylist-dialog.tsx
'use client'

import { Stylist } from '@/core/domains/stylists/stylist.types'
import { EditStylistForm } from './edit-stylist-form' // Formularul specific stiliștilor
import { GenericEditDialog } from '@/components/shared/generic-edit-dialog' // <-- Noul import

interface EditStylistDialogProps {
  entity: Stylist
  children?: React.ReactNode
}

export function EditStylistDialog({ entity, children }: EditStylistDialogProps) {
  return (
    <GenericEditDialog<Stylist>
      entity={entity}
      title="Editează Stilistul"
      description="Fă modificări aici. Apasă salvare când ai terminat."
      FormComponent={EditStylistForm}
    >
      {children}
    </GenericEditDialog>
  )
}
