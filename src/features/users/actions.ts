'use server'

import { revalidatePath } from 'next/cache'
import { createLogger } from '@/lib/logger'
import { userRepository } from '@/core/domains/users/user.repository'
import {
  addUserSchema,
  editUserSchema,
  deleteUserSchema,
  updateUserProfileSchema,
  User,
  UserProfile,
} from '@/core/domains/users/user.types'
import { ActionResponse } from '@/types/actions.types'
import { formDataToObject } from '@/lib/form-utils'
import { USER_MESSAGES, USER_PATHS } from '@/core/domains/users/user.constants'
import { handleError, handleValidationError } from '@/lib/action-helpers'
import { UserService } from '@/core/domains/users/user.service'

const logger = createLogger('UserActions')
const userService = new UserService()

/**
 * Acțiune pentru adăugarea unui nou utilizator.
 */
export async function addUserAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = Object.fromEntries(formData.entries())
  const validationResult = addUserSchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  try {
    await userService.createUser(validationResult.data)
    revalidatePath(USER_PATHS.revalidation())
    return { success: true, message: USER_MESSAGES.SUCCESS.CREATED }
  } catch (error) {
    return handleError(error, 'addUserAction')
  }
}

/**
 * Acțiune pentru editarea unui utilizator existent.
 */
export async function editUserAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  logger.debug('editUserAction invoked', { rawData })

  const validationResult = editUserSchema.safeParse(rawData)
  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  const { id, ...dataToUpdate } = validationResult.data

  try {
    await userService.updateUser(id, dataToUpdate)
    revalidatePath(USER_PATHS.revalidation())
    return { success: true, message: USER_MESSAGES.SUCCESS.UPDATED }
  } catch (error) {
    return handleError(error, 'editUserAction')
  }
}

/**
 * Acțiune pentru ștergerea unui utilizator.
 */
export async function deleteUserAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const userId = formData.get('id')
  const validationResult = deleteUserSchema.safeParse(userId)
  if (!validationResult.success) {
    return { success: false, message: USER_MESSAGES.ERROR.VALIDATION.INVALID_ID }
  }

  const validUserId = validationResult.data

  try {
    await userService.deleteUser(validUserId)
    revalidatePath(USER_PATHS.revalidation())
    return { success: true, message: USER_MESSAGES.SUCCESS.DELETED }
  } catch (error) {
    return handleError(error, 'deleteUserAction')
  }
}

/**
 * Acțiune pentru preluarea tuturor utilizatorilor.
 */
export async function getUsersAction(): Promise<User[]> {
  try {
    const users = await userRepository.fetchAll()
    logger.info('Users retrieved successfully', { count: users.length })
    return users
  } catch (error) {
    logger.error('Failed to fetch users', { error })
    return []
  }
}

/**
 * Acțiune pentru preluarea profilului unui utilizator.
 */
export async function getUserProfileAction(userId: string): Promise<UserProfile | null> {
  if (!userId) {
    logger.warn('getUserProfileAction called with no userId')
    return null
  }

  try {
    const profile = await userService.getUserProfile(userId)
    return profile
  } catch (error) {
    logger.error('Failed to fetch user profile', { error, userId })
    return null
  }
}

/**
 * Acțiune pentru actualizarea profilului unui utilizator.
 */
export async function updateUserProfileAction(prevState: ActionResponse, formData: FormData): Promise<ActionResponse> {
  const rawData = formDataToObject(formData)
  const validationResult = updateUserProfileSchema.safeParse(rawData)

  if (!validationResult.success) {
    return handleValidationError(validationResult.error)
  }

  const { id, ...dataToUpdate } = validationResult.data

  try {
    await userService.updateUserProfile(id, dataToUpdate)
    revalidatePath(USER_PATHS.revalidation())
    return { success: true, message: USER_MESSAGES.SUCCESS.PROFILE_UPDATED }
  } catch (error) {
    return handleError(error, 'updateUserProfileAction')
  }
}
