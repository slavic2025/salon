// app/admin/stylists/components/stylist-card.tsx
'use client'

import { EditStylistDialog } from '@/app/admin/stylists/components/edit-stylist-dialog'
import { STYLIST_DISPLAY_FIELDS } from './stylist-display-fields' // Configurația specifică stilistului
import { deleteStylistAction } from '../actions' // Acțiunea specifică stilistului
import { GenericDisplayCard } from '@/components/shared/generic-display-card' // <--- Noul import!
import { DisplayFieldConfig, DisplayItem } from '@/components/shared/display-card-types' // Importă tipurile noi
import { StylistData } from '../types'

interface StylistCardProps {
  stylist: StylistData
}

export function StylistCard({ stylist }: StylistCardProps) {
  // Asigură-te că STYLIST_DISPLAY_FIELDS este corect tipat pentru Stylist
  const typedDisplayFields: DisplayFieldConfig<StylistData>[] =
    STYLIST_DISPLAY_FIELDS as DisplayFieldConfig<StylistData>[]

  return (
    <GenericDisplayCard<StylistData> // Specificăm tipul generic pentru entitatea 'Stylist'
      entity={stylist}
      displayFieldsConfig={typedDisplayFields}
      EditDialog={EditStylistDialog}
      deleteAction={deleteStylistAction} // Pasează acțiunea de ștergere actualizată
      cardTitle={stylist.name}
      cardDescription={stylist.description}
      deleteLabel="Șterge"
      deleteButtonAriaLabel={`Șterge stilistul ${stylist.name}`}
    />
  )
}
