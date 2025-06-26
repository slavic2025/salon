// src/core/domains/services/service.service.ts (Refactorizat în stilul stylist.service.ts)
import { createLogger } from '@/lib/logger'
import { AppError } from '@/lib/errors'
import { createServiceSchema, updateServiceSchema, type Service } from './service.types'
import { SERVICE_CONSTANTS } from './service.constants'

// Tipul pentru repository-ul nostru, pentru a fi folosit ca dependență
export type ServiceRepository = ReturnType<typeof import('./service.repository').createServiceRepository>

/**
 * Factory Function care creează și returnează un obiect service pentru servicii.
 * @param repository - O instanță a repository-ului de servicii.
 * @returns Un obiect cu metode de business pentru gestionarea serviciilor.
 */
export function createServiceService(repository: ServiceRepository) {
  const logger = createLogger('ServiceService')

  return {
    /** Preia toate serviciile. */
    async findAllServices(): Promise<Service[]> {
      const result = await repository.findAll()
      return result ?? []
    },

    /** Preia toate serviciile active. */
    async findActiveServices(): Promise<Service[]> {
      const result = await repository.findActive()
      return result ?? []
    },

    /** Preia un serviciu după ID. */
    async findServiceById(id: string): Promise<Service | null> {
      return repository.findById(id)
    },

    /**
     * Creează un nou serviciu, cu verificare pentru duplicate.
     */
    async createService(input: Record<string, unknown>): Promise<Service> {
      logger.debug('Attempting to create service...')
      try {
        const payload = createServiceSchema.parse(input)
        const existingService = await repository.findByName(payload.name)
        if (existingService) {
          throw new AppError(SERVICE_CONSTANTS.MESSAGES.ERROR.BUSINESS.DUPLICATE_NAME)
        }
        return repository.create(payload)
      } catch (error) {
        logger.error('Failed to create service', { error, input })
        if (error instanceof AppError) throw error // Re-aruncăm erorile de business
        throw new AppError(SERVICE_CONSTANTS.MESSAGES.ERROR.SERVER.CREATE, error)
      }
    },

    /**
     * Actualizează un serviciu.
     */
    async updateService(input: Record<string, unknown>): Promise<Service> {
      logger.debug('Attempting to update service...')
      try {
        const validatedData = updateServiceSchema.parse(input)
        const { id, ...dataToUpdate } = validatedData
        if (dataToUpdate.name) {
          const existingService = await repository.findByName(dataToUpdate.name)
          if (existingService && existingService.id !== id) {
            throw new AppError(SERVICE_CONSTANTS.MESSAGES.ERROR.BUSINESS.DUPLICATE_NAME)
          }
        }
        return repository.update({ id, data: dataToUpdate })
      } catch (error) {
        logger.error('Failed to update service', { error, input })
        if (error instanceof AppError) throw error
        throw new AppError(SERVICE_CONSTANTS.MESSAGES.ERROR.SERVER.UPDATE, error)
      }
    },

    /**
     * Șterge un serviciu.
     */
    async deleteService(id: string): Promise<void> {
      logger.debug(`Business logic: Checking if service ${id} can be deleted...`)
      return repository.delete(id)
    },
  }
}
