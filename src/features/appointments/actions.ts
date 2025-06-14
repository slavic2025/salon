// src/features/appointments/actions.ts
'use server'

import { createLogger } from '@/lib/logger'
import { ActionResponse } from '@/types/actions.types'
import { createAppointmentSchema } from '@/core/domains/appointments/appointment.types'
import { appointmentRepository } from '@/core/domains/appointments/appointment.repository'
import { sendEmail } from '@/lib/email-service'
import { addMinutes, format } from 'date-fns'
import { ro } from 'date-fns/locale'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { formDataToObject } from '@/lib/form-utils'
import { formatZodErrors } from '../common/utils'

const logger = createLogger('AppointmentActions')

interface AppointmentCreateInput {
  serviceId: string
  stylistId: string
  date: string
  time: string
  duration: number
  clientName: string
  clientEmail: string
  clientPhone: string
  notes?: string | null
}

export async function createAppointmentAction(
  prevState: ActionResponse,
  data: FormData | Record<string, unknown>
): Promise<ActionResponse> {
  const rawData = data instanceof FormData ? formDataToObject(data) : data
  logger.debug('createAppointmentAction invoked', { rawData })

  const validationResult = createAppointmentSchema.safeParse(rawData)
  if (!validationResult.success) {
    return {
      success: false,
      message: 'Datele trimise sunt invalide.',
      errors: formatZodErrors(validationResult.error),
    }
  }

  try {
    // Calculăm timpul de început și sfârșit
    const startTime = new Date(`${validationResult.data.date}T${validationResult.data.time}`)
    const endTime = addMinutes(startTime, validationResult.data.duration)

    // Pregătim datele pentru crearea programării
    const appointmentData = {
      service_id: validationResult.data.serviceId,
      stylist_id: validationResult.data.stylistId,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      client_name: validationResult.data.clientName,
      client_email: validationResult.data.clientEmail,
      client_phone: validationResult.data.clientPhone,
      notes: validationResult.data.notes || null,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Creăm programarea în baza de date
    const appointment = await appointmentRepository.create(appointmentData)

    // Formatăm data pentru email
    const formattedDate = format(startTime, "EEEE, d MMMM yyyy 'la' HH:mm", { locale: ro })

    // Trimitem email de confirmare
    await sendEmail({
      to: validationResult.data.clientEmail,
      subject: 'Programare confirmată',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">Salut, ${validationResult.data.clientName}!</h2>
          <p>Programarea ta a fost confirmată pentru ${formattedDate}.</p>
          <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #111827; margin-top: 0;">Detalii Programare:</h3>
            <p><strong>Data și ora:</strong> ${formattedDate}</p>
            <p><strong>Durata:</strong> ${validationResult.data.duration} minute</p>
          </div>
          <p>Dacă ai întrebări, nu ezita să ne contactezi.</p>
          <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
            Acest email este generat automat, te rugăm să nu răspunzi la acest mesaj.
          </p>
        </div>
      `,
    })

    return {
      success: true,
      message: 'Programarea a fost creată cu succes.',
    }
  } catch (error) {
    logger.error('Error in createAppointmentAction', { error })
    return {
      success: false,
      message: 'A apărut o eroare la crearea programării.',
    }
  }
}
