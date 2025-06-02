// app/admin/stylists/components/stylist-card.tsx
'use client'

import { Stylist } from '@/lib/db/stylist-core' // Importă tipul Stylist
import { deleteStylistActionForm } from '@/app/admin/stylists/actions' // Importă acțiunea de ștergere
import { EditStylistDialog } from '@/app/admin/stylists/components/edit-stylist-dialog' // Va trebui să creezi acest component
import { SubmitButton } from '@/components/ui/submit-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { STYLIST_DISPLAY_FIELDS } from './stylist-display-fields' // Importă câmpurile de afișare specifice stiliștilor
import { createLogger } from '@/lib/logger'

const logger = createLogger('StylistCard') // Noul nume pentru logger

interface StylistCardProps {
  stylist: Stylist // Prop-ul este acum 'stylist' de tip 'Stylist'
}

export function StylistCard({ stylist }: StylistCardProps) {
  // Noul nume al componentei și prop-ul
  logger.debug('Rendering StylistCard', { stylistId: stylist.id, stylistName: stylist.name })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{stylist.name}</CardTitle>
        {stylist.description && <CardDescription className="text-gray-600">{stylist.description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-2">
        {STYLIST_DISPLAY_FIELDS.map((field) => {
          // Mapează peste câmpurile specifice stiliștilor
          const value = stylist[field.id]

          // Logica pentru ascunderea câmpurilor goale/null rămâne generică
          if (field.hideIfEmpty && (!value || (typeof value === 'string' && value.trim() === ''))) {
            logger.debug(`Hiding empty field "${String(field.id)}" for stylist "${stylist.name}"`)
            return null
          }

          return (
            <div key={String(field.id)} className="flex items-center justify-between">
              <span className="font-semibold">{field.label}:</span>
              <span>
                {field.format ? (field.format as (val: typeof value) => React.ReactNode)(value) : String(value)}
              </span>
            </div>
          )
        })}
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        {/* Butonul de editare deschide dialogul de editare */}
        <EditStylistDialog stylist={stylist} />
        {/* Formularul de ștergere, cu butonul de submit */}
        <form action={deleteStylistActionForm}>
          <input type="hidden" name="id" value={stylist.id} />
          <SubmitButton variant="destructive" size="sm">
            Șterge
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  )
}
