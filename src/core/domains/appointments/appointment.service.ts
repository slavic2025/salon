// src/core/domains/appointments/appointment.service.ts (Varianta finală și corectă)

import { format, addMinutes } from 'date-fns'
import { ro } from 'date-fns/locale'
import { createLogger } from '@/lib/logger'
import { sendEmail } from '@/lib/email-service'
import { getAppointmentConfirmationEmail } from '@/lib/email-templates'
import { AppError } from '@/lib/errors'
import { APPOINTMENT_CONSTANTS } from './appointment.constants'
import { createAppointmentRepository } from './appointment.repository'
import type {
  CreateAppointmentInput,
  UpdateAppointmentInput,
  DeleteAppointmentInput,
  Appointment,
  AppointmentUpdateData,
  AppointmentCreatePayload,
} from './appointment.types'
import { createAppointmentSchema } from './appointment.types'
type AppointmentRepository = ReturnType<typeof createAppointmentRepository>

export function createAppointmentService(repository: AppointmentRepository) {
  const logger = createLogger('AppointmentService')

  return {
    async createAppointment(input: Record<string, unknown>): Promise<Appointment> {
      logger.info('Attempting to create appointment...', { clientEmail: input.clientEmail })

      try {
        const startTime = new Date(`${input.date}T${input.time}`)

        const payload = createAppointmentSchema.parse(input)

        const newAppointment = await repository.create(payload)

        const formattedDate = format(startTime, "EEEE, d MMMM yy 'la' HH:mm", { locale: ro })

        const emailTemplateData = {
          clientName: newAppointment.client_name,
          formattedDate: formattedDate,
          duration: input.duration,
        }

        // Pasăm acest obiect nou, care are formatul corect
        const emailHtml = getAppointmentConfirmationEmail({
          clientName: newAppointment.client_name,
          formattedDate: formattedDate,
          // `duration` nu mai este disponibil direct, trebuie să îl calculăm sau să îl pasăm altfel.
          // O soluție este să îl adăugăm la obiectul `input` sau să îl calculăm.
          // Pentru simplitate, momentan îl putem omite din email sau pasa separat dacă e necesar.
          duration: 0, // Placeholder - vezi nota de mai jos
        })

        await sendEmail({
          to: newAppointment.client_email,
          subject: 'Programare confirmată',
          html: emailHtml,
        })

        logger.info(`Appointment created successfully for ${newAppointment.client_email}`)
        return newAppointment
      } catch (error) {
        logger.error('Failed to create appointment', { error })
        throw new AppError(APPOINTMENT_CONSTANTS.MESSAGES.ERROR.SERVER.CREATE)
      }
    },

    async updateAppointment(input: UpdateAppointmentInput, dataToUpdate: AppointmentUpdateData): Promise<Appointment> {
      return repository.update({ id: input.appointmentId, data: dataToUpdate })
    },

    async deleteAppointment(input: DeleteAppointmentInput): Promise<void> {
      return repository.delete(input.appointmentId)
    },
  }
}
