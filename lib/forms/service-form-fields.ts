// lib/forms/service-form-fields.ts
import { Service } from '@/lib/db/service-core' // Importăm tipul Service

export type ServiceFormField = {
  id: keyof Omit<Service, 'id' | 'created_at' | 'updated_at'> // ID-urile câmpurilor, corespund cu cheile din Service
  label: string
  type: 'text' | 'number' | 'checkbox'
  step?: string // Pentru input type="number"
  required?: boolean
}

// Definește configurația pentru câmpurile formularului de servicii
export const SERVICE_FORM_FIELDS: ServiceFormField[] = [
  { id: 'name', label: 'Nume', type: 'text', required: true },
  { id: 'description', label: 'Descriere', type: 'text' },
  { id: 'duration_minutes', label: 'Durata (min)', type: 'number', required: true },
  { id: 'price', label: 'Preț', type: 'number', step: '0.01', required: true },
  { id: 'category', label: 'Categorie', type: 'text' },
  { id: 'is_active', label: 'Activ', type: 'checkbox' },
]
