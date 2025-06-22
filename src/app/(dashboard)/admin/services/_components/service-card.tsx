'use client'

import { type Service } from '@/core/domains/services/service.types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/card'
import { Button } from '@/components/atoms/button'
import { ActiveBadge } from '@/components/molecules/active-badge'
import { EditServiceDialog } from './edit-service-dialog'
import { DeleteConfirmationDialog } from '@/components/molecules/delete-confirmation-dialog'
import { deleteServiceAction } from '@/features/services/actions'
import { formatCurrency } from '@/lib/formatters'
import { Trash2 } from 'lucide-react'

interface ServiceCardProps {
  service: Service
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{service.name}</CardTitle>
            <CardDescription>{service.description}</CardDescription>
          </div>
          <ActiveBadge isActive={service.is_active} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm">
              <strong>Preț:</strong> {formatCurrency(service.price)}
            </p>
            <p className="text-sm">
              <strong>Durată:</strong> {service.duration_minutes} min
            </p>
          </div>
          <div className="flex gap-2">
            <EditServiceDialog service={service} />

            {/* Utilizarea noului dialog compus. Este mult mai declarativ. */}
            <DeleteConfirmationDialog action={deleteServiceAction} itemId={service.id}>
              <DeleteConfirmationDialog.Trigger asChild>
                <Button variant="destructive" size="icon" aria-label="Șterge Serviciul">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Șterge Serviciul</span>
                </Button>
              </DeleteConfirmationDialog.Trigger>
              <DeleteConfirmationDialog.Content>
                <DeleteConfirmationDialog.Header>
                  <DeleteConfirmationDialog.Title>Confirmă Ștergerea</DeleteConfirmationDialog.Title>
                  <DeleteConfirmationDialog.Description>
                    Ești sigur că vrei să ștergi serviciul "{service.name}"? Această acțiune este ireversibilă.
                  </DeleteConfirmationDialog.Description>
                </DeleteConfirmationDialog.Header>
              </DeleteConfirmationDialog.Content>
            </DeleteConfirmationDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
