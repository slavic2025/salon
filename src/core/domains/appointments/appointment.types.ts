// src/core/domains/appointments/appointment.types.ts (Varianta refactorizată)

import type { Database } from '@/types/database.types'
import { z } from 'zod'
import { addMinutes } from 'date-fns'
import { APPOINTMENT_CONSTANTS } from './appointment.constants'

// --- Tipuri de Bază Derivate din DB ---

/** Tipul unei programări complete, așa cum există în baza de date. */
export type Appointment = Database['public']['Tables']['appointments']['Row']

/** Tipul datelor necesare pentru un UPDATE în baza de date. */
export type AppointmentUpdateData = Database['public']['Tables']['appointments']['Update']

/** Tipul payload-ului complet pentru metoda de update din repository. */
export type AppointmentUpdatePayload = {
  id: string
  data: AppointmentUpdateData
}

// --- Schema pentru CREAREA unei programări (cu transformare) ---

export const createAppointmentSchema = z
  .object({
    // Acestea sunt câmpurile pe care le primim de la formular (INPUT)
    serviceId: z.string().uuid('ID-ul serviciului este invalid'),
    stylistId: z.string().uuid('ID-ul stilistului este invalid'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formatul datei este invalid'),
    time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formatul orei este invalid'),
    duration: z.number().int().positive('Durata trebuie să fie un număr pozitiv'),
    clientName: z.string().min(2, 'Numele trebuie să aibă cel puțin 2 caractere'),
    clientEmail: z.string().email('Adresa de email este invalidă'),
    clientPhone: z.string().min(6, 'Numărul de telefon este invalid'),
    notes: z.string().nullable().optional(),
  })
  .transform((data) => {
    // Aici are loc transformarea datelor din formatul de input în formatul pentru DB
    const startTime = new Date(`${data.date}T${data.time}`)

    return {
      service_id: data.serviceId,
      stylist_id: data.stylistId,
      start_time: startTime.toISOString(),
      end_time: addMinutes(startTime, data.duration).toISOString(),
      client_name: data.clientName,
      client_email: data.clientEmail,
      client_phone: data.clientPhone,
      notes: data.notes || null,
      status: APPOINTMENT_CONSTANTS.STATUS.PENDING,
    }
  })

// Acum, tipurile noastre reflectă acest proces de transformare
export type CreateAppointmentInput = z.input<typeof createAppointmentSchema>
export type AppointmentCreatePayload = z.output<typeof createAppointmentSchema> // Tipul datelor gata pentru DB

// --- Scheme pentru UPDATE și DELETE ---

export const updateAppointmentSchema = z.object({
  appointmentId: z.string().uuid('ID-ul programării este invalid'),
  // Am adăugat câmpurile care pot fi actualizate, toate fiind opționale
  serviceId: z.string().uuid('ID-ul serviciului este invalid').optional(),
  stylistId: z.string().uuid('ID-ul stilistului este invalid').optional(),
  status: z.nativeEnum(APPOINTMENT_CONSTANTS.STATUS).optional(),
  notes: z.string().nullable().optional(),
})
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>

export const deleteAppointmentSchema = z.object({
  appointmentId: z.string().uuid('ID-ul programării este invalid'),
})
export type DeleteAppointmentInput = z.infer<typeof deleteAppointmentSchema>
