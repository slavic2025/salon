// src/app/(dashboard)/admin/stylists/[id]/services/_components/offered-service-table-headers.ts
import { TableHeaderConfig } from '@/types/ui.types'

export const OFFERED_SERVICE_TABLE_HEADERS: TableHeaderConfig[] = [
  { label: 'Serviciu (Bază)', className: 'w-[25%]' },
  // Aliniem la dreapta coloanele cu prețuri și durate
  { label: 'Preț Custom', className: 'text-right' },
  { label: 'Durată Custom (min)', className: 'text-right' },
  { label: 'Preț Standard', className: 'text-right' },
  { label: 'Durată Standard (min)', className: 'text-right' },
  // Aliniem la centru coloana "Activ"
  { label: 'Activ', className: 'text-center w-[100px]' },
  // Aliniem la dreapta coloana "Acțiuni"
  { label: 'Acțiuni', className: 'text-right w-[220px]' },
]
