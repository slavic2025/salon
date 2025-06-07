// src/app/(dashboard)/admin/services/_components/service-table-headers.ts
import { TableHeaderConfig } from '@/types/ui.types'

export const SERVICE_TABLE_HEADERS: TableHeaderConfig[] = [
  { label: 'Nume', className: 'text-left' },
  { label: 'Descriere', className: 'text-left' },
  // Aliniem la dreapta coloanele numerice
  { label: 'Durata (min)', className: 'text-right w-[120px]' },
  { label: 'Preț', className: 'text-right w-[120px]' },
  { label: 'Categorie', className: 'text-left' },
  // Aliniem la centru coloana "Activ"
  { label: 'Activ', className: 'text-center w-[100px]' },
  // Aliniem la dreapta coloana "Acțiuni"
  { label: 'Acțiuni', className: 'text-right w-[220px]' },
]
