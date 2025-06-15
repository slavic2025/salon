import { unavailabilityRepository } from './unavailability.repository'
import { UnavailabilityCreateData, Unavailability } from './unavailability.types'
import { createLogger } from '@/lib/logger'
import { UNAVAILABILITY_MESSAGES } from './unavailability.constants'

const logger = createLogger('UnavailabilityService')

export class UnavailabilityService {
  async createUnavailability(data: UnavailabilityCreateData): Promise<Unavailability> {
    logger.debug('Creating unavailability', { data })
    try {
      const result = await unavailabilityRepository.create(data)
      logger.info('Unavailability created successfully', { id: result.id })
      return result
    } catch (error) {
      logger.error('Failed to create unavailability', { error, data })
      throw new Error(UNAVAILABILITY_MESSAGES.ERROR.SERVER)
    }
  }

  async updateUnavailability(id: string, data: Partial<UnavailabilityCreateData>): Promise<Unavailability> {
    logger.debug('Updating unavailability', { id, data })
    try {
      const result = await unavailabilityRepository.update(id, data)
      logger.info('Unavailability updated successfully', { id })
      return result
    } catch (error) {
      logger.error('Failed to update unavailability', { error, id, data })
      throw new Error(UNAVAILABILITY_MESSAGES.ERROR.SERVER)
    }
  }

  async deleteUnavailability(id: string): Promise<void> {
    logger.debug('Deleting unavailability', { id })
    try {
      await unavailabilityRepository.delete(id)
      logger.info('Unavailability deleted successfully', { id })
    } catch (error) {
      logger.error('Failed to delete unavailability', { error, id })
      throw new Error(UNAVAILABILITY_MESSAGES.ERROR.SERVER)
    }
  }
}
