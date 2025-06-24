'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createScheduleRepository } from '@/core/domains/schedules/schedule.repository'
import { createScheduleService } from '@/core/domains/schedules/schedule.service'
import { SCHEDULE_CONSTANTS } from '@/core/domains/schedules/schedule.constants'
import { handleError } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import type { ActionResponse } from '@/types/actions.types'

/**
 * Funcție ajutătoare care asamblează serviciul pentru programul de lucru
 * cu toate dependențele sale, pentru o singură cerere.
 */
export async function getScheduleService() {
  const supabase = await createClient()
  const repository = createScheduleRepository(supabase)
  return createScheduleService(repository)
}

/**
 * Acțiune pentru adăugarea unui nou interval în programul de lucru.
 */
export async function addScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const scheduleService = await getScheduleService()
    // Serviciul se ocupă de validarea `rawData`
    await scheduleService.createSchedule(rawData)

    // Revalidăm calea specifică stilistului pentru a actualiza UI-ul
    const stylistId = rawData.stylistId
    if (typeof stylistId === 'string') {
      revalidatePath(SCHEDULE_CONSTANTS.PATHS.revalidate.schedule(stylistId))
    }

    return { success: true, message: SCHEDULE_CONSTANTS.MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    // Folosim mesajul de eroare din constante
    return handleError(error, SCHEDULE_CONSTANTS.MESSAGES.ERROR.SERVER.CREATE)
  }
}

/**
 * Acțiune pentru ștergerea unui interval din programul de lucru.
 */
export async function deleteScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const scheduleService = await getScheduleService()
    // Serviciul se ocupă de validarea `rawData` (care conține doar `id`)
    await scheduleService.deleteSchedule(rawData)

    // NOTĂ: Pentru a revalida corect, formularul de ștergere ar trebui să includă
    // un câmp ascuns `stylistId` pentru a avea acces la el aici.
    const stylistId = rawData.stylistId // Presupunând că este trimis
    if (typeof stylistId === 'string') {
      revalidatePath(SCHEDULE_CONSTANTS.PATHS.revalidate.schedule(stylistId))
    }

    return { success: true, message: SCHEDULE_CONSTANTS.MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    // Folosim mesajul de eroare din constante
    return handleError(error, SCHEDULE_CONSTANTS.MESSAGES.ERROR.SERVER.DELETE)
  }
}
