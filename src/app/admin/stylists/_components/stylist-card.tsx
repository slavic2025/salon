// app/admin/stylists/components/stylist-card.tsx
'use client'

import Link from 'next/link' // Importă Link
import { EditStylistDialog } from '@/app/admin/stylists/_components/edit-stylist-dialog'
import { STYLIST_DISPLAY_FIELDS } from './stylist-display-fields'
import { GenericDisplayCard } from '@/components/shared/generic-display-card'
import { DisplayFieldConfig } from '@/components/shared/display-card-types'

import { buttonVariants } from '@/components/ui/button' // Importă buttonVariants
import { Scissors } from 'lucide-react' // Iconiță
import { cn } from '@/lib/utils' //
import { StylistData } from '@/features/stylists/types'
import { deleteStylistAction } from '@/features/stylists/actions'

interface StylistCardProps {
  stylist: StylistData
}

export function StylistCard({ stylist }: StylistCardProps) {
  const typedDisplayFields: DisplayFieldConfig<StylistData>[] =
    STYLIST_DISPLAY_FIELDS as DisplayFieldConfig<StylistData>[]

  return (
    <GenericDisplayCard<StylistData>
      entity={stylist}
      displayFieldsConfig={typedDisplayFields}
      // Pentru GenericDisplayCard, acțiunile sunt gestionate de el.
      // Dacă vrei să adaugi un link aici, ar trebui să modifici GenericDisplayCard
      // sau să nu folosești GenericDisplayCard și să construiești CardFooter manual aici.
      // Presupunând că vrem să adăugăm un link în afara structurii GenericDisplayCard (dacă GenericDisplayCard nu suportă acțiuni custom):
      // Soluția de mai jos este dacă NU ai folosi GenericDisplayCard sau dacă GenericDisplayCard ar permite `children` în footer.
      // Momentan, GenericDisplayCard are EditDialog și deleteAction ca props.

      // Abordare alternativă: Modificăm GenericDisplayCard sau adăugăm manual footer-ul aici.
      // Pentru simplitate, vom arăta cum ai adăuga link-ul dacă ai construi manual CardFooter în StylistCard.
      // Dacă vrei să integrezi în GenericDisplayCard, ar trebui să-i modifici structura.

      EditDialog={EditStylistDialog} // Prop pentru GenericDisplayCard
      deleteAction={deleteStylistAction} // Prop pentru GenericDisplayCard
      cardTitle={stylist.name}
      cardDescription={stylist.description}
      deleteLabel="Șterge"
      deleteButtonAriaLabel={`Șterge stilistul ${stylist.name}`}
      // Aici am putea adăuga un prop nou la GenericDisplayCard, ex: customActions
      // Sau, dacă GenericDisplayCard nu e folosit, construim direct card-ul:
      // <Card>
      //   <CardHeader>...</CardHeader>
      //   <CardContent>...</CardContent>
      //   <CardFooter className="flex justify-end gap-2 p-4 pt-0">
      //     <EditStylistDialog entity={stylist} />
      //     <Link href={`/admin/stylists/${stylist.id}/services`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex items-center')}>
      //       <Scissors className="mr-2 h-4 w-4" />
      //       Servicii
      //     </Link>
      //     {/* Delete Form */}
      //   </CardFooter>
      // </Card>
    >
      {/* Pentru a adăuga un buton de "Servicii" la GenericDisplayCard, ar trebui să modifici GenericDisplayCard
           pentru a accepta un prop suplimentar, de exemplu `renderMoreActions?: (entity: T) => React.ReactNode`.
           Momentan, GenericDisplayCard nu are această flexibilitate.

           Dacă nu modifici GenericDisplayCard, o opțiune este să nu folosești GenericDisplayCard pentru stiliști
           și să construiești cardul manual aici pentru a avea control total asupra footer-ului.

           O altă opțiune, mai simplă pentru moment, este să adaugi link-ul ca parte a descrierii sau într-un
           alt loc vizibil pe card, dacă nu vrei să refactorizezi GenericDisplayCard.

           Pentru coerență cu tabelul, ideal ar fi ca toate acțiunile să fie grupate.
           Să presupunem că decizi să adaugi un prop `customActions` la `GenericDisplayCard`.
           Atunci ai pasa:
           customActions={(entity) => (
             <Link href={`/admin/stylists/${entity.id}/services`} className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'flex items-center')}>
               <Scissors className="mr-2 h-4 w-4" />
               Servicii
             </Link>
           )}
        */}
    </GenericDisplayCard>
  )
}
