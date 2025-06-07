// app/admin/services/components/service-display-fields.tsx
import React from 'react'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'
import { ServiceData } from '@/features/services/types'

/**
 * Definește structura unui câmp pentru afișarea detaliilor serviciului.
 * Folosește un generic `T` pentru a tipa valoarea formatată.
 * @property {keyof ServiceData} id - Cheia proprietății din ServiceData.
 * @property {string} label - Textul etichetei afișate (ex: "Durata").
 * @property {(value: T) => React.ReactNode} format - Funcție opțională pentru a formata valoarea.
 * @property {boolean} [hideIfEmpty] - Dacă true, nu afișează câmpul dacă valoarea este goală/falsă.
 */
interface ServiceDisplayField<T> {
  id: keyof ServiceData
  label: string
  format?: (value: T) => React.ReactNode
  hideIfEmpty?: boolean
}

export const SERVICE_DISPLAY_FIELDS: (
  | ServiceDisplayField<string>
  | ServiceDisplayField<number>
  | ServiceDisplayField<boolean>
)[] = [
  {
    id: 'duration_minutes',
    label: 'Durata',
    format: (value: number) => `${value} min`,
  },
  {
    id: 'price',
    label: 'Preț',
    format: (value: number) => `${value.toFixed(2)} ${DEFAULT_CURRENCY_SYMBOL}`,
  },
  {
    id: 'category',
    label: 'Categorie',
    hideIfEmpty: true,
  },
  {
    id: 'is_active',
    label: 'Activ',
    format: (value: boolean) =>
      value ? (
        <span className="text-green-600 font-medium">Da</span>
      ) : (
        <span className="text-red-600 font-medium">Nu</span>
      ),
  },
]
