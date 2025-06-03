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

// ================= LOGIN =================
export const loginSchema = z.object({
  email: zEmailRequired,
  password: zPasswordRequired,
})

// ================= SERVICE =================

export const addServiceSchema = z.object({
  name: zStringMin(1, 'Numele serviciului este obligatoriu.'),
  description: zStringMin(1, 'Descrierea serviciului este obligatorie.'),
  duration_minutes: zIntFromForm('Durata trebuie să fie un număr întreg pozitiv.'),
  price: zPriceFromForm,
  is_active: zBooleanCheckboxDefaultTrue,

  category: zStringMin(1, 'Categoria serviciului este obligatorie.'),
})

export const editServiceSchema = addServiceSchema.extend({
  id: z.string().uuid({ message: 'ID-ul serviciului este invalid.' }),
})

// ================= STYLIST =================
// Definim structura de bază a unui stilist.
export const addStylistSchema = z.object({
  name: zStringMin(3, 'Numele stilistului trebuie să aibă minim 3 caractere.'),
  email: zEmailRequired,
  phone: zPhoneRequired,
  description: zStringMin(1, 'Descrierea stilistului este obligatorie.'),
  is_active: zBooleanCheckboxDefaultTrue,
})

export const editStylistSchema = addStylistSchema

// ================= DELETE SCHEMAS =================
// Acestea validează direct ID-ul, nu un obiect complex.
export const DeleteStylistSchema = z.string().uuid('ID-ul stilistului trebuie să fie un UUID valid.')
export const DeleteServiceSchema = z.string().uuid('ID-ul serviciului trebuie să fie un UUID valid.')
