import { createLogger } from '@/lib/logger'
import { addServiceToStylistSchema, removeServiceFromStylistSchema } from './service-offered.types'
import { AppError, UniquenessError } from '@/lib/errors'
import { SERVICES_OFFERED_CONSTANTS } from './service-offered.constants'

export function createServicesOfferedService(
  repository: ReturnType<typeof import('./service-offered.repository').createServicesOfferedRepository>
) {
  const logger = createLogger('ServicesOfferedService')

  return {
    /** Adaugă un serviciu unui stilist, cu verificare de unicitate. */
    async addServiceToStylist(input: Record<string, unknown>): Promise<void> {
      logger.debug('Adding service to stylist...', { input })

      // 1. Validăm și transformăm datele de intrare folosind schema Zod.
      // `.parse()` aruncă automat eroare dacă validarea eșuează.
      const payload = addServiceToStylistSchema.parse(input)

      // 2. (Exemplu de Logică de Business) Verificăm dacă legătura există deja
      const existing = await repository.checkUniqueness(payload.stylist_id, payload.service_id)
      if (existing) {
        throw new UniquenessError('Uniqueness check failed', [
          { field: 'service_id', message: SERVICES_OFFERED_CONSTANTS.MESSAGES.ERROR.BUSINESS.DUPLICATE },
        ])
      }

      // 3. Trimitem payload-ul validat și sigur la repository
      await repository.create(payload)
    },

    /** Șterge o legătură serviciu-stilist. */
    async deleteaddServiceToStylist(input: Record<string, unknown>): Promise<void> {
      logger.debug('Removing service from stylist...')
      try {
        const { id } = removeServiceFromStylistSchema.parse(input)

        // 2. Apelăm repository-ul cu ID-ul validat.
        await repository.delete(id)
      } catch (error) {
        logger.error('Failed to delete service from stylist', { error, input })
        if (error instanceof AppError) throw error
        throw new AppError(SERVICES_OFFERED_CONSTANTS.MESSAGES.ERROR.SERVER.DELETE, error)
      }
    },
    async findOfferedServicesByStylist(stylistId: string) {
      logger.debug(`Finding services for stylist: ${stylistId}`)
      const result = await repository.findByStylistId(stylistId)
      return result ?? []
    },
  }
}
