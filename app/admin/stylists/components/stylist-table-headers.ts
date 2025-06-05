// app/admin/stylists/components/stylist-table-headers.ts

import { TableHeaderConfig } from '@/lib/types'

export const STYLIST_TABLE_HEADERS: TableHeaderConfig[] = [
  { label: 'Nume', className: 'text-left border-r w-[100px]' }, // Lățime fixă pentru nume, ar trebui să fie suficient
  { label: 'Email', className: 'text-left border-r w-[150px]' }, // Lățime fixă pentru email
  { label: 'Telefon', className: 'text-left border-r w-[120px]' }, // Lățime fixă pentru telefon
  { label: 'Descriere', className: 'text-left border-r w-[120px]' }, // Descrierea poate varia, lăsăm-o să ocupe spațiul rămas
  { label: 'Activ', className: 'text-center border-r w-[70px]' }, // Centrare pentru boolean
  { label: 'Acțiuni', className: 'text-right w-[200px]' }, // Acțiunile standard (edit/delete)
]
