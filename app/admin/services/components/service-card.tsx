// app/admin/services/components/service-card.tsx
'use client'

import { ServiceData } from '@/app/admin/services/types'
import { deleteServiceActionForm } from '@/app/admin/services/actions'
import { EditServiceDialog } from '@/app/admin/services/components/edit-service-dialog'
import { SubmitButton } from '@/components/ui/submit-button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SERVICE_DISPLAY_FIELDS } from './service-display-fields'
import { createLogger } from '@/lib/logger'

const logger = createLogger('ServiceCard')

interface ServiceCardProps {
  service: ServiceData
}

export function ServiceCard({ service }: ServiceCardProps) {
  logger.debug('Rendering ServiceCard', { serviceId: service.id, serviceName: service.name })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{service.name}</CardTitle>
        {service.description && <CardDescription className="text-gray-600">{service.description}</CardDescription>}
      </CardHeader>
      <CardContent className="grid gap-2">
        {SERVICE_DISPLAY_FIELDS.map((field) => {
          const value = service[field.id]

          if (field.hideIfEmpty && (!value || (typeof value === 'string' && value.trim() === ''))) {
            logger.debug(`Hiding empty field "${field.id}" for service "${service.name}"`)
            return null
          }

          return (
            <div key={field.id} className="flex items-center justify-between">
              <span className="font-semibold">{field.label}:</span>
              <span>
                {field.format ? (field.format as (val: typeof value) => React.ReactNode)(value) : String(value)}
              </span>
            </div>
          )
        })}
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
