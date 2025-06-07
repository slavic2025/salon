// app/admin/services/components/service-table-headers.ts

import { TableHeaderConfig } from '@/types/types'

export const SERVICE_TABLE_HEADERS: TableHeaderConfig[] = [
  { label: 'Nume', className: 'text-left border-r' },
  { label: 'Descriere', className: 'text-left border-r' },
  { label: 'Durata (min)', className: 'text-right border-r w-[90px]' },
  { label: 'Preț', className: 'text-right border-r w-[120px]' },
  { label: 'Categorie', className: 'text-left border-r w-[180px]' },
  { label: 'Activ', className: 'text-right border-r w-[70px]' },
  { label: 'Acțiuni', className: 'text-right w-[180px]' },
]
