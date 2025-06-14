// src/core/domains/appointments/appointment.types.ts
import type { Database } from '@/types/database.types'
import { z } from 'zod'

// Tipul de bază, generat din schema bazei de date
export type Appointment = Database['public']['Tables']['appointments']['Row']

// Schema Zod pentru validarea datelor primite de la formularul public
export const createAppointmentSchema = z.object({
  serviceId: z.string().uuid('ID-ul serviciului este invalid'),
  stylistId: z.string().uuid('ID-ul stilistului este invalid'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formatul datei trebuie să fie AAAA-LL-ZZ'),
  time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formatul orei trebuie să fie HH:MM'),
  duration: z.number().int().positive('Durata trebuie să fie un număr pozitiv'),
  clientName: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
  clientEmail: z.string().email('Adresa de email este invalidă'),
  clientPhone: z.string().min(6, 'Numărul de telefon trebuie să aibă cel puțin 6 caractere'),
  notes: z.string().nullable().optional(),
})
