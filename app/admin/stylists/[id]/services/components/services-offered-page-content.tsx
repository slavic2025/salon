// app/admin/stylists/[id]/services/components/services-offered-page-content.tsx
'use client'

import React from 'react'
import { createLogger } from '@/lib/logger'
import { StylistData } from '@/app/admin/stylists/types' // Tipul pentru stilist
import { ServicesOfferedData } from '../types' // Tipul pentru serviciile oferite (din directorul curent)
import { Tables } from '@/types/database.types' // Tipul general pentru tabelul services

import { Button } from '@/components/ui/button' // Va fi folosit pentru butonul "Adaugă Serviciu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { EmptyState } from '@/components/ui/empty-state'
import { ActiveBadge } from '@/components/ui/active-badge'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants' //

// Vom crea aceste componente ulterior:
import { AddOfferedServiceDialog } from './add-offered-service-dialog'
import { DeleteOfferedServiceButton } from './delete-offered-service-button' // O componentă dedicată pentru butonul de ștergere
import { EditOfferedServiceDialog } from './edit-offered-service-dialog'

const logger = createLogger('ServicesOfferedPageContent')

interface ServicesOfferedPageContentProps {
  stylist: StylistData
  initialServicesOffered: ServicesOfferedData[]
  availableServices: Tables<'services'>[] // Toate serviciile disponibile în salon
}

export function ServicesOfferedPageContent({
  stylist,
  initialServicesOffered,
  availableServices,
}: ServicesOfferedPageContentProps) {
  logger.debug(`Rendering ServicesOfferedPageContent for stylist: ${stylist.name}`, {
    servicesOfferedCount: initialServicesOffered.length,
    availableServicesCount: availableServices.length,
  })

  // TODO: Implementare stare locală dacă este necesară actualizarea listei fără refresh de pagină complet
  // const [servicesOffered, setServicesOffered] = useState(initialServicesOffered);

  const COL_SPAN_COUNT = 6 // Ajustează în funcție de numărul de coloane

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Servicii Oferite de {stylist.name}</h1>
          <p className="text-muted-foreground">
            Gestionați serviciile pe care le oferă acest stilist, inclusiv prețuri și durate personalizate.
          </p>
        </div>
        {/* Buton pentru a deschide dialogul de adăugare a unui nou serviciu oferit */}
        <AddOfferedServiceDialog stylistId={stylist.id} availableServices={availableServices} />
      </div>

      {/* Tabel pentru afișarea serviciilor oferite */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nume Serviciu (Bază)</TableHead>
              <TableHead>Preț Custom</TableHead>
              <TableHead>Durată Custom (min)</TableHead>
              <TableHead>Preț Standard</TableHead>
              <TableHead>Durată Standard (min)</TableHead>
              <TableHead>Activ</TableHead>
              <TableHead className="text-right">Acțiuni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialServicesOffered.length > 0 ? (
              initialServicesOffered.map((offeredService) => {
                // Extragem detaliile serviciului de bază dacă sunt disponibile
                // (presupunând că `fetchServicesOfferedByStylist` le include)
                const baseService = offeredService.services

                return (
                  <TableRow key={offeredService.id}>
                    <TableCell className="font-medium">{baseService?.name || 'N/A'}</TableCell>
                    <TableCell>
                      {offeredService.custom_price !== null && offeredService.custom_price !== undefined
                        ? `${offeredService.custom_price.toFixed(2)} ${DEFAULT_CURRENCY_SYMBOL}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {offeredService.custom_duration !== null && offeredService.custom_duration !== undefined
                        ? `${offeredService.custom_duration} min`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {baseService?.price !== null && baseService?.price !== undefined
                        ? `${baseService.price.toFixed(2)} ${DEFAULT_CURRENCY_SYMBOL}`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {baseService?.duration_minutes !== null && baseService?.duration_minutes !== undefined
                        ? `${baseService.duration_minutes} min`
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <ActiveBadge isActive={offeredService.is_active} /> {/* */}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <EditOfferedServiceDialog offeredService={offeredService} availableServices={availableServices} />
                      <DeleteOfferedServiceButton
                        offeredServiceId={offeredService.id}
                        stylistIdForRevalidation={stylist.id} // Pentru revalidarea corectă a căii
                        serviceName={baseService?.name || offeredService.id}
                      />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={COL_SPAN_COUNT} className="h-24 text-center">
                  <EmptyState message="Acest stilist nu are încă niciun serviciu asociat." /> {/* */}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* TODO: Adaugă vizualizare pe carduri pentru mobil, similar cu ServicesPageContent / StylistsPageContent */}
    </div>
  )
}
