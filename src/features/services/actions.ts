// src/features/services/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { serviceRepository } from '@/core/domains/services/service.repository'
import { addServiceSchema, editServiceSchema, deleteServiceSchema } from '@/core/domains/services/service.types'
import { ActionResponse } from '@/types/actions.types'
import { formatZodErrors } from '@/lib/form'
import { Service } from '@/core/domains/services/service.types'

const logger = createLogger('ServiceActions')

function formDataToObject(formData: FormData) {
  const object: Record<string, any> = {}
  formData.forEach((value, key) => {
    if (key === 'is_active') {
      object[key] = value === 'on'
    } else if (key === 'description' || key === 'category') {
      // Allow empty strings to become null for optional fields
      object[key] = value === '' ? null : value
    } else {
      object[key] = value
    }
  })
  if (object.is_active === undefined) {
    object.is_active = false
  }
  return object
}

export async function addServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('addServiceAction invoked', { rawData })

  const validationResult = addServiceSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { success: false, message: 'Validation Error', errors: formatZodErrors(validationResult.error) }
  }

  try {
    await serviceRepository.create(validationResult.data)
    revalidatePath('/admin/services')
    return { success: true, message: 'Serviciul a fost adăugat cu succes!' }
  } catch (error) {
    logger.error('Error in addServiceAction', { error })
    return { success: false, message: (error as Error).message }
  }
}

export async function editServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('editServiceAction invoked', { rawData })

  const validationResult = editServiceSchema.safeParse(rawData)
  if (!validationResult.success) {
    return { success: false, message: 'Validation Error', errors: formatZodErrors(validationResult.error) }
  }

  try {
    const { id, ...dataToUpdate } = validationResult.data
    await serviceRepository.update(id, dataToUpdate)
    revalidatePath('/admin/services')
    return { success: true, message: 'Serviciul a fost actualizat cu succes!' }
  } catch (error) {
    logger.error('Error in editServiceAction', { error })
    return { success: false, message: (error as Error).message }
  }
}

export async function deleteServiceAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const id = formData.get('id')
  const validationResult = deleteServiceSchema.safeParse(id)

  if (!validationResult.success) {
    return { success: false, message: 'Invalid ID for deletion.' }
  }

  try {
    await serviceRepository.remove(validationResult.data)
    revalidatePath('/admin/services')
    return { success: true, message: 'Serviciul a fost șters cu succes.' }
  } catch (error) {
    logger.error('Error in deleteServiceAction', { error })
    return { success: false, message: (error as Error).message }
  }
}

export async function getServicesAction(): Promise<Service[]> {
  try {
    return await serviceRepository.fetchAll()
  } catch (error) {
    logger.error('getServicesAction failed', { error })
    return []
  }
}
