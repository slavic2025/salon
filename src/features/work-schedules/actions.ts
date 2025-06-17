// src/features/schedules/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { createWorkScheduleRepository } from '@/core/domains/work-schedules/work-schedule.repository'
import { createWorkScheduleService } from '@/core/domains/work-schedules/work-schedule.service'
import { WORK_SCHEDULE_CONSTANTS } from '@/core/domains/work-schedules/work-schedule.constants'
import { handleError } from '@/lib/action-helpers'
import { formDataToObject } from '@/lib/form-utils'
import type { ActionResponse } from '@/types/actions.types'

async function getWorkScheduleService() {
  const supabase = await createClient()
  const repository = createWorkScheduleRepository(supabase)
  return createWorkScheduleService(repository)
}

export async function addWorkScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const scheduleService = await getWorkScheduleService()
    await scheduleService.createWorkSchedule(rawData)

    revalidatePath(WORK_SCHEDULE_CONSTANTS.PATHS.revalidate.schedule(rawData.stylistId as string))
    return { success: true, message: WORK_SCHEDULE_CONSTANTS.MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    return handleError(error, 'addWorkScheduleAction')
  }
}

export async function deleteWorkScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  try {
    const scheduleService = await getWorkScheduleService()
    await scheduleService.deleteWorkSchedule(rawData)

    // stylistId trebuie pasat cumva pentru revalidare
    revalidatePath('/some-path-to-revalidate')
    return { success: true, message: WORK_SCHEDULE_CONSTANTS.MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, 'deleteWorkScheduleAction')
  }
}
