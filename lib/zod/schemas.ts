// lib/zod/schemas.ts
import { z } from 'zod'
import {
  zEmailRequired,
  zPasswordRequired,
  zIntFromForm,
  zPriceFromForm,
  zStringMin,
  zBooleanCheckboxDefaultTrue,
  zPhoneRequired,
} from './fields'

// ================= SERVICE =================

// ================= STYLIST =================
// Definim structura de bază a unui stilist.
export const addStylistSchema = z.object({
  name: zStringMin(3, 'Numele stilistului trebuie să aibă minim 3 caractere.'),
  email: zEmailRequired,
  phone: zPhoneRequired,
  description: zStringMin(1, 'Descrierea stilistului este obligatorie.'),
  is_active: zBooleanCheckboxDefaultTrue,
})

export const editStylistSchema = addStylistSchema.extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

// ================= DELETE SCHEMAS =================
// Acestea validează direct ID-ul, nu un obiect complex.
export const DeleteStylistSchema = z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.')
export const DeleteServiceSchema = z.string().uuid('ID-ul serviciului trebuie să fie un UUID valid.')

// ================= SERVICES OFFERED (By Stylist) =================

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
export const DeleteOfferedServiceSchema = z
  .string()
  .uuid('ID-ul asocierii serviciu-stilist trebuie să fie un UUID valid.')
