'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createAppointmentRepository } from '@/core/domains/appointments/appointment.repository'
import { createAppointmentService } from '@/core/domains/appointments/appointment.service'
import { deleteAppointmentSchema, updateAppointmentSchema } from '@/core/domains/appointments/appointment.types'
import { APPOINTMENT_CONSTANTS } from '@/core/domains/appointments/appointment.constants'
import { handleError, handleValidationError } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import type { ActionResponse } from '@/types/actions.types'

/**
 * Funcție ajutătoare care asamblează serviciul de programări
 * cu toate dependențele sale (client supabase, repository), pentru o singură cerere.
 */
async function getAppointmentService() {
  const supabase = await createClient()
  const repository = createAppointmentRepository(supabase)
  return createAppointmentService(repository)
}

/**
 * Acțiune pentru adăugarea unei noi programări.
 */
export async function addAppointmentAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  // 1. Doar colectăm datele brute din formular
  const rawData = formDataToObject(formData)

  try {
    // 2. Inițializăm serviciul
    const appointmentService = await getAppointmentService()

    // 3. Pasăm datele brute direct la serviciu.
    // Serviciul se va ocupa de validare și transformare.
    await appointmentService.createAppointment(rawData)

    revalidatePath(APPOINTMENT_CONSTANTS.PATHS.revalidate.list())
    return { success: true, message: APPOINTMENT_CONSTANTS.MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    // Dacă validarea din serviciu eșuează, eroarea va fi prinsă aici
    return handleError(error, APPOINTMENT_CONSTANTS.MESSAGES.ERROR.SERVER.CREATE)
  }
}

/**
 * Acțiune pentru editarea unei programări existente.
 */
export async function editAppointmentAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  const validationResult = updateAppointmentSchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  // Extragem ID-ul și datele de actualizat
  const { appointmentId, ...dataToUpdate } = validationResult.data

  try {
    const appointmentService = await getAppointmentService()
    await appointmentService.updateAppointment(
      { appointmentId }, // Primul argument pentru `updateAppointment`
      dataToUpdate // Al doilea argument
    )

    revalidatePath(APPOINTMENT_CONSTANTS.PATHS.revalidate.details(appointmentId))
    return { success: true, message: APPOINTMENT_CONSTANTS.MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    return handleError(error, APPOINTMENT_CONSTANTS.MESSAGES.ERROR.SERVER.UPDATE)
  }
}

/**
 * Acțiune pentru ștergerea unei programări.
 */
export async function deleteAppointmentAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  const validationResult = deleteAppointmentSchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  try {
    const appointmentService = await getAppointmentService()
    await appointmentService.deleteAppointment(validationResult.data)

    revalidatePath(APPOINTMENT_CONSTANTS.PATHS.revalidate.list())
    return { success: true, message: APPOINTMENT_CONSTANTS.MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, APPOINTMENT_CONSTANTS.MESSAGES.ERROR.SERVER.DELETE)
  }
}
