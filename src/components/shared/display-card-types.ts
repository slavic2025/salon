// components/shared/display-card-types.ts
import React from 'react'

// Interfață de bază pentru un element afișat într-un card
// Toate entitățile (Service, Stylist) trebuie să extindă această interfață
export interface DisplayItem extends Record<string, unknown> {
  id: string
  name?: string // Numele este util pentru titlul cardului și aria-label
  description?: string | null // Descrierea este utilă pentru CardDescription, poate fi null
}

// Interfață pentru configurația unui singur câmp de afișare
export interface DisplayFieldConfig<T extends DisplayItem> {
  id: keyof T // Cheia proprietății din obiectul T (e.g., 'duration_minutes', 'email')
  label: string // Eticheta de afișat (e.g., "Durată (minute)", "Email")
  format?: (value: T[keyof T]) => React.ReactNode // Funcție opțională pentru a formata valoarea
  hideIfEmpty?: boolean // Dacă câmpul trebuie ascuns dacă valoarea este goală/null/undefined
  className?: string // Clase CSS suplimentare pentru div-ul câmpului
}
