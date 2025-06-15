// src/core/domains/services/service.service.ts (Varianta finală, refactorizată)
import { createLogger } from '@/lib/logger'
import { AppError } from '@/lib/errors'
import { createServiceRepository } from './service.repository'
import {
  createServiceSchema,
  updateServiceSchema,
  type Service,
  type ServiceCreateData,
  type ServiceUpdatePayload,
} from './service.types'
import { SERVICE_CONSTANTS } from './service.constants' // Presupunând că ai un fișier de constante

// Tipul pentru repository-ul nostru, pentru a fi folosit ca dependență
type ServiceRepository = ReturnType<typeof createServiceRepository>

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
      return repository.findAll()
    },

    /** Preia toate serviciile active. */
    async findActiveServices(): Promise<Service[]> {
      return repository.findActive()
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
        // Prindem atât erorile de validare Zod, cât și cele de business sau de la DB
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
        // 1. Validăm datele de intrare folosind schema de update.
        // `validatedData` va conține `id` și câmpurile opționale care au fost trimise.
        const validatedData = updateServiceSchema.parse(input)

        // 2. Separăm ID-ul de datele care trebuie efectiv actualizate.
        const { id, ...dataToUpdate } = validatedData

        // 3. (Exemplu de Logică de Business) Verificăm dacă noul nume, dacă a fost schimbat,
        // nu intră în conflict cu un alt serviciu existent.
        if (dataToUpdate.name) {
          const existingService = await repository.findByName(dataToUpdate.name)
          // Ne asigurăm că serviciul găsit nu este chiar cel pe care îl actualizăm
          if (existingService && existingService.id !== id) {
            throw new AppError(SERVICE_CONSTANTS.MESSAGES.ERROR.BUSINESS.DUPLICATE_NAME)
          }
        }

        // 4. Construim payload-ul și apelăm repository-ul.
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
      // Aici se poate adăuga logică de business, ex: verificarea dacă serviciul
      // este folosit în programări active înainte de a permite ștergerea.
      logger.debug(`Business logic: Checking if service ${id} can be deleted...`)

      return repository.delete(id)
    },
  }
}
