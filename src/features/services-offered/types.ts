// app/admin/stylists/[id]/services/types.ts
import { ActionResponse as GenericActionResponse } from '@/types/types'
import { Tables, TablesInsert } from '@/types/database.types' // Importă tipurile Supabase
import { z } from 'zod'
import { zBooleanCheckboxDefaultTrue } from '@/config/validation/fields'

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

export const addOfferedServiceSchema = z.object({
  service_id: z.string().uuid({ message: 'ID-ul serviciului este obligatoriu și trebuie să fie un UUID valid.' }),
  custom_price: z.preprocess(
    (val) => (val === '' || val === null || val === undefined ? undefined : parseFloat(String(val))),
    z
      .number()
      .positive({ message: 'Prețul custom trebuie să fie un număr pozitiv.' })
      .multipleOf(0.01, { message: 'Prețul custom poate avea maxim două zecimale.' })
      .optional()
      .nullable()
  ),
  custom_duration: z.preprocess(
    // Am schimbat numele pentru consistență cu tabela
    (val) => (val === '' || val === null || val === undefined ? undefined : parseInt(String(val), 10)),
    z
      .number()
      .int()
      .positive({ message: 'Durata custom trebuie să fie un număr întreg pozitiv.' })
      .optional()
      .nullable()
  ),
  is_active: zBooleanCheckboxDefaultTrue,
  // stylist_id va fi adăugat în Server Action, nu vine direct din formularul de adăugare general
})

export const editOfferedServiceSchema = addOfferedServiceSchema.extend({
  id: z.string().uuid({ message: 'ID-ul înregistrării services_offered este invalid.' }),
  // Aici stylist_id și service_id nu ar trebui să fie modificabile direct prin acest formular,
  // dar le păstrăm pentru validare dacă sunt trimise (deși probabil vor fi hidden fields sau scoase)
  stylist_id: z.string().uuid({ message: 'ID-ul stilistului este invalid.' }),
})

// Schema pentru ștergerea unei intrări din services_offered
export const deleteOfferedServiceSchema = z
  .string()
  .uuid('ID-ul asocierii serviciu-stilist trebuie să fie un UUID valid.')
