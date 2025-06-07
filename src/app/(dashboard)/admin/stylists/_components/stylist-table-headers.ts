// src/app/(dashboard)/admin/stylists/_components/stylist-table-headers.ts
import { TableHeaderConfig } from '@/types/ui.types'

export const STYLIST_TABLE_HEADERS: TableHeaderConfig[] = [
  { label: 'Nume', className: 'text-left' },
  { label: 'Email', className: 'text-left' },
  { label: 'Telefon', className: 'text-left' },
  { label: 'Descriere', className: 'text-left' },
  // Centram antetul pentru coloana "Activ"
  { label: 'Activ', className: 'text-center w-[100px]' },
  // Aliniem antetul "Acțiuni" la dreapta, la fel ca butoanele
  { label: 'Acțiuni', className: 'text-right w-[280px]' },
]
