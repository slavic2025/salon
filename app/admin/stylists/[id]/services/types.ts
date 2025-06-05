// app/admin/stylists/[id]/services/types.ts
import { ActionResponse as GenericActionResponse } from '@/lib/types'
import { Tables, TablesInsert } from '@/types/database.types' // Importă tipurile Supabase

// Extindem tipul generat pentru a include opțional detaliile serviciului
export type ServicesOfferedData = Tables<'services_offered'> & {
  services?: Pick<
    Tables<'services'>,
    'name' | 'duration_minutes' | 'price' | 'description' | 'category' | 'is_active'
  > | null
}

// Tipul pentru datele din formular la adăugare/modificare
// Omit câmpurile auto-generate sau cele care vin din context (stylist_id)
export type ServicesOfferedFormDataType = Omit<
  TablesInsert<'services_offered'>,
  'id' | 'created_at' | 'updated_at' | 'stylist_id'
> & {
  // Poate vei dori să incluzi service_id aici dacă formularul selectează un serviciu existent
  service_id: string // Asigură-te că service_id este prezent
}

// Tipul pentru răspunsul acțiunilor specifice acestui modul
export type ServicesOfferedActionResponse = GenericActionResponse<
  Partial<Record<keyof ServicesOfferedFormDataType, string[]>>
>
