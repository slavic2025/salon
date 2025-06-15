// src/features/schedule/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { scheduleRepository } from '@/core/domains/schedule/schedule.repository'
import {
  addScheduleSchema,
  editScheduleSchema,
  deleteScheduleSchema,
  Schedule,
} from '@/core/domains/schedule/schedule.types'
import { ActionResponse } from '@/types/actions.types'
import { formDataToObject } from '@/lib/form-utils'
import { SCHEDULE_MESSAGES, SCHEDULE_PATHS } from '@/core/domains/schedule/schedule.constants'
import { handleError, handleValidationError } from '@/lib/action-helpers'
import { ScheduleService } from '@/core/domains/schedule/schedule.service'

const logger = createLogger('ScheduleActions')
const scheduleService = new ScheduleService()

/**
 * Acțiune pentru adăugarea unei noi programări.
 */
export async function addScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())
  const validationResult = addScheduleSchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  try {
    await scheduleService.createSchedule(validationResult.data)
    revalidatePath(SCHEDULE_PATHS.revalidation())
    return { success: true, message: SCHEDULE_MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    return handleError(error, 'addScheduleAction')
  }
}

/**
 * Acțiune pentru editarea unei programări existente.
 */
export async function editScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('editScheduleAction invoked', { rawData })

  const validationResult = editScheduleSchema.safeParse(rawData)
  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  const { id, ...dataToUpdate } = validationResult.data

  try {
    await scheduleService.updateSchedule(id, dataToUpdate)
    revalidatePath(SCHEDULE_PATHS.revalidation())
    return { success: true, message: SCHEDULE_MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    return handleError(error, 'editScheduleAction')
  }
}

/**
 * Acțiune pentru ștergerea unei programări.
 */
export async function deleteScheduleAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const scheduleId = formData.get('id')
  const validationResult = deleteScheduleSchema.safeParse(scheduleId)
  if (!validationResult.success) {
    return { success: false, message: SCHEDULE_MESSAGES.ERROR.VALIDATION.INVALID_ID }
  }

  const validScheduleId = validationResult.data

  try {
    await scheduleService.deleteSchedule(validScheduleId)
    revalidatePath(SCHEDULE_PATHS.revalidation())
    return { success: true, message: SCHEDULE_MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, 'deleteScheduleAction')
  }
}

/**
 * Acțiune pentru preluarea tuturor programărilor.
 */
export async function getSchedulesAction(): Promise<Schedule[]> {
  try {
    const schedules = await scheduleRepository.fetchAll()
    logger.info('Schedules retrieved successfully', { count: schedules.length })
    return schedules
  } catch (error) {
    logger.error('Failed to fetch schedules', { error })
    return []
  }
}

/**
 * Acțiune pentru preluarea programărilor după stilist.
 */
export async function getSchedulesByStylistAction(stylistId: string) {
  if (!stylistId) {
    logger.warn('getSchedulesByStylistAction called with no stylistId')
    return { success: true, data: [] }
  }

  try {
    const schedules = await scheduleRepository.fetchByStylistId(stylistId)
    return { success: true, data: schedules }
  } catch (error) {
    return handleError(error, 'getSchedulesByStylistAction')
  }
}

/**
 * Acțiune pentru preluarea programărilor după client.
 */
export async function getSchedulesByClientAction(clientId: string) {
  if (!clientId) {
    logger.warn('getSchedulesByClientAction called with no clientId')
    return { success: true, data: [] }
  }

  try {
    const schedules = await scheduleRepository.fetchByClientId(clientId)
    return { success: true, data: schedules }
  } catch (error) {
    return handleError(error, 'getSchedulesByClientAction')
  }
}

/**
 * Acțiune pentru preluarea programărilor după serviciu.
 */
export async function getSchedulesByServiceAction(serviceId: string) {
  if (!serviceId) {
    logger.warn('getSchedulesByServiceAction called with no serviceId')
    return { success: true, data: [] }
  }

  try {
    const schedules = await scheduleRepository.fetchByServiceId(serviceId)
    return { success: true, data: schedules }
  } catch (error) {
    return handleError(error, 'getSchedulesByServiceAction')
  }
}

/**
 * Acțiune pentru preluarea programărilor după dată.
 */
export async function getSchedulesByDateAction(date: string) {
  if (!date) {
    logger.warn('getSchedulesByDateAction called with no date')
    return { success: true, data: [] }
  }

  try {
    const schedules = await scheduleRepository.fetchByDate(date)
    return { success: true, data: schedules }
  } catch (error) {
    return handleError(error, 'getSchedulesByDateAction')
  }
}

/**
 * Acțiune pentru preluarea programărilor după interval de date.
 */
export async function getSchedulesByDateRangeAction(startDate: string, endDate: string) {
  if (!startDate || !endDate) {
    logger.warn('getSchedulesByDateRangeAction called with invalid date range', { startDate, endDate })
    return { success: true, data: [] }
  }

  try {
    const schedules = await scheduleRepository.fetchByDateRange(startDate, endDate)
    return { success: true, data: schedules }
  } catch (error) {
    return handleError(error, 'getSchedulesByDateRangeAction')
  }
}

/**
 * Acțiune pentru preluarea programărilor după status.
 */
export async function getSchedulesByStatusAction(status: string) {
  if (!status) {
    logger.warn('getSchedulesByStatusAction called with no status')
    return { success: true, data: [] }
  }

  try {
    const schedules = await scheduleRepository.fetchByStatus(status)
    return { success: true, data: schedules }
  } catch (error) {
    return handleError(error, 'getSchedulesByStatusAction')
  }
}
