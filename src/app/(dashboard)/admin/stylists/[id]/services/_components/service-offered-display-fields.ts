// src/app/(dashboard)/admin/stylists/[id]/services/_components/service-offered-display-fields.ts
import { DisplayFieldConfig } from '@/components/shared/display-card-types'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'
import { ServiceOffered } from '@/core/domains/services-offered/services-offered.types'

// Definim câmpurile care vor fi afișate în secțiunea de detalii a cardului
export const SERVICE_OFFERED_DISPLAY_FIELDS: DisplayFieldConfig<ServiceOffered>[] = [
  {
    id: 'custom_price',
    label: 'Preț Custom',
    format: (value) => (value ? `${Math.round(Number(value))} ${DEFAULT_CURRENCY_SYMBOL}` : 'Standard'),
  },
  {
    id: 'custom_duration',
    label: 'Durată Custom',
    format: (value) => (value ? `${value} min` : 'Standard'),
  },
]
