// app/admin/services/components/service-table-headers.ts

interface TableHeaderConfig {
  label: string
  className?: string
  hideOnMobile?: boolean
}

export const SERVICE_TABLE_HEADERS: TableHeaderConfig[] = [
  // Lățimile pentru coloanele de text vor fi determinate de spațiul rămas,
  // după ce coloanele cu lățime fixă își iau spațiul.
  { label: 'Nume', className: 'text-left border-r' },
  { label: 'Descriere', className: 'text-left border-r' },
  // !!!!!!!!!!!! Adaugă lățimi fixe pentru coloane !!!!!!!!!!!!
  { label: 'Durata (min)', className: 'text-right border-r w-[90px]' },
  { label: 'Preț', className: 'text-right border-r w-[120px]' },
  { label: 'Categorie', className: 'text-left border-r w-[180px]' },
  { label: 'Activ', className: 'text-right border-r w-[70px]' },
  { label: 'Acțiuni', className: 'text-right w-[180px]' },
]
