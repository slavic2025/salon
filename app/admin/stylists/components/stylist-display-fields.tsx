// app/admin/stylists/components/stylist-display-fields.ts
import React from 'react' // Necesare pentru React.ReactNode în format
import { StylistData } from '../types'

interface DisplayFieldConfig<T> {
  id: keyof T
  label: string
  hideIfEmpty?: boolean // Dacă câmpul trebuie ascuns dacă este gol/null
  format?: (value: T[keyof T]) => React.ReactNode // Funcție opțională pentru formatarea valorii
}

export const STYLIST_DISPLAY_FIELDS: DisplayFieldConfig<StylistData>[] = [
  {
    id: 'email',
    label: 'Email',
    hideIfEmpty: false, // Emailul ar trebui să fie întotdeauna prezent conform schemei Zod
  },
  {
    id: 'phone',
    label: 'Telefon',
    hideIfEmpty: true, // Telefonul poate fi null sau gol
  },
  {
    id: 'is_active',
    label: 'Activ',
    // Folosim o funcție de formatare pentru a afișa booleanul ca "Da" sau "Nu"
    format: (value) => (typeof value === 'boolean' ? (value ? 'Da' : 'Nu') : String(value)),
  },
]
