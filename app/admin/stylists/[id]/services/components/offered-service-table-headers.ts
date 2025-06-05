// app/admin/stylists/[id]/services/components/offered-service-table-headers.ts
import { TableHeaderConfig } from '@/lib/types' //

export const OFFERED_SERVICE_TABLE_HEADERS: TableHeaderConfig[] = [
  { label: 'Serviciu (Bază)', className: 'text-left border-r w-[25%]' },
  { label: 'Preț Custom', className: 'text-right border-r w-[15%]' },
  { label: 'Durată Custom (min)', className: 'text-right border-r w-[15%]' },
  { label: 'Preț Standard', className: 'text-right border-r w-[15%]' },
  { label: 'Durată Standard (min)', className: 'text-right border-r w-[15%]' },
  { label: 'Activ', className: 'text-center border-r w-[5%]' },
  { label: 'Acțiuni', className: 'text-right w-[10%]' },
]
