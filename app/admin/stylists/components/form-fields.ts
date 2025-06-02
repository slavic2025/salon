// app/admin/stylists/components/form-fields.ts
import { TablesInsert } from '@/types/database.types' // Asigură-te că acest import este corect pentru tipurile tale Supabase

// Definește structura pentru o configurație de câmp de formular
interface FormFieldConfig<T> {
  id: keyof T // Numele proprietății din obiectul de date (ex: 'name', 'email')
  label: string // Eticheta afișată în UI
  type: 'text' | 'email' | 'tel' | 'textarea' | 'checkbox' | 'number' // Tipul de input HTML
  required?: boolean // Dacă este un câmp obligatoriu
  placeholder?: string // Text placeholder pentru input
  step?: string // Pentru inputuri de tip 'number'
}

// Configurația câmpurilor pentru formularul de stilist
// Utilizează TablesInsert<'stylists'> dacă tipul tău de insert pentru tabelul 'stylists' este definit acolo
export const STYLIST_FORM_FIELDS: FormFieldConfig<TablesInsert<'stylists'>>[] = [
  {
    id: 'name',
    label: 'Nume',
    type: 'text',
    required: true,
    placeholder: 'Numele complet al stilistului',
  },
  {
    id: 'email',
    label: 'Email',
    type: 'email',
    required: true,
    placeholder: 'adresa.email@exemplu.com',
  },
  {
    id: 'phone',
    label: 'Telefon',
    type: 'tel', // Tipul 'tel' pentru numere de telefon
    required: false,
    placeholder: 'Număr de telefon (opțional)',
  },
  {
    id: 'description',
    label: 'Descriere',
    type: 'textarea', // Pentru un câmp de text multilinie
    required: false,
    placeholder: 'Câteva cuvinte despre stilist (opțional)',
  },
  {
    id: 'is_active',
    label: 'Activ',
    type: 'checkbox', // Pentru un checkbox
    required: false, // Checkbox-urile nu sunt de obicei "obligatorii"
  },
]
