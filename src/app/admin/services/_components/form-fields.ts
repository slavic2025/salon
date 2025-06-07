// app/admin/services/form-fields.ts
import { ServiceData } from '@/features/services/types'
import { DEFAULT_CURRENCY_SYMBOL } from '@/lib/constants'
/**
 * Definește structura unui singur câmp de formular.
 * `@property {keyof ServiceData}` id - Numele unic al câmpului, care corespunde unei proprietăți din ServiceData
 * `@property {string}` label - Textul afișat ca etichetă a câmpului în UI
 * `@property {'text' | 'number' | 'checkbox' | 'email' | 'password' | 'textarea'}` type - Tipul input-ului HTML
 * `@property {string}` [step] - Atributul 'step' pentru input-urile de tip 'number' (ex: '0.01' pentru zecimale)
 * `@property {boolean}` [required] - Indică dacă câmpul este obligatoriu (pentru validare și UI)
 * `@property {string}` [placeholder] - Textul de placeholder pentru input
 */
interface FormField {
  id: keyof ServiceData
  label: string
  type: 'text' | 'number' | 'checkbox' | 'email' | 'password' | 'textarea'
  step?: string
  required?: boolean
  placeholder?: string
}

/**
 * O constantă care definește toate câmpurile pentru formularele de servicii.
 * Această listă este folosită pentru a genera dinamic câmpurile în ServiceFormFields.tsx.
 */
export const SERVICE_FORM_FIELDS: FormField[] = [
  {
    id: 'name',
    label: 'Nume',
    type: 'text',
    required: true,
    placeholder: 'Ex: Tuns, Coafat',
  },
  {
    id: 'description',
    label: 'Descriere',
    type: 'textarea',
    placeholder: 'O scurtă descriere a serviciului.',
  },
  {
    id: 'duration_minutes',
    label: 'Durata (min)',
    type: 'number',
    required: true,
    placeholder: 'Ex: 60',
  },
  {
    id: 'price',
    label: `Preț (${DEFAULT_CURRENCY_SYMBOL})`,
    type: 'number',
    step: '0.01',
    required: true,
    placeholder: 'Ex: 50.00',
  },
  {
    id: 'category',
    label: 'Categorie',
    type: 'text',
    placeholder: 'Ex: Păr, Unghii, Masaj',
  },
  {
    id: 'is_active',
    label: 'Activ',
    type: 'checkbox',
  },
]
