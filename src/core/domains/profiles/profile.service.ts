import { createLogger } from '@/lib/logger'
import { AppError } from '@/lib/errors'
import { createProfileRepository } from './profile.repository'
import type { Profile } from './profile.types'
import { PROFILE_CONSTANTS } from './profile.constants' // Asigură-te că ai acest fișier

type ProfileRepository = ReturnType<typeof createProfileRepository>

/**
 * Factory Function care creează serviciul pentru profiluri.
 * Rolul său este de a gestiona logica legată strict de tabela `profiles`.
 */
export function createProfileService(repository: ProfileRepository) {
  const logger = createLogger('ProfileService')

  return {
    /**
     * Găsește un profil după ID. Aruncă o eroare dacă nu este găsit.
     * Este folosit de alte servicii pentru a obține, de exemplu, rolul unui utilizator.
     */
    async findProfileById(id: string): Promise<Profile> {
      logger.debug(`Fetching profile by id: ${id}`)
      const profile = await repository.findById(id)

      if (!profile) {
        logger.warn(`Profile not found for id: ${id}`)
        throw new AppError(PROFILE_CONSTANTS.MESSAGES.ERROR.NOT_FOUND)
      }

      return profile
    },

    // Aici pot fi adăugate alte metode specifice, ex: `updateUserRole(id, role)`
  }
}
