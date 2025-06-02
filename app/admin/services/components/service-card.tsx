// app/admin/services/components/service-card.tsx
'use client'

import { ServiceData } from '@/app/admin/services/types'
// !!!!!!!!! MODIFICARE AICI: Importă funcția wrapper corectă !!!!!!!!!
import { deleteServiceActionForm } from '@/app/admin/services/actions' // Acum importăm deleteServiceActionForm
import { EditServiceDialog } from '@/app/admin/services/components/edit-service-dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'

interface ServiceCardProps {
  service: ServiceData
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        {service.description && <CardDescription className="text-gray-600">{service.description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold">Durata:</span>
          <span>{service.duration_minutes} min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">Preț:</span>
          <span>
            {service.price.toFixed(2)} {DEFAULT_CURRENCY_SYMBOL}
          </span>
        </div>
        {service.category && (
          <div className="flex items-center justify-between">
            <span className="font-semibold">Categorie:</span>
            <span>{service.category}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-semibold">Activ:</span>
          <span>
            {service.is_active ? (
              <span className="text-green-600 font-medium">Da</span>
            ) : (
              <span className="text-red-600 font-medium">Nu</span>
            )}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        <EditServiceDialog service={service} />
        <form action={deleteServiceActionForm}>
          <input type="hidden" name="id" value={service.id} />
          <SubmitButton variant="destructive" size="sm">
            Șterge
          </SubmitButton>
        </form>
      </CardFooter>
    </Card>
  )
}
