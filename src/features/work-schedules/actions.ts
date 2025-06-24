'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createWorkScheduleRepository } from '@/core/domains/work-schedules/work-schedule.repository'
import { createWorkScheduleService } from '@/core/domains/work-schedules/work-schedule.service'
import { WORK_SCHEDULE_CONSTANTS } from '@/core/domains/work-schedules/work-schedule.constants'
import { handleError } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import type { ActionResponse } from '@/types/actions.types'

/**
 * Funcție ajutătoare care asamblează serviciul pentru programul de lucru
 * cu toate dependențele sale, pentru o singură cerere.
 */
export async function getWorkScheduleService() {
  const supabase = await createClient()
  const repository = createWorkScheduleRepository(supabase)
  return createWorkScheduleService(repository)
}

/**
 * Acțiune pentru adăugarea unui nou interval în programul de lucru.
 */
export async function addWorkScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const scheduleService = await getWorkScheduleService()
    // Serviciul se ocupă de validarea `rawData`
    await scheduleService.createWorkSchedule(rawData)

    // Revalidăm calea specifică stilistului pentru a actualiza UI-ul
    const stylistId = rawData.stylistId
    if (typeof stylistId === 'string') {
      revalidatePath(WORK_SCHEDULE_CONSTANTS.PATHS.revalidate.schedule(stylistId))
    }

    return { success: true, message: WORK_SCHEDULE_CONSTANTS.MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    // Folosim mesajul de eroare din constante
    return handleError(error, WORK_SCHEDULE_CONSTANTS.MESSAGES.ERROR.SERVER.CREATE)
  }
}

/**
 * Acțiune pentru ștergerea unui interval din programul de lucru.
 */
export async function deleteWorkScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const scheduleService = await getWorkScheduleService()
    // Serviciul se ocupă de validarea `rawData` (care conține doar `id`)
    await scheduleService.deleteWorkSchedule(rawData)

    // NOTĂ: Pentru a revalida corect, formularul de ștergere ar trebui să includă
    // un câmp ascuns `stylistId` pentru a avea acces la el aici.
    const stylistId = rawData.stylistId // Presupunând că este trimis
    if (typeof stylistId === 'string') {
      revalidatePath(WORK_SCHEDULE_CONSTANTS.PATHS.revalidate.schedule(stylistId))
    }

    return { success: true, message: WORK_SCHEDULE_CONSTANTS.MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    // Folosim mesajul de eroare din constante
    return handleError(error, WORK_SCHEDULE_CONSTANTS.MESSAGES.ERROR.SERVER.DELETE)
  }
}
