// src/core/domains/stylists/stylist.service.ts (Varianta finală, refactorizată)

import { createLogger } from '@/lib/logger'
import { AppError, DatabaseError, UniquenessError } from '@/lib/errors'
import { createStylistRepository } from './stylist.repository'
import { createStylistSchema, updateStylistSchema, type Stylist, type StylistUpdatePayload } from './stylist.types'
import { STYLIST_CONSTANTS } from './stylist.constants' // Asigură-te că ai acest fișier de constante
import { createAdminClient } from '@/lib/supabase-admin'

type StylistRepository = ReturnType<typeof createStylistRepository>

/**
 * Factory Function care creează serviciul pentru stiliști.
 */
export function createStylistService(repository: StylistRepository) {
  const logger = createLogger('StylistService')

  /**
   * Helper intern pentru a verifica unicitatea câmpurilor.
   * Acum face parte din logica de business a serviciului.
   */
  async function _checkUniqueness(
    data: { fullName?: string | null; email?: string | null; phone?: string | null },
    idToExclude: string | null = null
  ) {
    const errors: { field: string; message: string }[] = []

    if (data.fullName) {
      const existing = await repository.findByFullName(data.fullName)
      if (existing && existing.id !== idToExclude) {
        errors.push({ field: 'full_name', message: STYLIST_CONSTANTS.MESSAGES.ERROR.BUSINESS.DUPLICATE_NAME })
      }
    }
    if (data.email) {
      const existing = await repository.findByEmail(data.email)
      if (existing && existing.id !== idToExclude) {
        errors.push({ field: 'email', message: STYLIST_CONSTANTS.MESSAGES.ERROR.BUSINESS.DUPLICATE_EMAIL })
      }
    }
    // Repetă pentru 'phone' dacă este necesar...

    if (errors.length > 0) {
      throw new UniquenessError('Uniqueness check failed', errors)
    }
  }

  return {
    /** Preia toți stiliștii. */
    async findAllStylists(): Promise<Stylist[]> {
      return repository.findAll()
    },

    /** Preia un stilist după ID. */
    async findStylistById(id: string): Promise<Stylist | null> {
      return repository.findById(id)
    },

    /** Creează un nou stilist, cu validare și verificare de unicitate. */
    async createStylist(input: Record<string, unknown>): Promise<Stylist> {
      const payload = createStylistSchema.parse(input)
      await _checkUniqueness({ fullName: payload.full_name, email: payload.email, phone: payload.phone })
      return repository.create(payload)
    },

    /** Actualizează un stilist, cu validare și verificare de unicitate. */
    async updateStylist(input: Record<string, unknown>): Promise<Stylist> {
      const { id, ...dataToUpdate } = updateStylistSchema.parse(input)
      await _checkUniqueness(
        { fullName: dataToUpdate.full_name, email: dataToUpdate.email, phone: dataToUpdate.phone },
        id
      )
      return repository.update({ id, data: dataToUpdate })
    },

    /** Șterge un stilist. */
    async deleteStylist(id: string): Promise<void> {
      // Aici poți adăuga logica de business, ex: verifică dacă stilistul are programări viitoare
      return repository.delete(id)
    },

    async sendPasswordResetLink(stylistId: string): Promise<void> {
      logger.debug(`Sending password reset for stylistId: ${stylistId}`)

      const stylistToReset = await repository.findById(stylistId)
      if (!stylistToReset?.email) {
        throw new AppError(STYLIST_CONSTANTS.MESSAGES.ERROR.NOT_FOUND)
      }

      // Folosirea clientului de admin trebuie să se facă cu grijă,
      // și este perfect ca această logică să fie izolată în serviciu.
      const supabaseAdmin = createAdminClient()
      const { error: resetError } = await supabaseAdmin.auth.admin.inviteUserByEmail(stylistToReset.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}${STYLIST_CONSTANTS.PATHS.pages.list}`,
      })

      if (resetError) {
        throw new DatabaseError('Failed to send password reset invite.', resetError)
      }
    },
  }
}
