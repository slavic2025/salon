// src/core/domains/stylists/stylist.service.ts (Varianta finală, refactorizată)

import { createLogger } from '@/lib/logger'
import { AppError, UniquenessError } from '@/lib/errors'
import { createAdminClient } from '@/lib/supabase-admin'
import { createStylistRepository } from './stylist.repository'
import { createStylistSchema, updateStylistSchema, type Stylist, type StylistUpdatePayload } from './stylist.types'
import { STYLIST_CONSTANTS } from './stylist.constants'

type StylistRepository = ReturnType<typeof createStylistRepository>

export function createStylistService(repository: StylistRepository) {
  const logger = createLogger('StylistService')

  async function _checkUniqueness(
    // Pasul 1: Adăugăm `phone` la tipul de date acceptat
    data: { email?: string | null; phone?: string | null },
    idToExclude: string | null = null
  ) {
    const errors: { field: string; message: string }[] = []

    // Verificarea pentru email (rămâne neschimbată)
    if (data.email) {
      const existing = await repository.findByEmail(data.email)
      if (existing && existing.id !== idToExclude) {
        errors.push({ field: 'email', message: STYLIST_CONSTANTS.MESSAGES.ERROR.BUSINESS.DUPLICATE_EMAIL })
      }
    }

    // --- SECȚIUNEA NOUĂ ---
    // Pasul 2: Adăugăm logica de verificare pentru telefon
    if (data.phone) {
      const existing = await repository.findByPhone(data.phone)
      if (existing && existing.id !== idToExclude) {
        errors.push({ field: 'phone', message: STYLIST_CONSTANTS.MESSAGES.ERROR.BUSINESS.DUPLICATE_PHONE })
      }
    }
    // --- SFÂRȘITUL SECȚIUNII NOI ---

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

    /**
     * Orchestrează crearea completă a unui stilist: cont de autentificare + profil de stilist.
     */
    async createStylist(input: Record<string, unknown>): Promise<Stylist> {
      logger.debug('Creating a new stylist from invitation...')
      const payload = createStylistSchema.parse(input)

      await _checkUniqueness({ email: payload.email })

      const supabaseAdmin = createAdminClient()
      const {
        data: { user },
        error: creationError,
      } = await supabaseAdmin.auth.admin.createUser({
        email: payload.email,
        email_confirm: true,
      })

      if (creationError || !user) {
        throw new AppError(STYLIST_CONSTANTS.MESSAGES.ERROR.AUTH.CREATE_USER_FAILED, creationError)
      }

      try {
        const newStylist = await repository.create({
          full_name: payload.full_name,
          email: payload.email,
          phone: payload.phone,
          description: payload.description,
          is_active: payload.is_active,
        })
        // Aici ai putea trimite un email de bun venit, separat de cel de invitație de la Supabase
        return newStylist
      } catch (repoError) {
        logger.error('Stylist data creation failed, rolling back auth user...', { userId: user.id })
        await supabaseAdmin.auth.admin.deleteUser(user.id)
        throw new AppError(STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.CREATE, repoError)
      }
    },

    /**
     * Actualizează un stilist. Acum orchestrează actualizarea în ambele tabele.
     */
    async updateStylist(input: Record<string, unknown>): Promise<Stylist> {
      logger.debug('Attempting to update stylist...')

      const { id, ...dataToUpdate } = updateStylistSchema.parse(input)

      // Verificarea de unicitate rămâne importantă
      await _checkUniqueness({ email: dataToUpdate.email, phone: dataToUpdate.phone }, id)

      // --- Logica de Sincronizare ---

      // Pasul 1: Actualizează datele de autentificare în `auth.users` dacă s-au schimbat
      if (dataToUpdate.email || dataToUpdate.phone) {
        const supabaseAdmin = createAdminClient()
        const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
          id, // ID-ul din `stylists` este același cu cel din `auth.users`
          {
            email: dataToUpdate.email,
            phone: dataToUpdate.phone ?? undefined,
          }
        )

        if (authUpdateError) {
          throw new AppError(STYLIST_CONSTANTS.MESSAGES.ERROR.AUTH.UPDATE_USER_FAILED, authUpdateError)
        }
      }

      // Pasul 2: Actualizează datele de business în `public.stylists`
      // Ne asigurăm că nu încercăm să actualizăm email/phone dacă nu există în dataToUpdate.
      const stylistDataForUpdate = {
        full_name: dataToUpdate.full_name,
        description: dataToUpdate.description,
        is_active: dataToUpdate.is_active,
        // Adaugă alte câmpuri specifice tabelei `stylists` aici
      }

      return repository.update({ id, data: stylistDataForUpdate })
    },

    /** Orchestrează ștergerea completă a unui stilist. */
    async deleteStylist(stylistId: string): Promise<void> {
      logger.debug(`Deleting stylist with id: ${stylistId}`)

      // Asigură-te că ID-ul din tabela 'stylists' este același cu cel din 'auth.users'
      // Aceasta este o practică bună pentru a menține consistența.
      const supabaseAdmin = createAdminClient()

      const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(stylistId)

      // Chiar dacă user-ul de auth nu a fost găsit, încercăm să ștergem înregistrarea de stilist
      // pentru a curăța datele orfane. 'ON DELETE CASCADE' ar trebui să gestioneze asta,
      // dar o ștergere explicită este mai sigură.
      if (deleteAuthError && deleteAuthError.name !== 'NotFoundError') {
        throw new AppError(STYLIST_CONSTANTS.MESSAGES.ERROR.AUTH.DELETE_USER_FAILED, deleteAuthError)
      }

      await repository.delete(stylistId)
    },

    /** Trimite (sau re-trimite) invitația de setare a parolei. */
    async sendPasswordResetLink(stylistId: string): Promise<void> {
      const stylist = await repository.findById(stylistId)
      if (!stylist?.email) {
        throw new AppError(STYLIST_CONSTANTS.MESSAGES.ERROR.NOT_FOUND)
      }

      const supabaseAdmin = createAdminClient()
      const { error: resetError } = await supabaseAdmin.auth.admin.inviteUserByEmail(stylist.email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/account-setup`,
      })

      if (resetError) {
        throw new AppError(STYLIST_CONSTANTS.MESSAGES.ERROR.SERVER.RESET_PASSWORD, resetError)
      }
    },
  }
}
