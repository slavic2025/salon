// src/features/services/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { serviceRepository } from '@/core/domains/services/service.repository'
import { addServiceSchema, editServiceSchema, deleteServiceSchema } from '@/core/domains/services/service.types'
import { ActionResponse } from '@/types/actions.types'
import { Service } from '@/core/domains/services/service.types'
import { formDataToObject } from '@/lib/form-utils'
import { SERVICE_MESSAGES, SERVICE_PATHS } from './constants'
import { handleValidationError, handleServerError } from '../common/utils'

const logger = createLogger('ServiceActions')

type ServiceAction = 'add' | 'edit' | 'delete'

/**
 * Acțiune pentru adăugarea unui nou serviciu.
 */
export async function addServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('addServiceAction invoked', { rawData })

  const validationResult = addServiceSchema.safeParse(rawData)
  if (!validationResult.success) {
    return handleValidationError(validationResult.error, SERVICE_MESSAGES.ERROR.VALIDATION)
  }

  try {
    await serviceRepository.create(validationResult.data)
    revalidatePath(SERVICE_PATHS.revalidation())
    return { success: true, message: SERVICE_MESSAGES.SUCCESS.ADDED }
  } catch (error) {
    logger.error('Error in addServiceAction', { error })
    return handleServerError(error, SERVICE_MESSAGES.ERROR.SERVER.ADD)
  }
}

/**
 * Acțiune pentru actualizarea unui serviciu existent.
 */
export async function editServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('editServiceAction invoked', { rawData })

  const validationResult = editServiceSchema.safeParse(rawData)
  if (!validationResult.success) {
    return handleValidationError(validationResult.error, SERVICE_MESSAGES.ERROR.VALIDATION)
  }

  try {
    const { id, ...dataToUpdate } = validationResult.data
    await serviceRepository.update(id, dataToUpdate)
    revalidatePath(SERVICE_PATHS.revalidation())
    return { success: true, message: SERVICE_MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    logger.error('Error in editServiceAction', { error })
    return handleServerError(error, SERVICE_MESSAGES.ERROR.SERVER.UPDATE)
  }
}

/**
 * Acțiune pentru ștergerea unui serviciu.
 */
export async function deleteServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id')
  const validationResult = deleteServiceSchema.safeParse(id)

  if (!validationResult.success) {
    return { success: false, message: SERVICE_MESSAGES.ERROR.INVALID_ID }
  }

  try {
    await serviceRepository.remove(validationResult.data)
    revalidatePath(SERVICE_PATHS.revalidation())
    return { success: true, message: SERVICE_MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    logger.error('Error in deleteServiceAction', { error })
    return handleServerError(error, SERVICE_MESSAGES.ERROR.SERVER.DELETE)
  }
}

/**
 * Acțiune pentru preluarea tuturor serviciilor.
 */
export async function getServicesAction(): Promise<Service[]> {
  try {
    return await serviceRepository.fetchAll()
  } catch (error) {
    logger.error('getServicesAction failed', { error })
    return []
  }
}
